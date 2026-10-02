import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { getMatch, createOrder } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
  { id: 'wave', label: 'Wave' },
  { id: 'orange', label: 'Orange Money' },
  { id: 'mtn', label: 'MTN MoMo' },
  { id: 'moov', label: 'Moov Money' },
  { id: 'card', label: 'Carte bancaire' },
];

export function CheckoutPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const categoryId = Number(search.get('category') || 0);
  const quantity = Number(search.get('quantity') || 1);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState('wave');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ order_number: string; total: number } | null>(null);

  if (!uuid || !categoryId) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-32 text-center">
        <h1 className="text-2xl font-bold">Session invalide</h1>
        <p className="mt-2 text-muted-foreground">Aucun billet sélectionné.</p>
        <Link to="/matches" className="mt-6">
          <Button>Retour aux matchs</Button>
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createOrder({
        match_uuid: uuid!,
        category_id: categoryId,
        quantity,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        payment_method: payment,
      });
      setSuccess({ order_number: res.order_number, total: res.total });
      toast.success('Commande créée !');
    } catch (err) {
      toast.error((err as Error).message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <div className="rounded-2xl border border-emerald-brand/30 bg-emerald-brand/5 p-10 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-brand" />
          <h1 className="mt-4 text-2xl font-bold">Commande confirmée</h1>
          <p className="mt-2 text-muted-foreground">
            Votre commande <strong>{success.order_number}</strong> a été créée.
          </p>
          <p className="mt-1 text-lg font-semibold text-emerald-brand">
            Total : {success.total.toLocaleString('fr-FR')} FCFA
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link to="/my-tickets">
              <Button className="bg-emerald-brand text-white hover:bg-emerald-light w-full">
                Voir mes billets
              </Button>
            </Link>
            <Link to="/matches">
              <Button variant="outline" className="w-full">
                Retour aux matchs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link to={`/matches/${uuid}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Retour au match
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Finaliser la commande</h1>
      <p className="mt-2 text-muted-foreground">
        {quantity} billet{quantity > 1 ? 's' : ''} • Paiement sécurisé
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Coordonnées */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Vos coordonnées</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              placeholder="Prénom *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              placeholder="Nom *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Paiement */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Moyen de paiement</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPayment(m.id)}
                className={
                  'rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ' +
                  (payment === m.id
                    ? 'border-emerald-brand bg-emerald-brand/10 text-emerald-brand'
                    : 'border-border hover:border-muted-foreground')
                }
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-brand text-white hover:bg-orange-dark h-12 text-base"
        >
          {loading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Traitement…</>
          ) : (
            <><Lock className="mr-2 h-4 w-4" /> Payer maintenant</>
          )}
        </Button>
      </form>
    </div>
  );
}
