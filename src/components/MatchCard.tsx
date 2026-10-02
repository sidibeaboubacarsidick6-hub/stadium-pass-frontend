import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Flame } from 'lucide-react';
import type { Match } from '@/data/matches';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface MatchCardProps {
  match: Match;
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function getMinPrice(match: Match): number {
  const available = match.categories.filter((c) => c.availability !== 'soldout');
  if (available.length === 0) return 0;
  return Math.min(...available.map((c) => c.price));
}

export function MatchCard({ match, className }: MatchCardProps) {
  return (
    <Link
      to={`/matches/${match.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-emerald-brand/30',
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={match.image}
          alt={`${match.homeTeam} vs ${match.awayTeam}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {match.featured && (
          <div className="absolute left-3 top-3">
            <Badge className="gap-1 bg-orange-brand text-white border-transparent shadow-md">
              <Flame className="h-3 w-3" />
              Top match
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="rounded-md bg-white/15 px-2 py-1 text-xs font-medium backdrop-blur-sm">
              {match.competition}
            </span>
          </div>
          <span className="rounded-md bg-emerald-brand px-2.5 py-1 text-xs font-bold text-white shadow-md">
            dès {getMinPrice(match)}€
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <span className="text-base font-bold text-foreground">{match.homeTeamShort}</span>
            <span className="text-xs font-medium text-muted-foreground">vs</span>
            <span className="text-base font-bold text-foreground">{match.awayTeamShort}</span>
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground line-clamp-1">
          {match.homeTeam} — {match.awayTeam}
        </p>

        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-emerald-brand" />
            <span>{formatDate(match.date)}</span>
            <Clock className="h-4 w-4 text-emerald-brand ml-2" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-emerald-brand" />
            <span className="line-clamp-1">{match.stadium}, {match.city}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-brand group-hover:gap-2.5 transition-all">
          Voir les billets
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}
