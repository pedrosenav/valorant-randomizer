'use client'

import Link from 'next/link'
import Container from '@/components/Container'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

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
              <Link
                href={route.url}
                key={route.url}
                className={cn(
                  `rounded px-3 py-1.5 font-semibold hover:bg-rose-700`,
                  route.url === pathname && 'bg-rose-700',
                )}
              >
                <li>{route.name}</li>
              </Link>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
