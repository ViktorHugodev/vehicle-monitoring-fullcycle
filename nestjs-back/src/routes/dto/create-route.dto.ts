// export class CreateRouteDto {
//   name: string;
//   source_id: string;
//   destination_id: string;
// }
export class CreateRouteDto {
  name: string;
  sourceId: string; // ID do local de origem
  destinationId: string; // ID do local de destino
  waypoints?: { name: string; placeId: string }[]; // Waypoints são opcionais

  // Campos adicionais que você pode querer incluir:
  distance?: number; // Distância total da rota, opcional
  duration?: number; // Duração total da rota, opcional
  directions?: string; // Dados completos das direções como uma string JSON, opcional
}
export class CreateRouteWithDirectionsDto {
  name: string;
  sourceId: string;
  destinationId: string;
  waypoints?: { name: string; placeId: string }[];
  geocoded_waypoints: any[];
  routes: any[];
  status: string;
  request: {
    origin: {
      place_id: string;
      location: { lat: number; lng: number };
    };
    destination: {
      place_id: string;
      location: { lat: number; lng: number };
    };
    mode: string;
  };
}
