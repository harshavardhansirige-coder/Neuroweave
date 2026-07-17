import React from 'react';
import { Card } from '../UI/Card';
import { Progress } from '../UI/Progress';
import { Button } from '../UI/Button';
import { 
  Sparkles, 
  Play, 
  Clock, 
  TrendingUp, 
  Zap, 
  Calendar, 
  Award, 
  ChevronRight, 
  Terminal, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardPageProps {
  onNavigateToTab: (tab: string) => void;
  userPrompt: string;
  setUserPrompt: (val: string) => void;
  onTriggerGenerate: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onNavigateToTab, 
  userPrompt, 
  setUserPrompt, 
  onTriggerGenerate 
}) => {
  
  const stats = [
    { label: "Learning Hours", value: "32.4h", change: "+12% this week", icon: Clock },
    { label: "Daily Streak", value: "8 Days", change: "Personal best!", icon: Flame },
    { label: "Active Modules", value: "4 Courses", change: "2 near completion", icon: Zap },
    { label: "Overall Accuracy", value: "88%", change: "+3.4% improvement", icon: Award },
  ];

  const agentLogs = [
    { agent: "Research Agent", action: "Parsed 'Advanced Rust Concurrency' index", time: "2 min ago", status: "completed" },
    { agent: "Coding Agent", action: "Compiled code playground templates", time: "12 min ago", status: "completed" },
    { agent: "Teacher Agent", action: "Synthesized markdown study nodes", time: "30 min ago", status: "completed" },
    { agent: "Quiz Agent", action: "Generated quiz assertions", time: "1h ago", status: "completed" }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. Hero Welcomer */}
      <div className="relative overflow-hidden rounded-[24px] bg-[#0A0A0A] border border-white/5 p-8 md:p-10">
        <div className="absolute top-1/2 -right-8 w-60 h-60 rounded-full glow-blur-primary opacity-15 transform -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white">
            <Sparkles size={12} className="animate-pulse" />
            <span className="font-semibold font-outfit uppercase tracking-wider">LearnForge Engine Active</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-outfit leading-tight text-white">
            Forge Your Learning Future.
          </h2>
          <p className="text-sm md:text-base text-zinc-400 font-light leading-relaxed">
            State your study targets, and let our multi-agent model build custom syllabi, markdown lectures, interactive sandboxes, and quiz modules.
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-5 flex flex-col justify-between" hoverEffect>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
                <div className="p-2 rounded-lg bg-white/5 text-white">
                  <Icon size={14} />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold font-outfit text-white">{stat.value}</div>
                <div className="text-[10px] text-emerald-400 font-medium mt-1 flex items-center gap-1">
                  <TrendingUp size={10} /> {stat.change}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 3. Main Split Area */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Continue Learning & Analytics (Left Column) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-outfit font-bold text-lg text-white">Continue Learning</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('courses')} className="text-xs flex items-center gap-1">
              View All <ChevronRight size={12} />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5 flex flex-col justify-between h-48" hoverEffect>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded">Python</span>
                  <span className="text-[10px] text-zinc-500 font-medium">Day 8 of 15</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight">Advanced Asynchronous Pipelines</h4>
                <p className="text-xs text-zinc-400 line-clamp-2">Learn async/await frameworks, event loops, and asyncio coroutines.</p>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                  <span>Progress</span>
                  <span>53%</span>
                </div>
                <Progress value={53} />
              </div>
            </Card>

            <Card className="p-5 flex flex-col justify-between h-48" hoverEffect>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded">TypeScript</span>
                  <span className="text-[10px] text-zinc-500 font-medium">Day 4 of 10</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-tight">TypeScript Type Systems & Generics</h4>
                <p className="text-xs text-zinc-400 line-clamp-2">Master conditional types, mapped types, and complex generic decorators.</p>
              </div>
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                  <span>Progress</span>
                  <span>40%</span>
                </div>
                <Progress value={40} />
              </div>
            </Card>
          </div>

          {/* Interactive Simulated Line Chart */}
          <Card className="p-6 space-y-4" hoverEffect={false}>
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h3 className="font-outfit font-bold text-sm text-white">Learning Analytics</h3>
                <p className="text-[10px] text-zinc-500">Weekly task logs and active learning hours</p>
              </div>
              <Calendar size={14} className="text-zinc-500" />
            </div>

            {/* Custom SVG Line Chart */}
            <div className="w-full h-32 pt-4">
              <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Horizontal grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                
                {/* SVG path drawing simple wave */}
                <path
                  d="M 0 80 Q 80 40 160 60 T 320 20 T 480 30 L 500 30"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                />
                
                {/* Dots at peaks */}
                <circle cx="160" cy="60" r="4" fill="#FFFFFF" />
                <circle cx="320" cy="20" r="4" fill="#FFFFFF" />
                <circle cx="480" cy="30" r="4" fill="#FFFFFF" />
              </svg>
            </div>
            
            {/* Chart X labels */}
            <div className="flex justify-between text-[9px] font-mono text-zinc-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </Card>
        </div>

        {/* Agent Activity Timeline & Recommended (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="font-outfit font-bold text-lg text-white">Agent Activities</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('agents')} className="text-xs flex items-center gap-1">
              Agents Log <ChevronRight size={12} />
            </Button>
          </div>

          {/* Timeline Card */}
          <Card className="p-5 space-y-4" hoverEffect={false}>
            <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest pb-1 border-b border-white/5">
              <span className="flex items-center gap-1"><Terminal size={12} /> Live Timeline Console</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

            <div className="space-y-4">
              {agentLogs.map((log, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="relative flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#0A0A0A] shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10" />
                    {idx < agentLogs.length - 1 && <div className="w-0.5 bg-white/5 flex-1 mt-1 -mb-3" />}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between text-[9px]">
                      <span className="font-bold text-white">{log.agent}</span>
                      <span className="text-zinc-500 font-mono">{log.time}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">{log.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick task action widget */}
          <Card className="p-5 space-y-3" hoverEffect>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Weekly target goals</h4>
            <div className="flex justify-between items-center text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" /> Solve 3 recursion exercises
              </span>
              <span className="text-[10px] text-zinc-500">Done</span>
            </div>
            <div className="flex justify-between items-center text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-zinc-600" /> Complete quiz assessment
              </span>
              <span className="text-[10px] text-zinc-500">Pending</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
