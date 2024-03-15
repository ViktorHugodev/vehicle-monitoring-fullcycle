import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';
interface CreateOrUpdateDto {
  route_id: string;
  lat: number;
  lng: number;
}

@Injectable()
export class RoutesDriverService {
  constructor(
    private prismaService: PrismaService,
    @InjectQueue('kafka-producer') private kafkaProducerQueue: Queue,
    @InjectMetric('route_started_counter') private routeStartedCounter: Counter,
    @InjectMetric('route_finished_counter')
    private routeFinishedCounter: Counter,
  ) {}

  async createOrUpdate(dto: CreateOrUpdateDto) {
    const route = await this.prismaService.route.findUnique({
      where: { id: dto.route_id },
    });

    if (!route) {
      throw new Error('Route not found');
    }

    const existingRouteDriver = await this.prismaService.routeDriver.findFirst({
      where: { route_id: dto.route_id },
    });

    const directions = JSON.parse(route.directions);
    const lastStep = directions.routes[0].legs[0].steps.slice(-1)[0];
    const isLastPoint =
      lastStep.end_location.lat === dto.lat &&
      lastStep.end_location.lng === dto.lng;

    if (existingRouteDriver) {
      console.log('Updating existing route driver');
      const updatedPoints = existingRouteDriver.points
        ? JSON.parse(existingRouteDriver.points)
        : [];
      updatedPoints.push({
        location: { lat: dto.lat, lng: dto.lng },
        created_at: new Date(),
      });

      await this.prismaService.routeDriver.update({
        where: { id: existingRouteDriver.id },
        data: { points: JSON.stringify(updatedPoints) },
      });

      if (isLastPoint) {
        this.routeFinishedCounter.inc();
        await this.kafkaProducerQueue.add({
          event: 'RouteFinished',
          id: route.id,
          name: route.name,
          finished_at: new Date().toISOString(),
          lat: dto.lat,
          lng: dto.lng,
        });
      } else {
        await this.kafkaProducerQueue.add({
          event: 'RouteMoved',
          id: route.id,
          name: route.name,
          lat: dto.lat,
          lng: dto.lng,
        });
      }

      return existingRouteDriver;
    } else {
      console.log('Creating new route driver');
      const initialPoints = [
        { location: { lat: dto.lat, lng: dto.lng }, created_at: new Date() },
      ];

      const routeDriver = await this.prismaService.routeDriver.create({
        data: {
          route_id: dto.route_id,
          points: JSON.stringify(initialPoints),
        },
      });

      this.routeStartedCounter.inc();
      await this.kafkaProducerQueue.add({
        event: 'RouteStarted',
        id: route.id,
        name: route.name,
        started_at: new Date().toISOString(),
        lat: dto.lat,
        lng: dto.lng,
      });

      return routeDriver;
    }
  }
}
