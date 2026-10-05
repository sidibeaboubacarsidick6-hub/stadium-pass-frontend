import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Ticket as TicketIcon } from 'lucide-react';
import { getMyTickets, downloadTicketPdf, type Ticket } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { ticketToCardProps } from '@/lib/ticket-adapter';
import { downloadIcs } from '@/lib/ics';
import { TicketCard } from '@/components/TicketCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function MyTicketsPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    let cancelled = false;
    getMyTickets()
      .then((data) => {
        if (cancelled) return;
        setTickets(data);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Erreur chargement billets:', err);
        setError("Impossible de charger vos billets.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [navigate]);

  const handleAddToCalendar = (t: Ticket) => {
    downloadIcs(
      {
        title: t.match_title,
        description: `${t.category_name} — Billet ${t.ticket_number}`,
        location: `${t.venue_name}, ${t.venue_city}`,
        startAt: t.kickoff_at,
        durationHours: 2,
      },
      `match-${t.ticket_number}.ics`,
    );
    toast.success('Événement ajouté à votre calendrier');
  };

  const handleDownloadPdf = async (t: Ticket) => {
  try {
    const blob = await downloadTicketPdf(t.uuid);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billet-${t.ticket_number}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('PDF téléchargé');
  } catch (err) {
    console.error('Erreur PDF:', err);
    toast.error('Impossible de télécharger le PDF');
  }
};

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-32">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-brand" />
        <span className="ml-3 text-muted-foreground">Chargement…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <h2 className="text-lg font-semibold text-destructive">Erreur</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-brand/10">
          <TicketIcon className="h-10 w-10 text-emerald-brand" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Aucun billet</h1>
        <p className="mt-2 text-muted-foreground">
          Vous n'avez pas encore acheté de billets.
        </p>
        <Link to="/matches" className="mt-6 inline-block">
          <Button className="bg-orange-brand text-white hover:bg-orange-dark gap-2">
            Voir les matchs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Mes billets</h1>
        <p className="mt-2 text-muted-foreground">
          {tickets.length} billet{tickets.length > 1 ? 's' : ''} — présentez le QR code à l'entrée
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {tickets.map((t) => (
          <TicketCard
            key={t.uuid}
            {...ticketToCardProps(t)}
            onDownloadPdf={() => handleDownloadPdf(t)}
            onAddToCalendar={() => handleAddToCalendar(t)}
            onPrint={handlePrint}
          />
        ))}
      </div>
    </div>
  );
}