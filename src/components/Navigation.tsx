import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI/Button';
import { getGeminiApiKey, setGeminiApiKey } from '../services/agentService';
import { showToast } from './UI/Toast';
import { Brain, LogOut, Key, User, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  onNavigate: (view: 'landing' | 'dashboard') => void;
  currentView: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, currentView }) => {
  const { user, profile, logout, isDemoMode } = useAuth();
  const [isKeyDrawerOpen, setIsKeyDrawerOpen] = useState(false);
  const [apiKey, setApiKey] = useState(getGeminiApiKey());

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(apiKey);
    showToast('Gemini API Key updated successfully!', 'success');
    setIsKeyDrawerOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/20 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div 
          onClick={() => onNavigate(user ? 'dashboard' : 'landing')} 
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-slate-950 p-2 rounded-lg border border-white/10">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          </div>
          <span className="font-outfit font-bold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">
            LEARNFORGE AI
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {currentView === 'dashboard' && (
                <Button 
                  variant="glass" 
                  size="sm"
                  onClick={() => setIsKeyDrawerOpen(true)}
                  className="flex items-center gap-1.5 text-xs md:text-sm border border-white/5"
                >
                  <Key size={14} className="text-secondary" />
                  <span className="hidden md:inline">Configure API</span>
                </Button>
              )}

              {isDemoMode && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  <ShieldAlert size={12} />
                  Local Sandbox
                </div>
              )}

              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <img 
                  src={profile?.photo_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-primary/40 p-0.5 bg-slate-900"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-white leading-none">{profile?.display_name || 'Scholar'}</p>
                  <p className="text-[10px] text-zinc-400 leading-none mt-1 truncate max-w-[120px]">{profile?.email}</p>
                </div>
                
                <button 
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={() => onNavigate('landing')} className="flex items-center gap-1">
              <Sparkles size={14} />
              Get Started
            </Button>
          )}
        </div>
      </nav>

      {/* API Key Configure Drawer */}
      <AnimatePresence>
        {isKeyDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsKeyDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 glass-panel border-l border-white/10 p-8 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-outfit font-bold flex items-center gap-2">
                  <Key className="text-primary" /> API Settings
                </h3>
                <button 
                  onClick={() => setIsKeyDrawerOpen(false)}
                  className="text-zinc-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary-light">
                  <p className="font-semibold flex items-center gap-1.5 mb-1.5">
                    <Sparkles size={14} /> Run AI Client-Side!
                  </p>
                  LearnForge AI is fully capable of running multi-agent curriculum generations directly in your browser. Providing a Gemini API Key bypasses the need for backend hosting.
                </div>

                <form onSubmit={handleSaveKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-zinc-400 mb-2">Gemini API Key</label>
                    <input 
                      type="password" 
                      placeholder="AIzaSy..." 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4">
                    <Button variant="ghost" type="button" onClick={() => setIsKeyDrawerOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                      Save Credentials
                    </Button>
                  </div>
                </form>

                <div className="border-t border-white/5 pt-6 text-xs text-zinc-500 space-y-2">
                  <p>• Keys are stored securely in local storage (`localStorage`) within your browser.</p>
                  <p>• Create your free Gemini API Key via the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Google AI Studio</a>.</p>
                  <p>• If no key is configured, LearnForge AI will auto-fallback to detailed curriculum mock template structures for prompt execution.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navigation;
