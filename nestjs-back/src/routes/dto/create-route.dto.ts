// export class CreateRouteDto {
//   name: string;
//   source_id: string;
//   destination_id: string;
// }
export class CreateRouteDto {
  name: string;
  sourceName: string;
  sourceLat: number;
  sourceLng: number;
  destinationName: string;
  destinationLat: number;
  destinationLng: number;
  distance: number;
  duration: number;
  directions: string;
}
