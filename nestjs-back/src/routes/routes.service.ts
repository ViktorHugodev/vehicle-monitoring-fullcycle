import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { PrismaService } from '../prisma/prisma/prisma.service';
import { DirectionsService } from '../maps/directions/directions.service';

@Injectable()
export class RoutesService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
    // @Inject('KAFKA_SERVICE')
    // private kafkaService: ClientKafka,
  ) {}
  async create(createRouteDto: CreateRouteDto) {
    console.log(
      '🚀 ~ RoutesService ~ create ~ createRouteDto:',
      createRouteDto,
    );

    const data = await this.directionsService.getDirections(
      createRouteDto.sourceId,
      createRouteDto.destinationId,
    );

    console.log('🚀 ~ RoutesService ~ create ~ data:', data);
    const { available_travel_modes, geocoded_waypoints, routes, request } =
      data;
    const legs = routes[0].legs[0];

    console.log('🚀 ~ RoutesService ~ create ~ legs:', legs);

    return this.prismaService.route.create({
      data: {
        name: createRouteDto.name,
        sourceName: legs.start_address,
        sourcePlaceId: createRouteDto.sourceId, // Adicionado
        sourceLat: legs.start_location.lat,
        sourceLng: legs.start_location.lng,
        destinationName: legs.end_address,
        destinationPlaceId: createRouteDto.destinationId, // Adicionado
        destinationLat: legs.end_location.lat,
        destinationLng: legs.end_location.lng,
        directions: JSON.stringify({
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
        }),
        distance: legs.distance.value,
        duration: legs.duration.value,
      },
    });
  }

  findAll() {
    return this.prismaService.route.findMany();
  }

  findOne(id: string) {
    return this.prismaService.route.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }
}
