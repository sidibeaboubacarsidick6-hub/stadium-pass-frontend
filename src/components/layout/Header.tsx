import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ticket, Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getUser, isAuthenticated, onAuthChange, clearAuth, type AuthUser } from '@/lib/auth';
import { toast } from 'sonner';

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Matchs', path: '/matches' },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(getUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  // Réagit aux changements d'auth (login/logout)
  useEffect(() => {
    const refresh = () => {
      setUser(getUser());
      setAuthenticated(isAuthenticated());
    };
    refresh();
    return onAuthChange(refresh);
  }, []);

  const handleLogout = () => {
    clearAuth();
    toast.success('Déconnexion réussie');
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-brand">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-black-brand">
            Stadium<span className="text-emerald-brand">Pass</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive(link.path)
                  ? 'text-emerald-brand bg-emerald-brand/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
          {authenticated && (
            <Link
              to="/my-tickets"
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                isActive('/my-tickets')
                  ? 'text-emerald-brand bg-emerald-brand/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              Mes billets
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {authenticated && user ? (
            <>
              <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-brand text-xs font-bold text-white">
                  {user.first_name[0]}{user.last_name[0]}
                </div>
                <span className="text-sm font-medium">{user.first_name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <User className="h-4 w-4" />
                  Connexion
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-emerald-brand text-white hover:bg-emerald-light">
                  Inscription
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'text-emerald-brand bg-emerald-brand/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {link.label}
              </Link>
            ))}
            {authenticated && (
              <Link
                to="/my-tickets"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive('/my-tickets')
                    ? 'text-emerald-brand bg-emerald-brand/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                Mes billets
              </Link>
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              {authenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-brand text-xs font-bold text-white">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.full_name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full gap-2">
                      <User className="h-4 w-4" />
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-emerald-brand text-white hover:bg-emerald-light">
                      Inscription
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}