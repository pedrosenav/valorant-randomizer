'use client'

import Container from '@/components/Container'
import { Card } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { cn, pickRandomItem } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Shuffle } from 'lucide-react'

interface AgentsAPIResponse {
  displayName: string
  displayIcon: string
  bustPortrait: string
  background: string
  isPlayableCharacter: boolean
  role: {
    displayName: string
    displayIcon: string
  }
}

const formSchema = z.object({
  roles: z.string().array().min(1),
})

type ClassesSchema = z.infer<typeof formSchema>

export default function Home() {
  // Variables and State
  const [agents, setAgents] = useState<AgentsAPIResponse[]>([])
  const [randomAgent, setRandomAgent] = useState<AgentsAPIResponse>()
  const [agentsHistory, setAgentsHistory] = useState<AgentsAPIResponse[]>([])

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents')
      .then((res) => res.json())
      .then((res) =>
        res.data.filter(
          (agent: AgentsAPIResponse) => agent.isPlayableCharacter,
        ),
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
    defaultValues: {
      roles: [],
    },
  })

  // Helper Functions

  function onSubmit(values: ClassesSchema) {
    console.log('Filtros:', values.roles)
    pickRandomAgent(values.roles)

    console.log('Errors:', errors)
  }

  function pickRandomAgent(roles: string[]) {
    console.log('Roles:', roles)

    const filteredAgents = agents.filter((agent) => {
      return roles.includes(agent?.role?.displayName)
    })

    console.log('Agentes Filtrados:', filteredAgents)

    const pickedAgent = pickRandomItem(filteredAgents)

    setRandomAgent(pickedAgent)
    setAgentsHistory((agents) => [...agents, pickedAgent])
  }

  // JSX Return
  return (
    <div>
      <Container className="space-y-10 py-10">
        {/* Título */}
        <h1 className="text-center font-alt text-8xl tracking-wide">AGENTES</h1>

        {/* Sorteador */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Filtros */}
          <div className="flex items-center justify-center gap-5">
            <label
              htmlFor={'Controller'}
              className="flex cursor-pointer items-center gap-2.5 rounded px-4 py-2.5 text-xl font-semibold uppercase transition-colors hover:bg-gray-800 has-[:checked]:bg-gray-800"
            >
              <input
                className="bg-gray-800 accent-emerald-400"
                defaultChecked={true}
                value={'Controller'}
                id={'Controller'}
                type="checkbox"
                {...register('roles')}
              />
              Controlador
            </label>

            <label
              htmlFor={'Initiator'}
              className="flex cursor-pointer items-center gap-2.5 rounded px-4 py-2.5 text-xl font-semibold uppercase transition-colors hover:bg-gray-800 has-[:checked]:bg-gray-800"
            >
              <input
                className="bg-gray-800 accent-emerald-400"
                defaultChecked={true}
                value={'Initiator'}
                id={'Initiator'}
                type="checkbox"
                {...register('roles')}
              />
              Iniciador
            </label>

            <label
              htmlFor={'Duelist'}
              className="flex cursor-pointer items-center gap-2.5 rounded px-4 py-2.5 text-xl font-semibold uppercase transition-colors hover:bg-gray-800 has-[:checked]:bg-gray-800"
            >
              <input
                className="bg-gray-800 accent-emerald-400"
                defaultChecked={true}
                value={'Duelist'}
                id={'Duelist'}
                type="checkbox"
                {...register('roles')}
              />
              Duelista
            </label>

            <label
              htmlFor={'Sentinel'}
              className="flex cursor-pointer items-center gap-2.5 rounded px-4 py-2.5 text-xl font-semibold uppercase transition-colors hover:bg-gray-800 has-[:checked]:bg-gray-800"
            >
              <input
                className="bg-gray-800 accent-emerald-400"
                defaultChecked={true}
                value={'Sentinel'}
                id={'Sentinel'}
                type="checkbox"
                {...register('roles')}
              />
              Sentinela
            </label>
          </div>

          {/* Agentes */}
          <Card className="relative flex h-96 flex-col items-start justify-start gap-5 overflow-hidden bg-gray-800">
            <input
              type="submit"
              value={randomAgent ? '' : 'CLIQUE PARA SORTEAR'}
              className="absolute right-0 top-0 z-40 h-full w-full cursor-pointer text-xl font-semibold text-white"
            />
            <Shuffle
              size={100}
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 stroke-white opacity-5',
                randomAgent && 'hidden',
              )}
            />

            {randomAgent && (
              <>
                <div className="absolute left-0 top-1/2 z-30 space-y-2 p-5">
                  <div className="absolute h-96 w-10 -translate-y-full bg-emerald-500"></div>

                  {/* Role Name */}
                  <h3 className="text-xl uppercase tracking-widest text-gray-400">
                    {randomAgent?.role.displayName}
                  </h3>

                  {/* Agent Name */}
                  <h2 className="font-alt text-7xl uppercase tracking-wide text-white">
                    {randomAgent?.displayName}
                  </h2>

                  <div className="absolute h-96 w-10 bg-emerald-500"></div>
                </div>

                {/* Agent Image */}
                <Image
                  src={randomAgent?.bustPortrait}
                  alt={randomAgent?.displayName}
                  loading="eager"
                  width={1500}
                  height={1500}
                  className="z-20 w-max scale-150 pt-5"
                />

                {/* Background Image */}
                <Image
                  src={randomAgent?.background}
                  alt={randomAgent?.displayName + 'background'}
                  loading="eager"
                  width={8000}
                  height={8000}
                  className="absolute right-0 top-1/2 z-10 h-fit w-fit -translate-y-1/2 opacity-25"
                />
              </>
            )}
          </Card>
        </form>

        {/* Histórico */}
        <Card className="h-24 bg-gray-800 p-2.5">
          <ScrollArea>
            <div className="flex flex-row-reverse justify-end gap-5 p-2.5 pb-5">
              {agentsHistory.map((agent, i) => (
                <TooltipProvider key={agent?.displayName + i}>
                  <Tooltip>
                    <TooltipTrigger className="shrink-0 cursor-default rounded border border-transparent saturate-0 transition-all hover:border-gray-400 hover:saturate-100">
                      <Image
                        src={agent?.displayIcon}
                        alt={agent?.displayName}
                        draggable={false}
                        loading="lazy"
                        width={45}
                        height={45}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 px-2 py-1 text-white">
                      {agent?.displayName}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </Card>
      </Container>
    </div>
  )
}