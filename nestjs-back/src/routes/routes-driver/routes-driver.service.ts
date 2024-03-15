import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PrismaService } from 'src/prisma/prisma/prisma.service';

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
  ) {}

  async createOrUpdate(dto: CreateOrUpdateDto) {
    // Tente encontrar um RouteDriver com base no route_id
    const existingRouteDriver = await this.prismaService.routeDriver.findFirst({
      where: { route_id: dto.route_id },
    });

    if (existingRouteDriver) {
      console.log('Ja existe route driver');
      const updatedPoints = existingRouteDriver.points
        ? JSON.parse(existingRouteDriver.points)
        : [];
      updatedPoints.push({
        location: { lat: dto.lat, lng: dto.lng },
        created_at: new Date(),
      });

      const routeDriver = await this.prismaService.routeDriver.update({
        where: { id: existingRouteDriver.id },
        data: { points: JSON.stringify(updatedPoints) },
      });
      await this.kafkaProducerQueue.add({
        event: 'RouteMoved',
        id: routeDriver.id,
        name: routeDriver.route_id,
        started_at: new Date(),
        lat: dto.lat,
        lng: dto.lng,
      });
      return routeDriver;
    } else {
      // Se não existir, crie um novo RouteDriver...
      console.log('não existe route driver');

      const initialPoints = [
        { location: { lat: dto.lat, lng: dto.lng }, created_at: new Date() },
      ];

      const routeDriver = await this.prismaService.routeDriver.create({
        data: {
          route: { connect: { id: dto.route_id } },
          points: JSON.stringify(initialPoints),
          status: 'iniciado',
        },
      });

      await this.kafkaProducerQueue.add({
        event: 'RouteStarted',
        id: routeDriver.id,
        name: routeDriver.route_id,
        started_at: new Date(),
        lat: dto.lat,
        lng: dto.lng,
      });

      return routeDriver;
    }
  }
}
