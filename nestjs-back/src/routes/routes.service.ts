import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    // @Inject('KAFKA_SERVICE')
    // private kafkaService: ClientKafka,
  ) {}
  create(createRouteDto: CreateRouteDto) {
    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        sourceName: createRouteDto.sourceName,
        sourceLat: createRouteDto.sourceLat,
        sourceLng: createRouteDto.sourceLng,
        destinationName: createRouteDto.destinationName,
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
