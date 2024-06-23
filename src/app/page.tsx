'use client'

import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import PlayerBanner from '@/components/PlayerBanner'

import { cn, pickRandomItem, shuffleArray } from '@/lib/utils'
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'

import type { MapAPIResponse } from '@/app/map/page'

import type { AgentAPIResponse } from '@/app/agent/page'
import { Copy } from 'lucide-react'

export type Player = { name: string; agent: AgentAPIResponse }

interface MatchSettings {
  attack: Player[]
  defense: Player[]
  map: MapAPIResponse
}

const formSchema = z.object({
  names: z.string().min(1),
})

type ClassesSchema = z.infer<typeof formSchema>

export default function Home() {
  // State and Variables
  const [agents, setAgents] = useState<AgentAPIResponse[]>([])

  const [maps, setMaps] = useState<MapAPIResponse[]>([])

  const [matchSettings, setMatchSettings] = useState<MatchSettings>()

  useEffect(() => {
    // Fetch Maps
    fetch('https://valorant-api.com/v1/maps')
      .then((res) => res.json())
      .then((res) =>
        res.data.filter((map: MapAPIResponse) => !!map.tacticalDescription),
      )
      .then((data) => {
        setMaps(data)
      })
      .catch((err) => console.log(err))

    // Fetch Agents
    fetch('https://valorant-api.com/v1/agents')
      .then((res) => res.json())
      .then((res) =>
        res.data.filter((agent: AgentAPIResponse) => agent.isPlayableCharacter),
      )
      .then((data) => setAgents(data))
      .catch((err) => console.log(err))
  }, [])

  // React Hook Form

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassesSchema>({
    resolver: zodResolver(formSchema),
  })

  // Helper Functions

  function matchToClipboard() {
    const attack = matchSettings?.attack
      .map((player) => `${player.name}: **${player.agent.displayName}**\n`)
      .toString()
      .replaceAll(',', '')

    const defense = matchSettings?.defense
      .map((player) => `${player.name}: **${player.agent.displayName}**\n`)
      .toString()
      .replaceAll(',', '')

    const message = `MAPA: **${matchSettings?.map.displayName}**\n \n--- Ataque ---\n${attack} \n--- Defesa ---\n${defense}`

    navigator.clipboard.writeText(message)
  }

  function assignAgents(players: string[]) {
    return players.map((player) => ({
      name: player,
      agent: pickRandomItem(agents),
    }))
  }

  function pickRandomMap() {
    return pickRandomItem(maps)
  }

  function onSubmit(values: ClassesSchema) {
    const players = values.names.toUpperCase().split(/\s*,\s*/) // Transforma a string em um array com os nomes
    const shuffledPlayers = shuffleArray(players) // Embaralha os nomes

    const divider = Math.floor(shuffledPlayers.length / 2) // Marco da metade do array para separar os times

    const defenseTeam = shuffledPlayers.slice(0, divider)
    const attackTeam = shuffledPlayers.slice(divider, shuffledPlayers.length) // Em caso de ímpar, o ataque sempre terá mais jogadores

    setMatchSettings({
      attack: assignAgents(attackTeam),
      defense: assignAgents(defenseTeam),
      map: pickRandomMap(),
    })

    console.log('Errors:', errors)
  }

  // JSX Return
  return (
    <div>
      <Container className="space-y-10 py-10">
        {/* Título */}
        <h1 className="text-center font-alt text-8xl tracking-wide">PARTIDA</h1>

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-2xl space-y-5"
        >
          <div className="flex gap-5">
            {/* Nomes */}
            <Textarea
              className="text-md max-h-36 min-h-36 p-5 text-gray-900"
              placeholder="Escreva aqui os nomes separados por vírgula..."
              {...register('names', { required: true })}
            />

            {/* Filtros */}
            {/* <div className="flex min-w-36 flex-col">
              <h2 className="text-2xl font-semibold">FILTROS</h2>

              <label>
                <input type="checkbox" />
                AGENTES
              </label>

              <label>
                <input type="checkbox" />
                MAPA
              </label>
            </div> */}
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-500"
          >
            SORTEAR
          </Button>
        </form>

        {/* Exibição da Partida */}
        <Card
          className={cn('flex justify-between gap-10 bg-gray-800 p-10', {
            hidden: !matchSettings,
          })}
        >
          {/* Time Atacando */}
          <div className="flex-1 space-y-5">
            <h3 className="text-center text-4xl tracking-widest text-gray-400">
              ATAQUE
            </h3>

            {matchSettings?.attack.map((player) => (
              <PlayerBanner
                player={player}
                key={player.name}
                role="attack"
                dir="ltr"
              />
            ))}
          </div>

          {/* Central */}
          <div className="flex flex-1 flex-col gap-2.5">
            {/* Mapa */}
            <div className="relative flex min-h-64 flex-1 flex-col items-center justify-center overflow-hidden rounded-lg">
              <h3 className="z-30 font-alt text-7xl uppercase text-white">
                {matchSettings?.map.displayName}
              </h3>
              <p className="z-30 text-sm tracking-widest text-gray-400">
                {matchSettings?.map.coordinates}
              </p>
              <Image
                src={
                  matchSettings?.map.listViewIconTall ??
                  'https://media.valorant-api.com/maps/ee613ee9-28b7-4beb-9666-08db13bb2244/listviewicontall.png'
                }
                alt={matchSettings?.map.displayName ?? 'Map image'}
                draggable={false}
                className="absolute left-0 top-0 z-10 h-full max-w-full object-cover opacity-80 brightness-50"
                width={500}
                height={500}
              />
            </div>

            <Button onClick={matchToClipboard} className="gap-2">
              Copiar <Copy size={16} />
            </Button>
          </div>

          {/* Time Defendendo */}
          <div className="flex-1 space-y-5">
            <h3 className="text-center text-4xl tracking-widest text-gray-400">
              DEFESA
            </h3>

            {matchSettings?.defense.map((player) => (
              <PlayerBanner
                player={player}
                key={player.name}
                role="defense"
                dir="rtl"
              />
            ))}
          </div>
        </Card>
      </Container>
    </div>
  )
}
