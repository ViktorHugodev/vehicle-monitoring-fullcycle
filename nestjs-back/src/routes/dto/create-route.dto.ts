// export class CreateRouteDto {
//   name: string;
//   source_id: string;
//   destination_id: string;
// }
export class CreateRouteDto {
  name: string;
  sourceName: string;
  sourcePlaceId: string; // Campo adicionado
  sourceLat: number;
  sourceLng: number;
  destinationName: string;
  destinationPlaceId: string; // Campo adicionado
  destinationLat: number;
  destinationLng: number;
  distance: number;
  duration: number;
  directions: string;
}
