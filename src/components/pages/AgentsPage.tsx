import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Progress } from '../UI/Progress';
import { 
  Cpu, 
  Activity, 
  BrainCircuit, 
  Terminal, 
  FileText, 
  ChevronLeft, 
  Sparkles, 
  Settings, 
  Clock, 
  ShieldCheck, 
  Search 
} from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const agents = [
    {
      id: "research",
      name: "Research Agent",
      role: "Syllabus Explorer",
      desc: "Searches topics, gathers reference modules, and summarizes primary concepts.",
      currentTask: "Analyzing concurrency limits in Deno v2.0",
      executionTime: "125ms",
      health: 98,
      status: "idle",
      capabilities: ["Vector Semantic Search", "Reference Clustering", "Outline Drafting"],
      memory: "Contains 12 active syllabus threads in local cache",
      systemPrompt: "You are the LearnForge Research Agent. Research the topic and extract 10 key nodes required to master it at the selected expertise level..."
    },
    {
      id: "teacher",
      name: "Teacher Agent",
      role: "Content Synthesizer",
      desc: "Compiles comprehensive markdown course outlines, concepts, and tutorials.",
      currentTask: "Drafting chapter 3 text details for React compiler",
      executionTime: "840ms",
      health: 100,
      status: "running",
      capabilities: ["Analogy Translation", "Markdown Engineering", "Code Snippet Seeding"],
      memory: "Tracking 24 previously answered student query prompts",
      systemPrompt: "You are the LearnForge Teacher Agent. Write detailed educational summary notes (in Markdown format) covering the topic..."
    },
    {
      id: "coding",
      name: "Coding Agent",
      role: "Sandbox Scaffolder",
      desc: "Creates coding lab test suites, initial codebases, and solution checkpoints.",
      currentTask: "Formulating palindromic string checkers",
      executionTime: "450ms",
      health: 95,
      status: "running",
      capabilities: ["Syntax Scaffolding", "Unit Test Design", "Mock Sandbox Isolation"],
      memory: "Cached 8 JS challenge skeletons and evaluator closures",
      systemPrompt: "You are the LearnForge Coding Agent. Formulate a hands-on programming challenge for the topic..."
    },
    {
      id: "quiz",
      name: "Quiz Agent",
      role: "Assessment Designer",
      desc: "Generates multiple-choice checkups, hints, and structured explanations.",
      currentTask: "Synthesizing MCQ logic validation loops",
      executionTime: "310ms",
      health: 99,
      status: "idle",
      capabilities: ["MCQ Generation", "Context Explanation", "Distractor Optimization"],
      memory: "Database containing 48 active quiz sets",
      systemPrompt: "You are the LearnForge Quiz Agent. Create 2 conceptual multiple-choice questions for..."
    },
    {
      id: "visual",
      name: "Visual Agent",
      role: "Diagram Designer",
      desc: "Synthesizes educational flowcharts, mind maps, and timeline diagrams.",
      currentTask: "Assembling SVG architecture chart for Docker nodes",
      executionTime: "620ms",
      health: 97,
      status: "idle",
      capabilities: ["SVG Generation", "Graph Layout Synthesis", "Mindmap Node Sorting"],
      memory: "Vector repository with 15 predefined workflow diagrams",
      systemPrompt: "You are the LearnForge Visual Agent. Compile raw SVG layouts showing the conceptual map of..."
    },
    {
      id: "assessment",
      name: "Assessment Agent",
      role: "Evaluation Proctor",
      desc: "Scores mock tests, evaluates code solutions, and computes final grading rubrics.",
      currentTask: "Awaiting final coding test run trigger",
      executionTime: "180ms",
      health: 100,
      status: "idle",
      capabilities: ["Score Aggregation", "Detailed Error Diagnostics", "Recommendation Mapping"],
      memory: "Holds user grade-point history of 3 complete courses",
      systemPrompt: "You are the LearnForge Assessment Agent. Analyze user answers, generate accuracy profiles, and output customized recommendations..."
    },
    {
      id: "revision",
      name: "Revision Agent",
      role: "Recall Specialist",
      desc: "Generates Leitner spaced-repetition flashcards and schedules reviews.",
      currentTask: "Recycling box 3 items for next session review",
      executionTime: "240ms",
      health: 99,
      status: "idle",
      capabilities: ["Leitner Scheduling", "Front/Back Card Synthesis", "Spaced Recall Modeling"],
      memory: "Spaced-repetition queues with 60 registered memory cards",
      systemPrompt: "You are the LearnForge Revision Agent. Formulate 2 revision flashcards (front/back) covering..."
    },
    {
      id: "progress",
      name: "Progress Agent",
      role: "Timeline Aggregator",
      desc: "Analyzes learning stats, computes streaking metrics, and issues awards.",
      currentTask: "Consolidating heat-map data points",
      executionTime: "120ms",
      health: 100,
      status: "idle",
      capabilities: ["Timeline Audit", "Achievement Badge Issuance", "PDF Certificate Generation"],
      memory: "Completed course profiles and digital signature credentials",
      systemPrompt: "You are the LearnForge Progress Agent. Compile learning metrics and compute completion statuses..."
    }
  ];

  const activeAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <div className="space-y-6 text-left">
      
      {!selectedAgentId ? (
        <>
          {/* Main Nodes Dashboard */}
          <div>
            <h2 className="text-2xl font-bold font-outfit text-white">System AI Agents</h2>
            <p className="text-sm text-zinc-400 font-light mt-1">
              Cooperating agent nodes that dynamically orchestrate and compile your learning paths.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <Card 
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className="p-5 flex flex-col justify-between h-60 cursor-pointer"
                hoverEffect
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/8 text-white">
                      <Cpu size={16} />
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      agent.status === 'running' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-zinc-500/10 text-zinc-400 border border-white/5'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'}`}></span>
                      {agent.status}
                    </span>
                  </div>

                  <div className="text-left space-y-1">
                    <h3 className="font-bold text-white leading-tight">{agent.name}</h3>
                    <span className="text-[10px] text-zinc-500 font-medium tracking-wide uppercase">{agent.role}</span>
                  </div>
                  
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{agent.desc}</p>
                </div>

                <div className="border-t border-white/5 pt-3 text-[10px] space-y-1 text-zinc-500 font-mono">
                  <div className="flex justify-between">
                    <span>Task: {agent.currentTask}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health: {agent.health}%</span>
                    <span>Lat: {agent.executionTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Expanded Agent details inspector room */
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedAgentId(null)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Return to node grid
          </button>

          {activeAgent && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Agent card configuration (Left side) */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="p-6 space-y-6" hoverEffect={false}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                      <Cpu size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-outfit text-white">{activeAgent.name}</h3>
                      <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">{activeAgent.role}</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs border-t border-white/5 pt-5 text-left">
                    <div className="flex justify-between text-zinc-400">
                      <span>Status</span>
                      <span className="text-white font-semibold flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${activeAgent.status === 'running' ? 'bg-emerald-400 animate-ping' : 'bg-zinc-400'}`}></span>
                        {activeAgent.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Response Latency</span>
                      <span className="text-white font-mono">{activeAgent.executionTime}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Node Health</span>
                      <span className="text-white">{activeAgent.health}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase">Health Factor</div>
                    <Progress value={activeAgent.health} />
                  </div>
                </Card>

                {/* Capabilities list */}
                <Card className="p-5 space-y-3" hoverEffect={false}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <BrainCircuit size={14} /> Capability Scope
                  </h4>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    {activeAgent.capabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-white" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* Console Logs, Prompt, Memory (Right side) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Memory context */}
                <Card className="p-6 space-y-4" hoverEffect={false}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity size={14} /> Active Memory Buffer
                  </h4>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-300 font-light leading-relaxed">
                    {activeAgent.memory}
                  </div>
                </Card>

                {/* System instructions */}
                <Card className="p-6 space-y-4" hoverEffect={false}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} /> System Prompt Template
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 text-xs font-mono text-zinc-400 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {activeAgent.systemPrompt}
                  </div>
                </Card>

                {/* Execution logs */}
                <Card className="p-6 space-y-4 bg-slate-950/85 border border-white/5 font-mono text-xs text-zinc-400" hoverEffect={false}>
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="flex items-center gap-1.5 font-sans font-bold uppercase text-[10px] text-zinc-500">
                      <Terminal size={14} /> Live Node Output Console
                    </span>
                    <span className="text-[9px] text-zinc-600">STDOUT / Deno v2.0</span>
                  </div>

                  <div className="space-y-2.5 h-36 overflow-y-auto pr-2">
                    <div>[18:12:04] INITIALIZING AGENT: {activeAgent.name}</div>
                    <div>[18:12:04] LOAD_CONTEXT: Fetching user expertise profile (level: Beginner)...</div>
                    <div>[18:12:05] MODEL_CALL: Sending orchestrator schema payload to gemini-1.5-flash...</div>
                    <div className="text-emerald-400">[18:12:06] SUCCESS: Stream parsing completed. Latency: {activeAgent.executionTime}.</div>
                    {activeAgent.status === 'running' && (
                      <div className="text-zinc-500 animate-pulse">[18:12:07] POLLING: Monitoring filesystem socket channels...</div>
                    )}
                  </div>
                </Card>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
export default AgentsPage;
