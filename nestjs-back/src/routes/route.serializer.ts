import { DirectionsResponseData } from '@googlemaps/google-maps-services-js';
import { Route } from '@prisma/client';
interface ISerializedRoute {
  id: string;
  name: string;
  source: { name: string; location: { lat: number; lng: number } };
  destination: { name: string; location: { lat: number; lng: number } };
  distance: number;
  duration: number;
  created_at: Date;
  updated_at: Date;
}

export class RouteSerializer implements ISerializedRoute {
  id: string;
  name: string;
  source: { name: string; location: { lat: number; lng: number } };
  destination: { name: string; location: { lat: number; lng: number } };
  distance: number;
  duration: number;
  directions: DirectionsResponseData & { request: any };
  created_at: Date;
  updated_at: Date;

  constructor(route: Route) {
    this.id = route.id;
    this.name = route.name;
    this.source = {
      name: route.sourceName,
      location: { lat: route.sourceLat, lng: route.sourceLng },
    };
    this.destination = {
      name: route.destinationName,
      location: { lat: route.destinationLat, lng: route.destinationLng },
    };
    this.distance = route.distance;
    this.duration = route.duration;
    this.directions = JSON.parse(route.directions);
    this.created_at = route.created_at;
    this.updated_at = route.updated_at;
  }
}
