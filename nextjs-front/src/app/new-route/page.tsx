'use client'

import type {
  DirectionsResponseData,
  FindPlaceFromTextResponseData,
} from '@googlemaps/google-maps-services-js'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useMap } from '../hooks/useMap'
import { socket } from '../utils/socket-io'
import Grid2 from '@mui/material/Unstable_Grid2'

export function NewRoutePage() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const map = useMap(mapContainerRef)
  const [directionsData, setDirectionsData] = useState<DirectionsResponseData & { request: any }>()

  async function searchPlaces(event: FormEvent) {
    event.preventDefault()
    const source = (document.getElementById('source') as HTMLInputElement).value
    const destination = (document.getElementById('destination') as HTMLInputElement).value

    const [sourceResponse, destinationResponse] = await Promise.all([
      fetch(`http://localhost:3333/places?text=${source}`),
      fetch(`http://localhost:3333/places?text=${destination}`),
    ])

    const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] = await Promise.all([
      sourceResponse.json(),
      destinationResponse.json(),
    ])

    if (sourcePlace.status !== 'OK') {
      console.error(sourcePlace)
      alert('Não foi possível encontrar a origem')
      return
    }

    if (destinationPlace.status !== 'OK') {
      console.error(destinationPlace)
      alert('Não foi possível encontrar o destino')
      return
    }

    const sourceId = sourcePlace.candidates[0].place_id
    const destinationId = destinationPlace.candidates[0].place_id

    const directionsResponse = await fetch(
      `http://localhost:3333/directions?originId=${sourceId}&destinationId=${destinationId}`,
    )

    const directionsData: DirectionsResponseData & { request: any } =
      await directionsResponse.json()
    console.log('🚀 ~ searchPlaces ~ directionsData:', directionsData)

    setDirectionsData(directionsData)
    map?.removeAllRoutes()
    await map?.addRouteWithIcons({
      routeId: '1',
      startMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: directionsData.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: directionsData.routes[0].legs[0].start_location,
      },
    })
  }

  async function createRoute() {
    const startAddress = directionsData!.routes[0].legs[0].start_address
    const endAddress = directionsData!.routes[0].legs[0].end_address
    const response = await fetch('http://localhost:3333/routes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `${startAddress} - ${endAddress}`,
        sourceId: directionsData!.request.origin.place_id,
        destinationId: directionsData!.request.destination.place_id,
      }),
    })

    const route = await response.json()
    console.log('🚀 ~ createRoute ~ route:', route)
    return route
  }
  function calculateRoutePrice() {
    if (!directionsData) return
    const distanceInKm = directionsData.routes[0].legs[0].distance.value / 1000 // Convertendo de metros para quilômetros
    const pricePerKm = 3 // R$3,00 por quilômetro
    const totalPrice = distanceInKm * pricePerKm

    // Formatando o resultado para moeda brasileira (Reais)
    const formattedPrice = totalPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
    return formattedPrice
  }

  return (
    <>
      <title>New-Route</title>
      <Grid2 container sx={{ display: 'flex', flex: 1 }}>
        <Grid2 xs={4}>
          <h1 className='text-slate-200 font-bold text-center'>Nova rota</h1>
          <form onSubmit={searchPlaces}>
            <div>
              <input id='source' type='text' placeholder='origem' />
            </div>
            <div>
              <input id='destination' type='text' placeholder='destino' />
            </div>
            <button>Pesquisar</button>
          </form>
          {directionsData && (
            <ul>
              <li>Origem {directionsData.routes[0].legs[0].start_address}</li>
              <li>Destino {directionsData.routes[0].legs[0].end_address}</li>
              <li>Distância: {directionsData.routes[0].legs[0].distance.text}</li>
              <li>Custo da rota em R$: {calculateRoutePrice()} </li>
              <li>
                <span>
                  o custo da rota é a distancia em km x o valor do km dividido pela quantidade de
                  alunos
                </span>
              </li>
              <li>
                <button onClick={createRoute}>Criar rota</button>
              </li>
            </ul>
          )}
        </Grid2>

        <Grid2 id='map' xs={8} ref={mapContainerRef}></Grid2>
      </Grid2>
    </>
  )
}

export default NewRoutePage
