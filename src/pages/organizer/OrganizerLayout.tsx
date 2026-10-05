import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Trophy, MapPin, Users, CalendarDays,
  ArrowLeft, Building2,
} from 'lucide-react'
import { getUser, isOrganizer } from '@/lib/auth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { to: '/organizer', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/organizer/matches', label: 'Matchs', icon: CalendarDays },
  { to: '/organizer/competitions', label: 'Compétitions', icon: Trophy },
  { to: '/organizer/venues', label: 'Stades', icon: MapPin },
  { to: '/organizer/teams', label: 'Équipes', icon: Users },
]

export function OrganizerLayout() {
  const navigate = useNavigate()
  const user = getUser()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!isOrganizer()) {
      navigate('/')
    }
  }, [user, navigate])

  if (!user || !isOrganizer()) return null

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <Building2 className="size-5 text-primary" aria-hidden="true" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold">{user.organization?.name}</span>
            <span className="truncate text-xs text-muted-foreground">Espace organisateur</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-3" aria-label="Navigation organisateur">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-border p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Retour au site
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 md:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" aria-hidden="true" />
            <span className="font-bold">{user.organization?.name}</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground">
            Quitter
          </Link>
        </header>

        {/* Mobile nav (horizontal scroll) */}
        <nav
          className="flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden"
          aria-label="Navigation organisateur (mobile)"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
                )
              }
            >
              <item.icon className="size-3.5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-5 sm:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default OrganizerLayout
