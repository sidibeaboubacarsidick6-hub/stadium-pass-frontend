import { CalendarDays, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatKickoff } from './format'
import type { MatchInfo } from './types'

export function TeamCrest({ short, variant }: { short: string; variant: 'home' | 'away' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-full text-xs font-bold tracking-wide ring-4 ring-white',
        variant === 'home' ? 'bg-primary text-primary-foreground' : 'bg-orange text-white',
      )}
    >
      {short}
    </span>
  )
}

export function MatchSummary({ match }: { match: MatchInfo }) {
  return (
    <section aria-label="Match" className="rounded-2xl bg-muted p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
          <TeamCrest short={match.homeTeamShort} variant="home" />
          <span className="text-sm font-semibold leading-tight text-balance">{match.homeTeam}</span>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">VS</span>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-2 text-center">
          <TeamCrest short={match.awayTeamShort} variant="away" />
          <span className="text-sm font-semibold leading-tight text-balance">{match.awayTeam}</span>
        </div>
      </div>
      <dl className="mt-4 flex flex-col gap-1.5 border-t border-primary/10 pt-3 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-5">
        <div className="flex items-center gap-1.5">
          <dt>
            <CalendarDays className="size-4 text-primary" aria-hidden="true" />
            <span className="sr-only">Date</span>
          </dt>
          <dd>
            <time dateTime={match.kickoffAt}>{formatKickoff(match.kickoffAt)}</time>
          </dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt>
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            <span className="sr-only">Lieu</span>
          </dt>
          <dd>
            {match.venueName}, {match.venueCity}
          </dd>
        </div>
      </dl>
    </section>
  )
}
