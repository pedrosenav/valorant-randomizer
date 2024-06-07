'use client'

import Container from '@/components/Container'
import { pickRandomNumber } from '@/lib/utils'
import { Shuffle } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

interface MapAPIResponse {
  displayName: string
  splash: string
}

export default function Home() {
  // State and Variables
  const [maps, setMaps] = useState<MapAPIResponse[]>([])
  const [randomMap, setRandomMap] = useState<MapAPIResponse>()

  useEffect(() => {
    fetch('https://valorant-api.com/v1/maps')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setMaps(data.data)
      })
      .catch((err) => console.log(err))
  }, [])

  // Helper Functions

  function pickRandomMap() {
    return setRandomMap(maps[pickRandomNumber(0, maps.length - 1)])
  }

  // JSX Return
  return (
    <div>
      <Container className="py-5 flex flex-col items-center gap-5">
        <div className="min-w-full aspect-video bg-gray-800 rounded border-4 border-white flex items-center justify-center relative">
          <h1 className="font-alt uppercase tracking-wide text-9xl z-20">
            {randomMap?.displayName}
          </h1>
          <Image
            className="w-full h-full absolute brightness-50"
            width={800}
            height={800}
            src={randomMap?.splash ?? ''}
            alt={randomMap?.displayName ?? ''}
          />
        </div>
        <button
          className="bg-emerald-500 font-semibold py-3 px-5 rounded text-xl hover:bg-emerald-600 flex gap-2 items-center"
          onClick={pickRandomMap}
        >
          Sortear
          <Shuffle size={20} strokeWidth={3} />
        </button>
      </Container>
    </div>
  )
}
