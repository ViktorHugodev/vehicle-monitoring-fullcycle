import { Injectable } from '@nestjs/common';
import {
  Client as GoogleMapsClient,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PlacesService {
  constructor(
    private readonly googleMapsClient: GoogleMapsClient,
    private configService: ConfigService,
  ) {}

  async findPlace(text: string) {
    console.log('🚀 ~ PlacesService ~ findPlace ~ text:', text);
    const { data } = await this.googleMapsClient.findPlaceFromText({
      params: {
        input: text,
        inputtype: PlaceInputType.textQuery,
        fields: ['place_id', 'formatted_address', 'geometry', 'name'],
        key: this.configService.get<string>('GOOGLE_MAPS_API_KEY'),
      },
    });
    console.log('🚀 ~ PlacesService ~ findPlace ~ data:', data);
    return data;
  }
}
