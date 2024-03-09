'use client'

import { useRef } from 'react'
import { useMap } from '../hooks/useMap'
import useSwr from 'swr'
import { fetcher } from '../utils/http'
import { Route } from '../utils/model'

export function DriverPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const map = useMap(mapContainerRef)

  const {
    data: routes,
    error,
    isLoading,
  } = useSwr<Route[]>('http://localhost:3333/routes', fetcher, {
    fallbackData: [],
  })

  async function startRoute() {
    const routeId = (document.getElementById('route') as HTMLSelectElement).value
    const response = await fetch(`http://localhost:3333/routes/${routeId}`)
    const route: Route = await response.json()
    console.log('🚀 ~ startRoute ~ route:', route)
    map?.removeAllRoutes()
    await map?.addRouteWithIcons({
      routeId: routeId,
      startMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
      endMarkerOptions: {
        position: route.directions.routes[0].legs[0].end_location,
      },
      carMarkerOptions: {
        position: route.directions.routes[0].legs[0].start_location,
      },
    })

    const { steps } = route.directions.routes[0].legs[0]

    for (const step of steps) {
      await sleep(2000)
      map?.moveCar(routeId, step.start_location)

      await sleep(2000)
      map?.moveCar(routeId, step.end_location)
    }
  }

  return (
    <div className='flex h-full w-100 '>
      <div className='w-[20%]'>
        <h1>Minha viagem</h1>
        <div>
          <select id='route'>
            {isLoading && <option>Carregando rotas...</option>}
            {routes!.map(route => (
              <option key={route.id} value={route.id}>
                {route.name}
              </option>
            ))}
          </select>
          <button type='submit' className='bg-gray-400 p-2 border rounded-sm' onClick={startRoute}>
            Iniciar a viagem
          </button>
        </div>
      </div>
      <div
        id='map'
        style={{
          height: '100%',
          width: '100%',
          border: '1px solid pink',
          backgroundColor: '#fff',
        }}
        ref={mapContainerRef}
      ></div>
    </div>
  )
}

export default DriverPage

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
