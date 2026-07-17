import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/UI/Toast';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // Sync route based on auth user status
  useEffect(() => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('landing');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#030014] flex flex-col items-center justify-center overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] rounded-full glow-blur-primary opacity-20 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="w-12 h-12 rounded-xl border-2 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="font-outfit font-semibold text-zinc-400 tracking-wider text-sm">SYNCHRONIZING SECURE JWT SESSION...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative">
      {currentView === 'landing' ? (
        <LandingPage />
      ) : (
        <Dashboard />
      )}

      {/* Global Toast Drawer */}
      <ToastProvider />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
