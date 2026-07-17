import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { showToast } from './UI/Toast';
import { 
  Sparkles, 
  Plus, 
  Compass, 
  Workflow, 
  BookOpen, 
  Terminal, 
  BadgePercent, 
  Settings, 
  Search, 
  Mic, 
  Send, 
  ArrowUpRight, 
  Menu, 
  X,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { loginAsGuest, loginWithGoogle } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [promptInput, setPromptInput] = useState('');
  const [isPromptFocused, setIsPromptFocused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Canvas Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse position for interactive lighting glow
    let mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Particle Classes
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.1 - 0.05;
        this.speedY = Math.random() * 0.15 - 0.075;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        context.globalAlpha = this.opacity;
        context.fillStyle = '#FFFFFF';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    // Glowing Circles (Soft drifting spheres)
    class GlowSphere {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 150 + 100;
        this.dx = Math.random() * 0.2 - 0.1;
        this.dy = Math.random() * 0.2 - 0.1;
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < -this.radius || this.x > width + this.radius) this.dx *= -1;
        if (this.y < -this.radius || this.y > height + this.radius) this.dy *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.save();
        const gradient = context.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.02)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.005)');
        gradient.addColorStop(1, 'transparent');

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const particles: Particle[] = Array.from({ length: 60 }, () => new Particle());
    const spheres: GlowSphere[] = Array.from({ length: 4 }, () => new GlowSphere());

    // Loop
    const animate = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 1. Draw subtle Grid lines
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Soft Radial Mouse Glow
      ctx.save();
      const mouseGlow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 350
      );
      mouseGlow.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      mouseGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0.005)');
      mouseGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 3. Draw drifting spheres
      spheres.forEach(s => {
        s.update();
        s.draw(ctx);
      });

      // 4. Draw particles
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) {
      showToast('Enter a study prompt to start learning!', 'warning');
      return;
    }
    // Auto trigger guest sandbox session
    loginAsGuest();
    showToast('Starting guest session for: ' + promptInput, 'success');
  };

  const handleQuickAction = (actionTitle: string) => {
    setPromptInput(`Learn ${actionTitle.replace('Generate ', '').replace('Create ', '').replace('Explain ', '')}`);
    showToast(`Loaded template: "${actionTitle}"`, 'info');
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
      
      {/* Interactive Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* -------------------- LEFT SIDEBAR -------------------- */}
      <aside className={`w-64 fixed h-screen top-0 left-0 bg-[#0A0A0A]/90 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col justify-between z-30 transition-transform duration-300 lg:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-8">
          {/* Logo / Meta */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.8)]">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div className="text-left">
              <h1 className="font-outfit font-bold text-base leading-none text-white uppercase tracking-wider">LearnForge AI</h1>
              <span className="text-[9px] text-[#A1A1AA] uppercase tracking-widest font-semibold leading-none mt-1 block">Multi-Agent System</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pl-2 mb-2">Core Hub</div>
            {[
              { label: 'Dashboard', icon: Compass },
              { label: 'AI Agents', icon: Sliders },
              { label: 'Workflows', icon: Workflow },
              { label: 'Learning Sessions', icon: BookOpen },
              { label: 'Progress Tracker', icon: Terminal },
              { label: 'System Settings', icon: Settings },
            ].map((link, idx) => {
              const Icon = link.icon;
              return (
                <button
                  key={idx}
                  onClick={loginAsGuest}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-200 group text-left"
                >
                  <Icon className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="font-medium">{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Upgrade Bottom Card */}
        <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-3 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-white/5 blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Forge Pro</span>
            <Zap size={12} className="text-white fill-white" />
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed text-left">
            Unlock unlimited collaborative AI agents and custom educational workpaths.
          </p>
          <button 
            onClick={loginAsGuest}
            className="w-full py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.25)]"
          >
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* Mobile Menu Backdrop Toggle */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
        />
      )}

      {/* -------------------- MAIN PAGE CONTAINER -------------------- */}
      <main className="flex-1 lg:ml-64 min-h-screen relative z-10 flex flex-col justify-between">
        
        {/* Top Header controls (Right aligned) */}
        <header className="p-6 md:px-12 flex justify-between lg:justify-end items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-[#141414] border border-white/5 text-[#A1A1AA] hover:text-white"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4">
            <Button
              variant="glass"
              size="sm"
              onClick={loginAsGuest}
              className="rounded-full bg-[#141414]/60 border border-white/8 hover:border-white/20 text-[#A1A1AA] hover:text-white px-4 py-2 font-medium text-xs md:text-sm flex items-center gap-2"
            >
              <Plus size={14} />
              <span>New Workspace</span>
            </Button>

            {/* Profile widget */}
            <div 
              onClick={loginAsGuest}
              className="flex items-center gap-2.5 p-1 px-3.5 py-1.5 rounded-full bg-[#141414]/60 border border-white/5 hover:border-white/10 transition-colors cursor-pointer select-none"
            >
              <img 
                src="https://api.dicebear.com/7.x/bottts/svg?seed=LearnForge" 
                alt="Avatar" 
                className="w-6 h-6 rounded-full border border-white/20 bg-black"
              />
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-bold text-white leading-none">Guest Scholar</p>
                <p className="text-[8px] text-zinc-500 leading-none mt-0.5">guest@learnforge.ai</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero & Prompt Centered Container */}
        <div className="max-w-4xl mx-auto w-full px-6 md:px-12 py-6 flex-1 flex flex-col justify-center items-center text-center space-y-12">
          
          {/* Centered Robot & Circular Ring backdrop */}
          <div className="relative w-full max-w-sm flex justify-center items-center">
            {/* Soft glowing circular rings */}
            <div className="absolute w-72 h-72 rounded-full border border-white/5 animate-pulse-slow"></div>
            <div className="absolute w-60 h-60 rounded-full border border-dashed border-white/5 animate-spin" style={{ animationDuration: '30s' }}></div>
            
            {/* Robot Image with Floating Animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-44 h-44 rounded-full overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] bg-[#050505]"
            >
              <img 
                src="/futuristic_robot.png" 
                alt="Intelligent Humanoid Agent" 
                className="w-full h-full object-cover grayscale brightness-95 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
            </motion.div>

            {/* Glowing sparkle badge */}
            <div className="absolute -top-3 right-1/4 p-1.5 rounded-full bg-[#111] border border-white/15 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-outfit tracking-tight leading-tight text-white">
              Intelligent Agentic Education
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] max-w-xl mx-auto font-light leading-relaxed">
              Design personalized roadmaps, run unit-test compilation sandboxes, and solve Leitner spaced-repetition flashcards compiled dynamically by cooperating AI agents.
            </p>
          </div>

          {/* Large Floating Prompt Bar */}
          <form 
            onSubmit={handlePromptSubmit}
            className={`w-full max-w-2xl flex items-center gap-3 p-2.5 rounded-full bg-[#141414]/70 backdrop-blur-xl border transition-all duration-300 ${
              isPromptFocused 
                ? 'border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)] bg-[#1A1A1A]/80' 
                : 'border-white/5 shadow-2xl'
            }`}
          >
            <div className="pl-3.5 text-zinc-400">
              <Sparkles className={`w-5 h-5 transition-colors ${isPromptFocused ? 'text-white' : 'text-zinc-500'}`} />
            </div>
            
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onFocus={() => setIsPromptFocused(true)}
              onBlur={() => setIsPromptFocused(false)}
              placeholder="What would you like to learn today?"
              className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-white placeholder-zinc-500 text-sm md:text-base font-light"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPromptInput('Learn Python backend operations');
                  showToast('Voice transcription simulated.', 'info');
                }}
                className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/5 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
                title="Voice input"
              >
                <Mic size={16} />
              </button>
              
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                title="Send Prompt"
              >
                <Send size={16} />
              </button>
            </div>
          </form>

          {/* Grid of 6 Suggestion Action Cards */}
          <div className="w-full space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Start Learning</span>
              <span className="text-[10px] text-zinc-600 font-mono">Select template workflow</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  title: 'Create Learning Roadmap', 
                  desc: 'Generate a personalized learning roadmap from your goals.',
                  icon: Compass
                },
                { 
                  title: 'Build AI Learning Workflow', 
                  desc: 'Create intelligent multi-agent educational workflows.',
                  icon: Workflow
                },
                { 
                  title: 'Generate Study Notes', 
                  desc: 'Create structured summaries and markdown notes with AI.',
                  icon: BookOpen
                },
                { 
                  title: 'Explain Difficult Concepts', 
                  desc: 'Understand complex topics with simplified intuitive analogies.',
                  icon: Sliders
                },
                { 
                  title: 'Generate Quiz', 
                  desc: 'Assess and test yourself with modular MCQ challenges.',
                  icon: ShieldCheck
                },
                { 
                  title: 'Interview Preparation', 
                  desc: 'Run through mock coding assessments and unit assertions.',
                  icon: Terminal
                }
              ].map((card, idx) => {
                const CardIcon = card.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => handleQuickAction(card.title)}
                    className="p-6 rounded-[28px] bg-[#141414]/40 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-[#1A1A1A]/40 transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer group flex flex-col justify-between h-44 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="p-2 rounded-xl bg-white/5 border border-white/8 text-white">
                          <CardIcon size={16} />
                        </div>
                        <ArrowUpRight size={14} className="text-zinc-600 group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-primary-light transition-colors mt-2">{card.title}</h4>
                      <p className="text-xs text-[#A1A1AA] font-light leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="p-6 text-center text-[10px] text-zinc-600 font-mono border-t border-white/3">
          © 2026 LearnForge AI. All rights reserved. Encrypted JWT Auth / Supabase orchestrator verification.
        </footer>
      </main>
    </div>
  );
};
export default LandingPage;
