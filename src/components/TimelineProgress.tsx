import React, { useEffect, useRef } from 'react';
import { OrchestrationLog } from '../services/agentService';
import { Card } from './UI/Card';
import { Search, Calendar, GraduationCap, Code, ShieldQuestion, Brain, Package, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineProgressProps {
  logs: OrchestrationLog[];
  isGenerating: boolean;
}

const AGENTS = [
  { name: 'Prompt Analyzer', icon: Search, color: 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10' },
  { name: 'Research Agent', icon: Brain, color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { name: 'Curriculum Agent', icon: Calendar, color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  { name: 'Teacher Agent', icon: GraduationCap, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { name: 'Coding Agent', icon: Code, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { name: 'Quiz Agent', icon: ShieldQuestion, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
  { name: 'Revision Agent', icon: Brain, color: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10' },
  { name: 'Aggregator', icon: Package, color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
];

export const TimelineProgress: React.FC<TimelineProgressProps> = ({ logs, isGenerating }) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Determine current active agent name
  const currentActiveAgent = logs.length > 0 ? logs[logs.length - 1].agentName : '';
  const lastLogStatus = logs.length > 0 ? logs[logs.length - 1].status : '';

  const getAgentStatus = (agentName: string) => {
    const index = logs.findIndex(log => log.agentName === agentName);
    if (index === -1) return 'idle';
    
    // Check if there is a later completed log or if the current one is completed
    const completedLog = logs.some(log => log.agentName === agentName && log.status === 'completed');
    if (completedLog) return 'completed';
    
    const failedLog = logs.some(log => log.agentName === agentName && log.status === 'failed');
    if (failedLog) return 'failed';

    return 'running';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="p-6 md:p-8" hoverEffect={false} glow>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-secondary bg-clip-text text-transparent">
            Agent Orchestrator Pipeline
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            Watch multiple LLM agent nodes collaborate, plan, research, and format your curriculum.
          </p>
        </div>

        {/* Pipeline Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 items-start relative">
          {AGENTS.map((agent, idx) => {
            const status = getAgentStatus(agent.name);
            const Icon = agent.icon;
            
            return (
              <div key={agent.name} className="flex flex-col items-center text-center space-y-2 relative">
                {/* Visual Node */}
                <motion.div
                  animate={status === 'running' ? { scale: [1, 1.1, 1], boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center relative z-10 transition-colors duration-300 ${
                    status === 'completed' ? 'bg-primary/20 border-primary text-primary-light shadow-neon' :
                    status === 'running' ? 'bg-secondary/20 border-secondary text-secondary-light' :
                    status === 'failed' ? 'bg-rose-500/20 border-rose-500 text-rose-400' :
                    'bg-slate-900 border-white/5 text-zinc-600'
                  }`}
                >
                  {status === 'completed' ? (
                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}

                  {/* Tiny pulsing indicator */}
                  {status === 'running' && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-secondary-light"></span>
                    </span>
                  )}
                </motion.div>

                {/* Node Title */}
                <span className={`text-[10px] md:text-xs font-semibold leading-tight max-w-[90px] ${
                  status === 'completed' ? 'text-primary-light' :
                  status === 'running' ? 'text-secondary-light font-bold' :
                  'text-zinc-500'
                }`}>
                  {agent.name}
                </span>

                {/* Connecting Lines for large screens */}
                {idx < AGENTS.length - 1 && (
                  <div className="hidden md:block absolute left-[calc(50%+24px)] top-6 w-[calc(100%-48px)] h-[2px] bg-white/5 z-0">
                    <div 
                      className={`h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ${
                        status === 'completed' ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Console Terminal Logs */}
      <Card className="border border-white/5 bg-slate-950/80 p-5 rounded-2xl shadow-inner font-mono text-xs md:text-sm text-zinc-400" hoverEffect={false}>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5 text-zinc-500">
          <div className="flex items-center gap-1.5 font-sans font-semibold">
            <Terminal size={14} className="text-secondary" />
            <span>Agent Execution Log console</span>
          </div>
          <div className="flex gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></span>
          </div>
        </div>

        <div className="h-44 overflow-y-auto space-y-2.5 pr-2">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="text-zinc-600 select-none">[{log.timestamp}]</span>
              <span className={`font-semibold shrink-0 ${
                log.agentName === 'Prompt Analyzer' ? 'text-zinc-400' :
                log.agentName === 'Research Agent' ? 'text-purple-400' :
                log.agentName === 'Curriculum Agent' ? 'text-sky-400' :
                log.agentName === 'Teacher Agent' ? 'text-amber-400' :
                log.agentName === 'Coding Agent' ? 'text-emerald-400' :
                log.agentName === 'Quiz Agent' ? 'text-rose-400' :
                log.agentName === 'Revision Agent' ? 'text-fuchsia-400' :
                'text-blue-400'
              }`}>
                {log.agentName}:
              </span>
              <span className={log.status === 'failed' ? 'text-rose-400' : 'text-zinc-300'}>
                {log.message}
              </span>
            </div>
          ))}
          {isGenerating && (
            <div className="flex items-center gap-1.5 text-zinc-500 italic animate-pulse pl-2">
              <span>System processing agent node [{currentActiveAgent}]...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
      </Card>
    </div>
  );
};
export default TimelineProgress;
