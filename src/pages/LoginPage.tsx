import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Ticket, ArrowRight, ShieldCheck, Zap, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { loginUser } from '@/lib/api';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';

export function LoginPage() {
  const navigate = useNavigate();
    useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email: email.trim().toLowerCase(), password });
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (err) {
      toast.error((err as Error).message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src="https://images.pexels.com/photos/29348229/pexels-photo-29348229.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Fans dans un stade"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-brand/90 via-black/70 to-black/80" />
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-brand">
              <Ticket className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">Stadium Pass</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">
            Vivez le football au cœur du stade
          </h2>
          <p className="text-white/70 max-w-md">
            Retrouvez tous vos billets, vos prochains matchs et votre historique en un seul endroit.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-orange-brand" />
              Paiement 100% sécurisé
            </li>
            <li className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-brand" />
              Billets instantanés
            </li>
            <li className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-orange-brand" />
              Mobile Money accepté
            </li>
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
            <p className="mt-2 text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-medium text-emerald-brand hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="pl-9 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-brand text-white hover:bg-orange-dark gap-2"
              size="lg"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8">
            <Separator />
          </div>
        </div>
      </div>
    </div>
  );
}