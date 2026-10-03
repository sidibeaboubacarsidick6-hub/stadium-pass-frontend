import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Info,
  Minus,
  Plus,
  TicketCheck,
} from 'lucide-react';
import { faqItems } from '@/data/matches';
import { getMatch } from '@/lib/api';
import { adaptMatch, type UiMatch, type UiTicketCategory } from '@/lib/adapters';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StadiumPlan } from '@/components/StadiumPlan';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const availabilityConfig = {
  available: { label: 'Disponible', color: 'text-emerald-brand', bg: 'bg-emerald-brand/10' },
  limited: { label: 'Places limitées', color: 'text-orange-brand', bg: 'bg-orange-brand/10' },
  soldout: { label: 'Complet', color: 'text-muted-foreground', bg: 'bg-muted' },
};

export function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [match, setMatch] = useState<UiMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<UiTicketCategory | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getMatch(id)
      .then((apiMatch) => {
        if (cancelled) return;
        setMatch(adaptMatch(apiMatch));
        setNotFound(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Erreur MatchDetail:', err);
        setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-brand" />
        <span className="ml-3 text-muted-foreground">Chargement du match…</span>
      </div>
    );
  }

  if (notFound || !match) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="text-2xl font-bold">Match introuvable</h1>
        <p className="mt-2 text-muted-foreground">Ce match n'existe pas ou n'est plus disponible.</p>
        <Link to="/matches" className="mt-6">
          <Button className="bg-emerald-brand text-white hover:bg-emerald-light gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux matchs
          </Button>
        </Link>
      </div>
    );
  }

  const handleCategorySelect = (catId: string) => {
    const cat = match.categories.find((c) => c.id === catId) || null;
    setSelectedCategory(cat);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedCategory) return;
    if (selectedCategory.availability === 'soldout') return;
    toast.success(`${quantity} billet${quantity > 1 ? 's' : ''} ${selectedCategory.name}`, {
      description: `${match.homeTeamShort} vs ${match.awayTeamShort} — ${(selectedCategory.price * quantity).toLocaleString('fr-FR')} FCFA`,
    });
  };

  const handleBuyNow = () => {
    if (!selectedCategory) return;
    if (selectedCategory.availability === 'soldout') return;
    if (!match) return;

    toast.success('Redirection vers le paiement...', {
      description: `${quantity} × ${selectedCategory.name} — ${(selectedCategory.price * quantity).toLocaleString('fr-FR')} FCFA`,
    });
    setTimeout(() => {
      navigate(`/checkout/${match.id}?category=${selectedCategory.id}&quantity=${quantity}`);
    }, 800);
  };

  const totalPrice = selectedCategory ? selectedCategory.price * quantity : 0;
  const availConfig = selectedCategory ? availabilityConfig[selectedCategory.availability] : null;

  return (
    <div className="flex flex-col">
      {/* Hero banner */}
      <div className="relative h-[340px] overflow-hidden sm:h-[400px]">
        <img src={match.image} alt={`${match.homeTeam} vs ${match.awayTeam}`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

        <div className="absolute inset-0 flex flex-col">
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
            <Link to="/matches" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Retour aux matchs
            </Link>
          </div>

          <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <Badge className="mb-3 bg-orange-brand text-white border-transparent">
              {match.competition}
            </Badge>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {match.homeTeam} <span className="text-white/50">vs</span> {match.awayTeam}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-brand" />
                {formatFullDate(match.date)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-brand" />
                Coup d'envoi {match.time}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-brand" />
                {match.stadium}, {match.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Categories + Stadium plan */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories */}
            <section>
              <h2 className="mb-1 text-xl font-bold tracking-tight">Choisissez votre catégorie</h2>
              <p className="mb-5 text-sm text-muted-foreground">Sélectionnez la tribune qui correspond à vos envies</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {match.categories.map((cat) => {
                  const isSelected = selectedCategory?.id === cat.id;
                  const config = availabilityConfig[cat.availability];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => cat.availability !== 'soldout' && handleCategorySelect(cat.id)}
                      disabled={cat.availability === 'soldout'}
                      className={cn(
                        'flex flex-col rounded-xl border-2 p-5 text-left transition-all',
                        isSelected
                          ? 'border-emerald-brand bg-emerald-brand/5 shadow-md'
                          : cat.availability === 'soldout'
                            ? 'border-border bg-muted/50 cursor-not-allowed opacity-60'
                            : 'border-border bg-card hover:border-emerald-brand/40 hover:shadow-sm'
                      )}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-sm" style={{ background: cat.color }} />
                          <span className="font-semibold">{cat.name}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-emerald-brand" />}
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">{cat.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">{cat.price}€</span>
                        <span className={cn('rounded-md px-2.5 py-1 text-xs font-semibold', config.bg, config.color)}>
                          {config.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Stadium plan */}
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Users className="h-5 w-5 text-emerald-brand" />
                <h2 className="text-xl font-bold tracking-tight">Plan du stade</h2>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">
                Cliquez sur une section du plan pour sélectionner votre catégorie
              </p>
              <StadiumPlan
                categories={match.categories}
                selectedId={selectedCategory?.id || null}
                onSelect={handleCategorySelect}
              />
            </section>

            {/* FAQ */}
            <section>
              <h2 className="mb-5 text-xl font-bold tracking-tight">Questions fréquentes</h2>
              <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-5 shadow-sm">
                {faqItems.map((item, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`} className={idx === faqItems.length - 1 ? 'border-b-0' : ''}>
                    <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* Right: Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-bold tracking-tight">Récapitulatif</h3>

              {!selectedCategory ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Info className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sélectionnez une catégorie pour commencer votre commande
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-sm" style={{ background: selectedCategory.color }} />
                    <span className="font-semibold">{selectedCategory.name}</span>
                  </div>

                  {availConfig && (
                    <div className={cn('rounded-md px-3 py-2 text-xs font-semibold', availConfig.bg, availConfig.color)}>
                      {availConfig.label}
                    </div>
                  )}

                  <Separator />

                  <div>
                    <label className="mb-2 block text-sm font-medium">Quantité</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-lg font-bold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(8, quantity + 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:opacity-50"
                        disabled={quantity >= 8 || selectedCategory.availability === 'limited' && quantity >= 4}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="ml-1 text-xs text-muted-foreground">max 8 billets</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Prix unitaire</span>
                      <span>{selectedCategory.price}€</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Quantité</span>
                      <span>× {quantity}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Frais de service</span>
                      <span>Inclus</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-3xl font-extrabold text-emerald-brand">{totalPrice}€</span>
                  </div>

                  {selectedCategory.availability === 'soldout' ? (
                    <Button disabled className="w-full" size="lg">
                      Catégorie complète
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-orange-brand text-white hover:bg-orange-dark gap-2"
                        size="lg"
                        onClick={handleBuyNow}
                      >
                        <TicketCheck className="h-4 w-4" />
                        Acheter maintenant
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-emerald-brand/30 text-emerald-brand hover:bg-emerald-brand/5"
                        onClick={handleAddToCart}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  )}

                  <p className="pt-2 text-center text-xs text-muted-foreground">
                    Paiement sécurisé · Billets électroniques · Remboursement en cas d'annulation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
