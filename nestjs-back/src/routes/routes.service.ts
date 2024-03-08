import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { DirectionsService } from 'src/maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    // private directionsService: DirectionsService,
    // @Inject('KAFKA_SERVICE')
    // private kafkaService: ClientKafka,
  ) {}
  create(createRouteDto: CreateRouteDto) {
    // this.directionsService.getDirections(
    //   createRouteDto.sourceName,
    //   createRouteDto.destinationName,
    // );
    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        sourceName: createRouteDto.sourceName,
        sourcePlaceId: createRouteDto.sourcePlaceId, // Adicionado
        sourceLat: createRouteDto.sourceLat,
        sourceLng: createRouteDto.sourceLng,
        destinationName: createRouteDto.destinationName,
        destinationPlaceId: createRouteDto.destinationPlaceId, // Adicionado
        destinationLat: createRouteDto.destinationLat,
        destinationLng: createRouteDto.destinationLng,
        directions: '{}',
        distance: 0,
        duration: 0,
      },
    });
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
