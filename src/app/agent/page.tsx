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
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Shuffle } from 'lucide-react'
import AgentFilter from '@/components/AgentFilter'

export interface AgentAPIResponse {
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
  const [agents, setAgents] = useState<AgentAPIResponse[]>([])
  const [randomAgent, setRandomAgent] = useState<AgentAPIResponse>()
  const [agentsHistory, setAgentsHistory] = useState<AgentAPIResponse[]>([])

  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents')
      .then((res) => res.json())
      .then((res) =>
        res.data.filter((agent: AgentAPIResponse) => agent.isPlayableCharacter),
      )
      .then((data) => setAgents(data))
      .catch((err) => console.log(err))
  }, [])

  // React Hook Form

  const form = useForm<ClassesSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roles: [],
    },
  })

  // Helper Functions

  function onSubmit(values: ClassesSchema) {
    console.log('Filtros:', values.roles)
    pickRandomAgent(values.roles)

    console.log('Errors:', form.formState.errors)
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
        <h1 className="text-center font-alt text-8xl tracking-wide">AGENTE</h1>

        {/* Sorteador */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Filtros */}
            <div className="flex flex-wrap items-center justify-center gap-5">
              <AgentFilter roleId="Controller" roleName="Controlador" />
              <AgentFilter roleId="Sentinel" roleName="Sentinel" />
              <AgentFilter roleId="Initiator" roleName="Iniciador" />
              <AgentFilter roleId="Duelist" roleName="Duelista" />
            </div>

            {/* Agentes */}
            <Card className="relative flex h-96 flex-col items-start justify-start gap-5 overflow-hidden bg-gray-800 shadow-lg">
              <input
                type="submit"
                value={'CLIQUE PARA SORTEAR'}
                className={cn(
                  'absolute right-0 top-0 z-40 h-full w-full cursor-pointer text-xl font-semibold text-white',
                  randomAgent && 'opacity-0',
                )}
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
                    className="z-20 h-full scale-125 object-cover object-top sm:h-max"
                  />

                  {/* Background Image */}
                  <Image
                    src={randomAgent?.background}
                    alt={randomAgent?.displayName + 'Background'}
                    loading="eager"
                    width={8000}
                    height={8000}
                    className="absolute right-0 top-1/2 z-10 h-fit w-fit -translate-y-1/2 opacity-20"
                  />

                  {/* Role Icon */}
                  <Image
                    src={randomAgent?.role.displayIcon}
                    alt={randomAgent?.role.displayName + 'background'}
                    loading="eager"
                    width={300}
                    height={300}
                    className="absolute left-1/3 top-1/2 z-10 h-full w-fit -translate-x-1/2 -translate-y-1/2 p-10 opacity-5"
                  />
                </>
              )}
            </Card>
          </form>
        </FormProvider>

        <div className="flex gap-2.5">
          {/* Histórico */}
          <Card className="h-24 w-full bg-gray-800 p-2.5 shadow-lg">
            <ScrollArea>
              <div className="relative flex flex-row-reverse justify-end gap-5 p-2.5 pb-5">
                {agentsHistory.map((agent, i) => (
                  <TooltipProvider key={agent?.displayName + i}>
                    <Tooltip>
                      <TooltipTrigger className="group shrink-0 cursor-default rounded border border-transparent saturate-0 transition-all hover:saturate-100">
                        <Image
                          src={agent?.displayIcon}
                          alt={agent?.displayName}
                          draggable={false}
                          loading="lazy"
                          width={45}
                          height={45}
                        />
                        <p className="p-1 text-xs text-gray-500 transition-colors group-hover:text-white">
                          {i + 1}
                        </p>
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
        </div>
      </Container>
    </div>
  )
}
