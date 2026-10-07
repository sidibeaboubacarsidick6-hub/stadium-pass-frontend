import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomePage } from '@/pages/HomePage';
import { MatchListPage } from '@/pages/MatchListPage';
import { MatchDetailPage } from '@/pages/MatchDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { MyTicketsPage } from '@/pages/MyTicketsPage';
import { ScannerPage } from '@/pages/ScannerPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import {
  OrganizerLayout,
  DashboardPage,
  OrganizerMatchesPage,
  OrganizerCompetitionsPage,
  OrganizerVenuesPage,
  OrganizerTeamsPage,
  MatchFormPage
} from '@/pages/organizer';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matches" element={<MatchListPage />} />
            <Route path="/matches/:id" element={<MatchDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
            <Route path="/scanner" element={<ScannerPage />} />
            <Route path="/checkout/:uuid" element={<CheckoutPage />} />

            {/* Espace organisateur */}
            <Route path="/organizer" element={<OrganizerLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="matches" element={<OrganizerMatchesPage />} />
              <Route path="matches/new" element={<MatchFormPage />} />
              <Route path="competitions" element={<OrganizerCompetitionsPage />} />
              <Route path="venues" element={<OrganizerVenuesPage />} />
              <Route path="teams" element={<OrganizerTeamsPage />} />
              <Route path="matches/:uuid/edit" element={<MatchFormPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;