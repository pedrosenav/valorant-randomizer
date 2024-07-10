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

export interface Role {
  displayName: string
  displayIcon: string
}

export interface AgentAPIResponse {
  displayName: string
  displayIcon: string
  bustPortrait: string
  background: string
  description: string
  isPlayableCharacter: boolean
  role: Role
  backgroundGradientColors: string[]
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
    pickRandomAgent(values.roles)
  }

  function pickRandomAgent(roles: string[]) {
    const filteredAgents = agents.filter((agent) => {
      return roles.includes(agent?.role?.displayName)
    })

    const pickedAgent = pickRandomItem(filteredAgents)

    setRandomAgent(pickedAgent)
    setAgentsHistory((agents) => [...agents, pickedAgent])
  }

  const roles: Role[] = []

  for (let i = 0; i < agents.length; i++) {
    const role = agents[i].role
    const roleNames = roles.map((role) => role.displayName)

    if (!roleNames.includes(role.displayName)) {
      roles.push(role)
    }
  }

  // JSX Return
  return (
    <div>
      <Container className="space-y-10 py-10">
        {/* Title */}
        <h1 className="text-center font-alt text-8xl tracking-wide">AGENTE</h1>

        {/* Randomizer */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-5">
              {roles.map((role) => (
                <AgentFilter role={role} key={role.displayName} />
              ))}
            </div>

            {/* Agents */}
            <Card
              className="relative flex h-96 flex-col items-start justify-start gap-5 overflow-hidden bg-gray-800 shadow-lg"
              style={{
                background: `linear-gradient(60deg, #${randomAgent?.backgroundGradientColors[1]} -100%, transparent 50%)`,
              }}
            >
              {/* Shuffle Button */}
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
                  randomAgent && 'opacity-0',
                )}
              />

              {randomAgent && (
                <>
                  <div className="absolute left-0 top-1/2 z-30 space-y-2 p-5">
                    {/* Stripe Top */}
                    <div
                      className="absolute h-96 w-10 -translate-y-full transition-colors duration-500"
                      style={{
                        backgroundColor: `#${randomAgent?.backgroundGradientColors[0]}`,
                      }}
                    ></div>

                    {/* Role Name */}
                    <h3 className="text-xl uppercase tracking-widest text-gray-400">
                      {randomAgent?.role.displayName}
                    </h3>

                    {/* Agent Name */}
                    <h2 className="font-alt text-7xl uppercase tracking-wide text-white">
                      {randomAgent?.displayName}
                    </h2>

                    {/* Stripe Bottom */}
                    <div
                      className="absolute h-96 w-10 transition-colors duration-500"
                      style={{
                        backgroundColor: `#${randomAgent?.backgroundGradientColors[0]}`,
                      }}
                    ></div>
                  </div>

                  {/* Agent Image */}
                  <Image
                    src={randomAgent?.bustPortrait}
                    alt={randomAgent?.displayName}
                    loading="eager"
                    width={1500}
                    height={1500}
                    className="z-20 h-full w-min translate-x-1/4 translate-y-1/3 scale-[250%] object-contain sm:h-max sm:translate-x-0 sm:translate-y-0 sm:scale-125"
                  />

                  {/* Background Image */}
                  <Image
                    src={randomAgent?.background}
                    alt={randomAgent?.displayName + 'Background'}
                    loading="eager"
                    width={8000}
                    height={8000}
                    className="absolute right-0 top-1/2 z-10 h-fit w-fit -translate-y-1/2 opacity-5 sm:opacity-20"
                  />

                  {/* Description */}
                  <div className="absolute left-1/3 top-1/2 z-10 hidden h-full max-w-80 -translate-x-1/2 -translate-y-1/2 p-10 leading-snug tracking-widest text-white/10 lg:block">
                    <div className="mb-5 h-1 w-3 bg-white/10" />
                    <p>&quot;{randomAgent.description}&quot;</p>
                  </div>

                  {/* Role Icon */}
                  {/* <Image
                    src={randomAgent?.role.displayIcon}
                    alt={randomAgent?.role.displayName + 'background'}
                    loading="eager"
                    width={300}
                    height={300}
                    className="absolute left-1/3 top-1/2 z-10 h-full w-fit -translate-x-1/2 -translate-y-1/2 p-10 opacity-5"
                  /> */}
                </>
              )}
            </Card>
          </form>
        </FormProvider>

        <div className="flex gap-2.5">
          {/* Historic */}
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
