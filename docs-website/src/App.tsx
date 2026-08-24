import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DocsProvider } from './stores/useDocsStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileDrawer } from './components/layout/MobileDrawer';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/common/CommandPalette';

// Pages
import { HomePage } from './pages/HomePage';
import { OverviewPage } from './pages/OverviewPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { EcosystemPage } from './pages/EcosystemPage';
import { TechStackPage } from './pages/TechStackPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ModulesIndexPage } from './pages/ModulesIndexPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { AdminGuidePage } from './pages/AdminGuidePage';
import { CustomerGuidePage } from './pages/CustomerGuidePage';
import { MobileGuidePage } from './pages/MobileGuidePage';
import { DeveloperGuidePage } from './pages/DeveloperGuidePage';
import { DatabasePage } from './pages/DatabasePage';
import { ERDiagramPage } from './pages/ERDiagramPage';
import { ApiReferencePage } from './pages/ApiReferencePage';
import { AuthRbacPage } from './pages/AuthRbacPage';
import { ReportsPage } from './pages/ReportsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { TutorialsPage } from './pages/TutorialsPage';
import { TroubleshootingPage } from './pages/TroubleshootingPage';
import { FaqPage } from './pages/FaqPage';
import { ChangelogPage } from './pages/ChangelogPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { AboutPage } from './pages/AboutPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white transition-colors duration-200">
      <ScrollToTop />
      <Header onMenuToggle={() => setMobileMenuOpen(true)} />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <CommandPalette />

      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        <Sidebar className="hidden lg:flex" />
        <main className="flex-1 min-w-0 px-4 md:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/ecosystem" element={<EcosystemPage />} />
            <Route path="/tech-stack" element={<TechStackPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/modules" element={<ModulesIndexPage />} />
            <Route path="/modules/:id" element={<ModuleDetailPage />} />
            <Route path="/admin-guide" element={<AdminGuidePage />} />
            <Route path="/customer-guide" element={<CustomerGuidePage />} />
            <Route path="/mobile-guide" element={<MobileGuidePage />} />
            <Route path="/developer-guide" element={<DeveloperGuidePage />} />
            <Route path="/database" element={<DatabasePage />} />
            <Route path="/database/er-diagram" element={<ERDiagramPage />} />
            <Route path="/api" element={<ApiReferencePage />} />
            <Route path="/auth-rbac" element={<AuthRbacPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/tutorials" element={<TutorialsPage />} />
            <Route path="/troubleshooting" element={<TroubleshootingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/changelog" element={<ChangelogPage />} />
            <Route path="/stats" element={<StatisticsPage />} />
            <Route path="/about" element={<AboutPage />} />
            {/* Fallback */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <DocsProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </DocsProvider>
  );
}
