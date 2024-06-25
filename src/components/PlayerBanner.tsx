import Image from 'next/image'

import type { Player } from '@/app/page'
import { cn } from '@/lib/utils'
// import { RefreshCw } from 'lucide-react'

interface PlayerBannerProps {
  role: 'attack' | 'defense'
  dir: 'ltr' | 'rtl'
  player: Player
}

export default function PlayerBanner({ role, dir, player }: PlayerBannerProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-96 items-center overflow-hidden rounded border border-gray-500 bg-gray-900/80 shadow-lg backdrop-blur-sm',
        dir === 'rtl' && 'flex-row-reverse text-right',
      )}
    >
      <div className="group relative">
        {/* TODO: Adicionar a função de troca de agente */}
        {/* <RefreshCw
          size={50}
          className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2 stroke-white opacity-0 transition-all group-hover:opacity-100"
        /> */}
        <Image
          src={player.agent.displayIcon}
          alt={`${player.agent.displayName} Icon`}
          className={cn(
            { 'bg-emerald-500/50': role === 'defense' },
            { 'bg-rose-500/50': role === 'attack' },
          )}
          draggable={false}
          width={80}
          height={80}
        />
      </div>

      <div className="overflow-hidden px-5">
        <p className="text-2xl font-semibold text-white">{player.name}</p>
        <p className="uppercase tracking-wide text-gray-500">
          {player.agent.displayName}
        </p>
      </div>
    </div>
  )
}
