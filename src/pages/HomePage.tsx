import { Link } from 'react-router-dom';
import {
  Search,
  CalendarCheck,
  TicketCheck,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Headphones,
  TrendingUp,
} from 'lucide-react';
import { matches } from '@/data/matches';
import { MatchCard } from '@/components/MatchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const heroImage = 'https://images.pexels.com/photos/30651230/pexels-photo-30651230.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const howItWorks = [
  {
    icon: Search,
    title: '1. Trouvez votre match',
    description: 'Parcourez les prochains matchs, filtrez par compétition ou par ville et trouvez la rencontre qui vous fait vibrer.',
  },
  {
    icon: CalendarCheck,
    title: '2. Choisissez vos places',
    description: 'Sélectionnez votre catégorie sur le plan du stade. Virage populaire, tribune centrale ou loge VIP — à vous de choisir.',
  },
  {
    icon: TicketCheck,
    title: '3. Recevez vos billets',
    description: 'Paiement sécurisé en ligne. Vos billets électroniques arrivent instantanément par e-mail avec QR code.',
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: '100% sécurisé',
    description: 'Paiement chiffré et billets authentiques garantis.',
  },
  {
    icon: Zap,
    title: 'Instantané',
    description: 'Recevez vos billets immédiatement après achat.',
  },
  {
    icon: Smartphone,
    title: '100% mobile',
    description: 'Billet électronique scannable depuis votre téléphone.',
  },
  {
    icon: Headphones,
    title: 'Support 7j/7',
    description: 'Une question ? Notre équipe répond en moins de 24h.',
  },
];

export function HomePage() {
  const featuredMatches = matches.filter((m) => m.featured).slice(0, 3);
  const upcomingMatches = matches.slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Stade de football" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-emerald-brand/40" />
        </div>

        <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-fade-up">
            <Badge className="mb-5 bg-orange-brand/90 text-white border-transparent backdrop-blur-sm">
              <TrendingUp className="mr-1.5 h-3 w-3" />
              Saison 2026-2027 — Billets disponibles
            </Badge>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Vivez le football
              <span className="block text-orange-brand">au cœur du stade</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Réservez vos billets pour les plus grands matchs de football en France. Choix des places sur plan interactif, paiement sécurisé, billets instantanés.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/matches">
                <Button size="lg" className="bg-orange-brand text-white hover:bg-orange-dark gap-2 px-8 h-12 text-base">
                  Voir les matchs
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white px-8 h-12 text-base">
                  Créer un compte
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-brand" />
                Paiement sécurisé
              </span>
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-brand" />
                Billets instantanés
              </span>
              <span className="flex items-center gap-2">
                <TicketCheck className="h-4 w-4 text-orange-brand" />
                +120 matchs disponibles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured matches */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top matchs à ne pas manquer</h2>
            <p className="mt-2 text-muted-foreground">Les rencontres les plus attendues de la saison</p>
          </div>
          <Link to="/matches" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-brand hover:gap-2.5 transition-all sm:flex">
            Tous les matchs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-light-brand py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Simple & rapide</Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Comment ça marche ?</h2>
            <p className="mt-3 text-muted-foreground">Réservez votre place en 3 étapes, en moins de 2 minutes</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {howItWorks.map((step, idx) => (
              <div
                key={idx}
                className="relative flex flex-col items-center rounded-2xl border border-border bg-white p-8 text-center shadow-sm transition-all hover:shadow-md"
              >
                {idx < howItWorks.length - 1 && (
                  <div className="absolute top-1/2 -right-4 hidden h-px w-8 bg-border md:block" />
                )}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-brand/10">
                  <step.icon className="h-8 w-8 text-emerald-brand" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming matches grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Prochains matchs</h2>
          <p className="mt-2 text-muted-foreground">Toutes les rencontres à venir</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/matches">
            <Button size="lg" className="bg-emerald-brand text-white hover:bg-emerald-light gap-2">
              Voir tous les matchs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features strip */}
      <section className="bg-black-brand py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-brand/20">
                  <feature.icon className="h-6 w-6 text-orange-brand" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-white">{feature.title}</h3>
                <p className="text-xs text-white/50">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
