'use client'

import Link from 'next/link'
import Container from '@/components/Container'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'

export default function Header() {
  const pathname = usePathname()

  const routes = [
    { name: 'PARTIDA', url: '/' },
    { name: 'MAPA', url: '/map' },
    { name: 'AGENTE', url: '/agent' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-rose-600 py-4">
      <Container>
        <nav>
          <ul className="flex justify-center gap-5">
            {routes.map((route) => (
              <Button
                key={route.url}
                className={cn('bg-rose-600 hover:bg-rose-700', {
                  'bg-rose-700': route.url === pathname,
                })}
              >
                <Link href={route.url}>
                  <li>{route.name}</li>
                </Link>
              </Button>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
