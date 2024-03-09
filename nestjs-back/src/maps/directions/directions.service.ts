import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DirectionsRequest,
  Client as GoogleMapsClient,
  PlaceInputType,
  TravelMode,
} from '@googlemaps/google-maps-services-js';
@Injectable()
export class DirectionsService {
  constructor(
    private readonly googleMapsClient: GoogleMapsClient,
    private configService: ConfigService,
  ) {}

  async getDirections(sourceId: string, destinationId: string) {
    const requestParams: DirectionsRequest['params'] = {
      origin: `place_id:${sourceId.replace('place_id:', '')}`,
      destination: `place_id:${destinationId.replace('place_id:', '')}`,
      mode: TravelMode.driving,
      key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
    };
    console.log(
      '🚀 ~ DirectionsService ~ getDirections ~ requestParams:',
      requestParams,
    );
    const { data } = await this.googleMapsClient.directions({
      params: requestParams,
    });
    console.log('🚀 ~ DirectionsService ~ getDirections ~ data:', data);
    return {
      ...data,
      request: {
        origin: {
          place_id: requestParams.origin,
          location: {
            lat: data.routes[0].legs[0].start_location.lat,
            lng: data.routes[0].legs[0].start_location.lng,
          },
        },
        destination: {
          place_id: requestParams.destination,
          location: {
            lat: data.routes[0].legs[0].end_location.lat,
            lng: data.routes[0].legs[0].end_location.lng,
          },
        },
        mode: requestParams.mode,
      },
    };
  }
}
