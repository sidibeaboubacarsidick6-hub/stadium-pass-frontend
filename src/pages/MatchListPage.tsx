import { useState, useMemo } from 'react';
import { SlidersHorizontal, Calendar, MapPin, Search } from 'lucide-react';
import { matches } from '@/data/matches';
import { MatchCard } from '@/components/MatchCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export function MatchListPage() {
  const [search, setSearch] = useState('');
  const [competition, setCompetition] = useState('all');
  const [city, setCity] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const competitions = useMemo(() => {
    const set = new Set(matches.map((m) => m.competition));
    return Array.from(set);
  }, []);

  const cities = useMemo(() => {
    const set = new Set(matches.map((m) => m.city));
    return Array.from(set);
  }, []);

  const filteredMatches = useMemo(() => {
    let result = matches.filter((m) => {
      const matchesSearch =
        m.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
        m.awayTeam.toLowerCase().includes(search.toLowerCase()) ||
        m.stadium.toLowerCase().includes(search.toLowerCase());
      const matchesCompetition = competition === 'all' || m.competition === competition;
      const matchesCity = city === 'all' || m.city === city;
      return matchesSearch && matchesCompetition && matchesCity;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'date') return a.date.localeCompare(b.date);
      if (sortBy === 'price') {
        const minA = Math.min(...a.categories.filter(c => c.availability !== 'soldout').map(c => c.price));
        const minB = Math.min(...b.categories.filter(c => c.availability !== 'soldout').map(c => c.price));
        return minA - minB;
      }
      return 0;
    });

    return result;
  }, [search, competition, city, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tous les matchs</h1>
        <p className="mt-2 text-muted-foreground">
          {filteredMatches.length} rencontre{filteredMatches.length > 1 ? 's' : ''} disponible{filteredMatches.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-4 w-4 text-emerald-brand" />
          <span className="text-sm font-semibold">Filtres</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une équipe, un stade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={competition} onValueChange={setCompetition}>
            <SelectTrigger>
              <SelectValue placeholder="Compétition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les compétitions</SelectItem>
              {competitions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (proche → loin)</SelectItem>
              <SelectItem value="price">Prix (croissant)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(search || competition !== 'all' || city !== 'all') && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Filtres actifs :</span>
            {search && (
              <Badge variant="secondary" className="gap-1">
                <Search className="h-3 w-3" />
                {search}
              </Badge>
            )}
            {competition !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <Calendar className="h-3 w-3" />
                {competition}
              </Badge>
            )}
            {city !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {city}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground"
              onClick={() => {
                setSearch('');
                setCompetition('all');
                setCity('all');
              }}
            >
              Effacer
            </Button>
          </div>
        )}
      </div>

      {/* Results grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20 text-center">
          <Search className="mb-4 h-10 w-10 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold">Aucun match trouvé</h3>
          <p className="mt-1 text-sm text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch('');
              setCompetition('all');
              setCity('all');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}
