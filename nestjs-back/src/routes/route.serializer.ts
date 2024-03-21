import { DirectionsResponseData } from '@googlemaps/google-maps-services-js';
import { Route } from '@prisma/client';

interface ISerializedRoute {
  id: string;
  name: string;
  source: { name: string; location: { lat: number; lng: number } };
  destination: { name: string; location: { lat: number; lng: number } };
  waypoints?: { name: string; location: { lat: number; lng: number } }[];
  distance: number;
  duration: number;
  directions?: DirectionsResponseData & { request: any };
  created_at: Date;
  updated_at: Date;
}

export class RouteSerializer implements ISerializedRoute {
  id: string;
  name: string;
  source: { name: string; location: { lat: number; lng: number } };
  destination: { name: string; location: { lat: number; lng: number } };
  waypoints?: { name: string; location: { lat: number; lng: number } }[];
  distance: number;
  duration: number;
  directions?: DirectionsResponseData & { request: any };
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
    this.created_at = route.created_at;
    this.updated_at = route.updated_at;

    // Assegure que 'directions' seja uma string antes de analisá-la
    if (typeof route.directions === 'string') {
      this.directions = JSON.parse(route.directions);
    } else {
      // Tratar caso em que 'directions' não seja uma string
      this.directions = undefined; // Ou algum valor padrão que você considerar adequado
    }

    // Assegure que 'waypoints' seja uma string antes de analisá-la
    if (typeof route.waypoints === 'string') {
      this.waypoints = JSON.parse(route.waypoints).map((wp: any) => ({
        name: wp.name,
        location: { lat: wp.lat, lng: wp.lng },
      }));
    } else {
      // Tratar caso em que 'waypoints' não seja uma string
      this.waypoints = undefined; // Ou algum valor padrão que você considerar adequado
    }
  }
}
