import { QrCode } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TicketQrPlaceholderProps {
  data?: string
  className?: string
}

export function TicketQrPlaceholder({ data, className }: TicketQrPlaceholderProps) {
  return (
    <div
      className={cn(
        'flex aspect-square w-full max-w-[180px] items-center justify-center rounded-xl bg-white p-3',
        className
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <QrCode className="h-16 w-16 text-[#0a5c3a]" strokeWidth={1.5} />
        <span className="text-[10px] font-semibold tracking-widest text-neutral-400">
          QR CODE
        </span>
      </div>
    </div>
  )
}
