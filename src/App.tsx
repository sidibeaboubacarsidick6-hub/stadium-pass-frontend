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
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
