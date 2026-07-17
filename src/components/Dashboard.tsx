import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { showToast } from './UI/Toast';
import { AgentOrchestrator, OrchestrationLog } from '../services/agentService';
import { CompleteSessionData } from '../types';
import { TimelineProgress } from './TimelineProgress';

// Pages
import DashboardPage from './pages/DashboardPage';
import AgentsPage from './pages/AgentsPage';
import CoursesPage from './pages/CoursesPage';
import NotesPage from './pages/NotesPage';
import QuizzesPage from './pages/QuizzesPage';
import VisualLearningPage from './pages/VisualLearningPage';
import CodingExercisesPage from './pages/CodingExercisesPage';
import AssessmentsPage from './pages/AssessmentsPage';
import ProgressPage from './pages/ProgressPage';
import LearningSessionsPage from './pages/LearningSessionsPage';
import SettingsPage from './pages/SettingsPage';

// Icons
import { 
  LayoutDashboard, 
  Cpu, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  Video, 
  Code, 
  FileText, 
  BarChart, 
  FolderKanban, 
  Settings, 
  Search, 
  User, 
  Mic, 
  Plus, 
  Sparkles, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Send,
  Upload,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Layout states
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Prompt bar states
  const [promptInput, setPromptInput] = useState('');
  
  // Pipeline Orchestrator states
  const [isGenerating, setIsGenerating] = useState(false);
  const [orchestrationLogs, setOrchestrationLogs] = useState<OrchestrationLog[]>([]);

  // Navigation config mapping
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'agents', label: 'AI Agents', icon: Cpu, badge: 'Active' },
    { id: 'courses', label: 'Courses', icon: GraduationCap, badge: '4' },
    { id: 'notes', label: 'Notes', icon: BookOpen, badge: null },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle, badge: 'New' },
    { id: 'visual', label: 'Visual Learning', icon: Video, badge: null },
    { id: 'coding', label: 'Coding Exercises', icon: Code, badge: null },
    { id: 'assessments', label: 'Assessments', icon: FileText, badge: null },
    { id: 'progress', label: 'Progress', icon: BarChart, badge: null },
    { id: 'sessions', label: 'Learning Sessions', icon: FolderKanban, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  // Hotkey listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    showToast(`Searching for: ${searchQuery}`, 'info');
    setIsSearchOpen(false);
  };

  // Pipeline Generator Trigger
  const handleTriggerOrchestration = async () => {
    if (!promptInput.trim()) {
      showToast('State a learning topic first.', 'warning');
      return;
    }

    setIsGenerating(true);
    setOrchestrationLogs([]);

    const fakeSessionId = 'session-' + Math.random().toString(36).substring(2, 9);
    try {
      const orchestrator = new AgentOrchestrator(fakeSessionId, (logs) => {
        setOrchestrationLogs(logs);
      });

      const response = await orchestrator.orchestrate(promptInput, 'Intermediate', 10, 'English');
      
      // Update local storage sessions
      const existing = JSON.parse(localStorage.getItem('neuroweave_local_sessions') || '[]');
      const updated = [response, ...existing];
      localStorage.setItem('neuroweave_local_sessions', JSON.stringify(updated));

      setIsGenerating(false);
      setPromptInput('');
      setActiveTab('courses'); // Navigate to courses
      showToast('Multi-Agent Curriculum Generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      showToast('Agent compilation execution failed.', 'danger');
    }
  };

  // File uploading simulator
  const handleUploadMock = () => {
    showToast('Document uploaded successfully. Parsing learning vectors...', 'success');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex relative overflow-hidden font-sans">
      
      {/* 1. Collapsible Fixed Left Sidebar */}
      <motion.aside 
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        className="fixed top-0 bottom-0 left-0 z-30 bg-[#0A0A0A] border-r border-white/5 flex flex-col justify-between pt-6 pb-6 select-none shrink-0"
      >
        <div className="space-y-6">
          {/* Logo brand */}
          <div className="px-5 flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="text-left">
                <h1 className="font-outfit font-extrabold text-sm tracking-widest text-white uppercase">LearnForge AI</h1>
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold block mt-0.5">Multi-Agent System</span>
              </div>
            )}
            
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white"
            >
              {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          {/* Navigation menus */}
          <nav className="space-y-1.5 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all relative group text-xs ${
                    isActive 
                      ? 'bg-white/5 text-white font-bold' 
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/3'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-400'} />
                  
                  {!isSidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}

                  {/* Active background indicator bar */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute left-0 top-2 bottom-2 w-1 rounded bg-white" 
                    />
                  )}

                  {/* Badge */}
                  {!isSidebarCollapsed && item.badge && (
                    <span className="bg-white/10 text-white border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider scale-90">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer logout */}
        <div className="px-3">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-white/3 text-xs transition-colors"
          >
            <LogOut size={14} />
            {!isSidebarCollapsed && <span>Logout Account</span>}
          </button>
        </div>
      </motion.aside>

      {/* 2. Main Page Content frame (adjusted padding for fixed sidebar) */}
      <div 
        className="flex-1 flex flex-col min-w-0 transition-all duration-300"
        style={{ paddingLeft: isSidebarCollapsed ? 80 : 260 }}
      >
        
        {/* Top Header navbar */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-[#050505]/60 backdrop-blur-md sticky top-0 z-20">
          {/* Global search trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/3 text-zinc-500 hover:text-white text-xs max-w-xs w-60 text-left transition-all"
          >
            <Search size={13} />
            <span>Search everything...</span>
            <span className="ml-auto text-[9px] font-mono border border-white/10 px-1.5 py-0.5 rounded">Ctrl+K</span>
          </button>

          {/* Quick active status profile wrapper */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white text-xs font-bold uppercase">
              FG
            </div>
          </div>
        </header>

        {/* Content canvas container */}
        <main className="p-6 md:p-8 pb-32 flex-1 relative z-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardPage 
                  onNavigateToTab={setActiveTab} 
                  userPrompt={promptInput}
                  setUserPrompt={setPromptInput}
                  onTriggerGenerate={handleTriggerOrchestration}
                />
              )}
              {activeTab === 'agents' && <AgentsPage />}
              {activeTab === 'courses' && <CoursesPage />}
              {activeTab === 'notes' && <NotesPage />}
              {activeTab === 'quizzes' && <QuizzesPage />}
              {activeTab === 'visual' && <VisualLearningPage />}
              {activeTab === 'coding' && <CodingExercisesPage />}
              {activeTab === 'assessments' && <AssessmentsPage />}
              {activeTab === 'progress' && <ProgressPage />}
              {activeTab === 'sessions' && <LearningSessionsPage />}
              {activeTab === 'settings' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* 3. Floating Prompt Bar bottom center */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-xl px-4 pointer-events-none">
          <Card className="p-2 border-white/8 bg-slate-950/90 shadow-2xl backdrop-blur-2xl rounded-2xl flex items-center gap-2 pointer-events-auto" hoverEffect={false}>
            {/* Action attachments triggers */}
            <button 
              onClick={handleUploadMock}
              className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors shrink-0" 
              title="Upload file vectors"
            >
              <Upload size={14} />
            </button>
            <button 
              onClick={() => showToast('Microphone transcription listening...', 'info')}
              className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-colors shrink-0" 
              title="Voice transcription input"
            >
              <Mic size={14} />
            </button>

            {/* Input field */}
            <input
              type="text"
              placeholder="What would you like to learn today?"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTriggerOrchestration()}
              className="flex-1 bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-500 focus:ring-0 focus:outline-none"
            />

            {/* Trigger compile */}
            <button
              onClick={handleTriggerOrchestration}
              className="p-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors shrink-0"
              title="Orchestrate syllabus"
            >
              <Send size={12} />
            </button>
          </Card>
        </div>

      </div>

      {/* 4. Global Search Modal Palette */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50 p-6 glass-panel border border-white/10 rounded-2xl shadow-2xl space-y-4"
            >
              <form onSubmit={handleGlobalSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Query system files, syllabus nodes, and sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  autoFocus
                />
                <Button type="submit" variant="primary" size="sm" className="text-xs">
                  Search
                </Button>
              </form>
              <div className="text-[10px] text-zinc-500 font-mono text-left flex justify-between">
                <span>Tip: Press Esc to close palette</span>
                <span>Hits: courses, agents, settings</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Pipeline compilation progress display */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030014]/95 backdrop-blur-md z-50 flex items-center justify-center p-6"
          >
            <TimelineProgress logs={orchestrationLogs} isGenerating={isGenerating} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Dashboard;
