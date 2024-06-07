import Link from 'next/link'
import Container from '@/components/Container'

export default function Header() {
  return (
    <header className="bg-rose-600 sticky top-0 py-4">
      <Container>
        <nav>
          <ul className="flex gap-5">
            <Link
              href="/map"
              className="py-1 px-2.5 font-semibold rounded hover:bg-rose-700"
            >
              <li>Mapa</li>
            </Link>
            <Link
              href="/"
              className="py-1 px-2.5 font-semibold rounded hover:bg-rose-700"
            >
              <li>Agentes</li>
            </Link>
          </ul>
        </nav>
      </Container>
    </header>
  )
}
