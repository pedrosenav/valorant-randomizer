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
        'group flex w-full max-w-96 items-center rounded border border-gray-500 bg-gray-900/80 shadow-lg backdrop-blur-sm',
        dir === 'rtl' && 'flex-row-reverse text-right',
      )}
    >
      {/* Options */}
      {/* <div
        className={cn(
          'absolute z-50 -translate-x-full space-y-2.5 p-2.5 opacity-0 group-hover:opacity-100',
          dir === 'rtl' && 'translate-x-full',
        )}
      >
        <RefreshCw
          size={24}
          className="cursor-pointer stroke-white opacity-50 hover:opacity-100"
        />
      </div>
 */}
      {/* Agent Icon */}
      <div className="relative">
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
