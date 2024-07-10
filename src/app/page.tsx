'use client'

import Container from '@/components/Container'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import PlayerBanner from '@/components/PlayerBanner'

import { cn, pickRandomItem, shuffleArray, theRangeImage } from '@/lib/utils'
import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'

import type { MapAPIResponse } from '@/app/map/page'

import type { AgentAPIResponse } from '@/app/agent/page'
import { Copy, CopyCheck } from 'lucide-react'

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

  const [hasCopied, setHasCopied] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)

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

  function copyMatch() {
    const attack = matchSettings?.attack
      .map((player) => `${player.name}: **${player.agent.displayName}**\n`)
      .toString()
      .replaceAll(',', '')

    const defense = matchSettings?.defense
      .map((player) => `${player.name}: **${player.agent.displayName}**\n`)
      .toString()
      .replaceAll(',', '')

    const matchText = `MAPA: **${matchSettings?.map.displayName}**\n \n—— Ataque ——\n${attack} \n—— Defesa ——\n${defense}`

    navigator.clipboard.writeText(matchText)

    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 1500)
  }

  function assignAgents(players: string[]) {
    return players.map((player) => ({
      name: player,
      agent: pickRandomItem(agents),
    }))
  }

  function onSubmit(values: ClassesSchema) {
    const players = values.names
      .toUpperCase()
      .split(/\s*,\s*/)
      .filter((name) => name !== '') // Convert and filter names

    if (players.length < 2) {
      setWarning('MÍNIMO DE 2 JOGADORES')
      return
    }
    setWarning(null)

    const shuffledPlayers = shuffleArray(players) // Shuffle the names
    const divider = Math.floor(shuffledPlayers.length / 2) // Array midpoint

    const defenseTeam = shuffledPlayers.slice(0, divider)
    const attackTeam = shuffledPlayers.slice(divider, shuffledPlayers.length) // If player count is odd, attacking team gets more players

    setMatchSettings({
      attack: assignAgents(attackTeam),
      defense: assignAgents(defenseTeam),
      map: pickRandomItem(maps),
    })

    new Audio('match-found.mp3').play()

    console.log('Errors on Submit:', errors)
  }

  // JSX Return
  return (
    <div>
      <Container className="space-y-10 py-10">
        {/* Title */}
        <h1 className="text-center font-alt text-8xl tracking-wide">PARTIDA</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto max-w-2xl space-y-5"
        >
          <div className="flex gap-5">
            {/* TODO: Add input verification */}
            {/* Player Names */}
            <Textarea
              className="text-md max-h-36 min-h-36 p-5 text-gray-900"
              placeholder="Escreva aqui os nomes separados por vírgula..."
              {...register('names')}
            />
          </div>

          <Button
            type="submit"
            className={cn(
              'w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-500',
              warning && 'bg-rose-500 hover:bg-rose-600 active:bg-rose-500',
            )}
          >
            {warning || 'SORTEAR'}
          </Button>
        </form>

        {/* Match Display */}
        {/* TODO: Add animations inspired in the game match found */}
        {/* TODO: Option to reroll an agent */}
        <Card
          className={cn(
            'relative flex flex-col justify-between gap-10 overflow-hidden bg-gray-800 p-10 lg:flex-row',
            !matchSettings && 'hidden',
          )}
        >
          {/* Attacking Team */}
          <div className="z-30 flex flex-1 flex-col items-center gap-5">
            <h3 className="text-4xl tracking-widest text-gray-400">ATAQUE</h3>

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
          <div className="z-30 order-1 flex min-h-64 flex-1 flex-col items-center justify-center gap-5 text-center lg:order-none">
            {/* Map */}
            <div className="space-y-2.5">
              <h3 className="z-30 font-alt text-7xl uppercase text-white">
                {matchSettings?.map.displayName}
              </h3>
              <p className="z-30 text-sm tracking-widest text-gray-400">
                {matchSettings?.map.coordinates}
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={copyMatch}
              className={cn(
                'gap-2',
                hasCopied && 'bg-emerald-600 hover:bg-emerald-600',
              )}
            >
              {hasCopied ? (
                <>
                  <CopyCheck size={16} />
                  Copiado
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copiar
                </>
              )}
            </Button>
          </div>

          {/* Defending Team */}
          <div className="z-30 flex flex-1 flex-col items-center gap-5">
            <h3 className="text-4xl tracking-widest text-gray-400">DEFESA</h3>

            {matchSettings?.defense.map((player) => (
              <PlayerBanner
                player={player}
                key={player.name}
                role="defense"
                dir="rtl"
              />
            ))}
          </div>

          <Image
            src={matchSettings?.map.splash ?? theRangeImage}
            alt={matchSettings?.map.displayName ?? 'Map image'}
            draggable={false}
            className="absolute left-0 top-0 z-10 h-full w-full object-cover opacity-70 brightness-50"
            width={500}
            height={500}
          />
        </Card>
      </Container>
    </div>
  )
}
