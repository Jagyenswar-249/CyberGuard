import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TopTaskbar } from './components/layout/TopTaskbar';
import { Footer } from './components/layout/Footer';
import { Home } from './routes/Home';
import { Dashboard } from './routes/Dashboard';
import { UrlAnalyzer } from './routes/UrlAnalyzer';
import { IdentityAnalyzer } from './routes/IdentityAnalyzer';
import { BehaviorAnalyzer } from './routes/BehaviorAnalyzer';
import { Alerts } from './routes/Alerts';
import { Incidents } from './routes/Incidents';
import { IncidentDetail } from './routes/IncidentDetail';
import { Login } from './routes/Login';
import { SignUp } from './routes/SignUp';
import { NotFound } from './routes/NotFound';

export function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#/', '');
    if (hash) {
      const base = hash.split('/')[0];
      return base || 'home';
    }
    return 'home';
  });

  const [routeParam, setRouteParam] = useState<string | undefined>(() => {
    const hash = window.location.hash.replace('#/', '');
    const parts = hash.split('/');
    return parts.length > 1 ? parts[1] : undefined;
  });

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const parts = hash.split('/');
      const route = parts[0] || 'home';
      const param = parts[1];
      setCurrentRoute(route);
      setRouteParam(param);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string, param?: string) => {
    if (param) {
      window.location.hash = `#/${route}/${param}`;
    } else {
      window.location.hash = `#/${route}`;
    }
  };

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <Home
            onNavigate={navigate}
            onOpenDeepfakeModal={() => navigate('analyze_identity')}
          />
        );
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'analyze_url':
        return <UrlAnalyzer onNavigate={navigate} />;
      case 'analyze_identity':
        return <IdentityAnalyzer onNavigate={navigate} />;
      case 'analyze_behavior':
        return <BehaviorAnalyzer onNavigate={navigate} />;
      case 'alerts':
        return <Alerts onNavigate={navigate} />;
      case 'incidents':
        return <Incidents onNavigate={navigate} initialFilter={routeParam} />;
      case 'incident_detail':
        return (
          <IncidentDetail
            incidentId={routeParam || 'inc-9081'}
            onBack={() => navigate('incidents')}
          />
        );
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'signup':
        return <SignUp onNavigate={navigate} />;
      case '404':
        return <NotFound onNavigate={navigate} />;
      default:
        return <NotFound onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Unified Taskbar Header */}
      <TopTaskbar
        activeRoute={currentRoute}
        onRouteChange={(route) => navigate(route)}
        onOpenDeepfakeModal={() => navigate('analyze_identity')}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8">
        {renderRoute()}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
