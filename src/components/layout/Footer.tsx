import { Link } from 'react-router-dom';
import { Ticket, Mail, Phone, MapPin, Twitter, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black-brand text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-brand">
                <Ticket className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Stadium<span className="text-orange-brand">Pass</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              La plateforme de billetterie football qui vous rapproche du terrain. Réservez vos places en toute simplicité.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-emerald-brand" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-emerald-brand" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-emerald-brand" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link to="/" className="transition-colors hover:text-white">Accueil</Link></li>
              <li><Link to="/matches" className="transition-colors hover:text-white">Tous les matchs</Link></li>
              <li><Link to="/register" className="transition-colors hover:text-white">Créer un compte</Link></li>
              <li><Link to="/login" className="transition-colors hover:text-white">Se connecter</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Informations</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><a href="#" className="transition-colors hover:text-white">Conditions générales</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Politique de confidentialité</a></li>
              <li><a href="#" className="transition-colors hover:text-white">FAQ</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Revente officielle</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-brand" />
                <span>contact@stadiumpass.fr</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-brand" />
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-orange-brand" />
                <span>42 rue du Stade, 75012 Paris</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Stadium Pass. Tous droits réservés.
          </p>
          <p className="text-xs text-white/40">
            Conçu avec passion pour les amateurs de football.
          </p>
        </div>
      </div>
    </footer>
  );
}
