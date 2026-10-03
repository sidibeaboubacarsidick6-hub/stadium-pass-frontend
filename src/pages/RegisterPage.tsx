import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Ticket, ArrowRight, Check, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { registerUser, loginUser } from '@/lib/api';
import { useEffect } from 'react';
import { isAuthenticated } from '@/lib/auth';

export function RegisterPage() {
  const navigate = useNavigate();
    useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    if (password !== passwordConfirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (!acceptTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation");
      return;
    }

    setLoading(true);
    try {
      // 1. Inscription
      await registerUser({
        email: email.trim().toLowerCase(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        password,
        password_confirm: passwordConfirm,
      });

      // 2. Connexion automatique
      await loginUser({ email: email.trim().toLowerCase(), password });

      toast.success('Compte créé ! Bienvenue sur Stadium Pass 🎉');
      navigate('/');
    } catch (err) {
      toast.error((err as Error).message || "Erreur lors de l'inscription");
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
            Rejoignez la communauté
          </h2>
          <p className="text-white/70 max-w-md">
            Créez votre compte en 30 secondes et accédez à tous les matchs.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-orange-brand" />
              Billets instantanés par email
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-orange-brand" />
              Paiement sécurisé Mobile Money
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-orange-brand" />
              Historique de vos achats
            </li>
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Créer un compte</h1>
            <p className="mt-2 text-muted-foreground">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-medium text-emerald-brand hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom *</Label>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jean"
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  className="mt-1.5"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+225 07 00 00 00 00"
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  className="pl-9 pr-10"
                  required
                  minLength={8}
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

            <div>
              <Label htmlFor="passwordConfirm">Confirmer le mot de passe *</Label>
              <Input
                id="passwordConfirm"
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Retapez le mot de passe"
                className="mt-1.5"
                required
              />
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-muted-foreground">
                {"J'accepte les "}
                <a href="#" className="text-emerald-brand hover:underline">
                  conditions générales
                </a>
                {' et la '}
                <a href="#" className="text-emerald-brand hover:underline">
                  politique de confidentialité
                </a>
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-brand text-white hover:bg-orange-dark gap-2"
              size="lg"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
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