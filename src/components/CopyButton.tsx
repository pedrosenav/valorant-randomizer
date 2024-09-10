import { cn } from '@/lib/utils'
import { CopyCheck, Copy } from 'lucide-react'
import { Button } from './ui/button'

interface CopyButtonProps {
  copyFn: () => void
  hasCopied: boolean
}

export default function CopyButton({ copyFn, hasCopied }: CopyButtonProps) {
  return (
    <Button
      onClick={copyFn}
      className={cn(
        'gap-2',
        hasCopied && 'select-none bg-emerald-600 hover:bg-emerald-600',
      )}
    >
      {hasCopied ? (
        <>
          <CopyCheck size={16} />
          Copiado
        </>
      ) : (
        <>
          <Copy size={16} />
          Copiar
        </>
      )}
    </Button>
  )
}
