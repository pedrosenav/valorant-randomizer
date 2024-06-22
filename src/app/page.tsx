import Container from '@/components/Container'
import { Frown, ThumbsDown } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <Container className="flex flex-col items-center gap-5 py-10">
        <div className="flex items-center">
          <ThumbsDown size={60} strokeWidth={1.5} />
          <Frown size={100} strokeWidth={1.5} />
        </div>
        <h1 className="font text-2xl">Por enquanto não há nada aqui... </h1>
      </Container>
    </div>
  )
}
