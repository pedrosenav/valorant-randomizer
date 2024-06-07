'use client'

import Container from '@/components/Container'
import { useState, useEffect } from 'react'
import { pickRandomNumber } from '@/lib/utils'
import { Shuffle } from 'lucide-react'
import Image from 'next/image'

interface AgentsAPIResponse {
  displayName: string
  displayIcon: string
  bustPortrait: string
  background: string
  isPlayableCharacter: boolean
}

export default function Home() {
  // Variables and State
  const [agents, setAgents] = useState<AgentsAPIResponse[]>([])
  const [randomAgent, setRandomAgent] = useState<AgentsAPIResponse>()

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents')
      .then((res) => res.json())
      .then((res) =>
        res.data.filter(
          (agent: AgentsAPIResponse) => agent.isPlayableCharacter,
        ),
      )
      .then((data) => {
        console.log(data)
        setAgents(data)
      })
      .catch((err) => console.log(err))
  }, [])
  // Helper Functions

  function pickRandomAgent() {
    setRandomAgent(agents[pickRandomNumber(0, agents.length - 1)])
  }

  // JSX Return
  return (
    <div>
      <Container className="py-5 flex flex-col items-center gap-5">
        <div className="min-w-full aspect-video bg-gray-800 rounded border-4 border-white flex items-center justify-start relative overflow-hidden">
          <h1 className="font-alt uppercase tracking-wide text-9xl z-20 m-5">
            {randomAgent?.displayName}
          </h1>
          <Image
            className="h-full w-fit absolute brightness-75 index z-10 right-0 top-60 scale-[250%]"
            width={1200}
            height={1200}
            src={randomAgent?.bustPortrait ?? ''}
            alt={randomAgent?.displayName ?? ''}
          />
          <Image
            className="h-fit w-1/2 absolute opacity-5 right-10 scale-150"
            width={1200}
            height={1200}
            src={randomAgent?.background ?? ''}
            alt={randomAgent?.displayName ?? ''}
          />
        </div>
        <button
          className="bg-emerald-500 font-semibold py-3 px-5 rounded text-xl hover:bg-emerald-600 flex gap-2 items-center"
          onClick={pickRandomAgent}
        >
          Sortear
          <Shuffle size={20} strokeWidth={3} />
        </button>
      </Container>
    </div>
  )
}
