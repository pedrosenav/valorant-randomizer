'use client'

import Container from '@/components/Container'
import { Card } from '@/components/ui/card'
import { cn, pickRandomItem, theRangeImage } from '@/lib/utils'
import { Shuffle } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export interface MapAPIResponse {
  displayName: string
  splash: string
  displayIcon: string
  listViewIconTall: string
  tacticalDescription: null | string
  coordinates: string
}

export default function Home() {
  // State and Variables
  const [maps, setMaps] = useState<MapAPIResponse[]>([])
  const [randomMap, setRandomMap] = useState<MapAPIResponse>()

  useEffect(() => {
    fetch('https://valorant-api.com/v1/maps')
      .then((res) => res.json())
      .then((res) =>
        res.data.filter((map: MapAPIResponse) => !!map.tacticalDescription),
      )
      .then((data) => {
        setMaps(data)
      })
      .catch((err) => console.log(err))
  }, [])

  // Helper Functions

  function pickRandomMap() {
    return setRandomMap(pickRandomItem(maps))
  }

  // JSX Return
  return (
    <div>
      <Container className="space-y-10 py-10">
        {/* Título */}
        <h1 className="text-center font-alt text-8xl tracking-wide">MAPA</h1>

        {/* Mapa */}
        <Card
          onClick={pickRandomMap}
          className="relative flex h-96 cursor-pointer items-center justify-center overflow-hidden bg-gray-800 shadow-lg"
        >
          {!randomMap && (
            <div>
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-xl font-semibold text-white">
                CLIQUE PARA SORTEAR
              </p>
              <Shuffle
                size={100}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 stroke-white opacity-5"
              />
            </div>
          )}

          {/* TODO: Add animations */}
          {/* Map Title */}
          <div className="z-30 text-center">
            <h2 className="font-alt text-7xl uppercase tracking-wide text-white sm:text-9xl">
              {randomMap?.displayName}
            </h2>
            <p className="tracking-widest text-white">
              {randomMap?.coordinates}
            </p>
          </div>

          {/* Map Image */}
          <Image
            className={cn(
              'absolute z-20 h-max w-full translate-x-1/4 opacity-10',
              !randomMap && 'hidden',
            )}
            width={1500}
            height={1500}
            loading="eager"
            draggable={false}
            src={randomMap?.displayIcon ?? theRangeImage}
            alt={randomMap?.displayName ?? theRangeImage}
          />

          {/* Map Background */}
          <Image
            className={cn(
              'absolute h-full object-cover brightness-50',
              !randomMap && 'hidden',
            )}
            width={1500}
            height={1500}
            loading="eager"
            draggable={false}
            src={randomMap?.splash ?? theRangeImage}
            alt={randomMap?.displayName ?? theRangeImage}
          />
        </Card>
      </Container>
    </div>
  )
}
