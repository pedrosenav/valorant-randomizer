import Image from 'next/image'

import type { Player } from '@/app/page'
import { RefreshCw } from 'lucide-react'
import SpinOnClick from './SpinOnClick'
import { cn } from '@/lib/utils'

interface PlayerBannerProps {
  role: 'attack' | 'defense'
  dir: 'ltr' | 'rtl'
  player: Player
  randomizeFn: (name: string) => void
}

export default function PlayerBanner({
  role,
  dir,
  player,
  randomizeFn,
}: PlayerBannerProps) {
  return (
    <div
      className={cn(
        'group flex w-full max-w-96 items-center overflow-hidden rounded border border-gray-500 bg-gray-900/80 shadow-lg backdrop-blur-sm',
        dir === 'rtl' && 'flex-row-reverse text-right',
      )}
    >
      {/* Agent Icon */}
      <div
        className="group/agent relative cursor-pointer overflow-hidden"
        onClick={() => randomizeFn(player.name)}
      >
        <SpinOnClick className="absolute z-30 hidden h-full w-full place-content-center group-hover/agent:grid">
          <RefreshCw size={36} className="stroke-white" />
        </SpinOnClick>

        <Image
          src={player.agent.displayIcon}
          alt={`${player.agent.displayName} Icon`}
          className={cn(
            'group-hover/agent:saturate-75 select-none group-hover/agent:brightness-50',
            { 'bg-emerald-500/50': role === 'defense' },
            { 'bg-rose-500/50': role === 'attack' },
          )}
          draggable={false}
          width={80}
          height={80}
        />
      </div>

      {/* Player and Agent Name */}
      <div className="overflow-hidden px-5">
        <p className="text-2xl font-semibold text-white">{player.name}</p>
        <p className="uppercase tracking-wide text-gray-500">
          {player.agent.displayName}
        </p>
      </div>
    </div>
  )
}
