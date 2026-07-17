import React from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Progress } from '../UI/Progress';
import { 
  Award, 
  Clock, 
  CheckSquare, 
  Calendar, 
  ChevronRight, 
  Flame, 
  BarChart,
  Trophy,
  Star
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  
  // 15 weeks x 7 days heatmap mockup grid
  const heatmapWeeks = Array.from({ length: 18 }, () => 
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 4)) // 0: no commits, 3: max commits
  );

  const skillPoints = [
    { label: "Rust Concurrency", value: 85 },
    { label: "React Rendering", value: 70 },
    { label: "ML Optimization Math", value: 40 },
    { label: "Data Structure Algo", value: 90 },
    { label: "AI Orchestration Prompting", value: 75 }
  ];

  const goals = [
    { label: "Study Tokio watch channel mechanics", period: "Weekly", completed: true },
    { label: "Solve 5 recursive JS exercises", period: "Weekly", completed: false },
    { label: "Earn React Compiler syllabus badge", period: "Monthly", completed: false }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-outfit text-white">Student Progress Cockpit</h2>
          <p className="text-sm text-zinc-400 font-light mt-1">Audit learning paths, active commits, goal streaks, and radar skill charts.</p>
        </div>
      </div>

      {/* Grid splits: Heatmap & Radar */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Heatmap commits (Col span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-6 space-y-4" hoverEffect={false}>
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="font-outfit font-bold text-sm text-white">Activity Heatmap</h3>
              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1"><Flame size={12} /> 8 Days Current Streak</span>
            </div>

            <div className="space-y-2">
              {/* Heatmap grid */}
              <div className="flex gap-1 overflow-x-auto pb-2">
                {heatmapWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                    {week.map((dayValue, dIdx) => {
                      let color = "bg-white/5"; // 0
                      if (dayValue === 1) color = "bg-white/20";
                      if (dayValue === 2) color = "bg-white/50 shadow-[0_0_4px_rgba(255,255,255,0.3)]";
                      if (dayValue === 3) color = "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]";
                      return (
                        <div 
                          key={dIdx} 
                          className={`w-3.5 h-3.5 rounded-sm transition-colors ${color}`}
                          title={`Value: ${dayValue}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-end items-center gap-1.5 text-[9px] text-zinc-500 font-mono">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-sm bg-white/5" />
                <div className="w-2.5 h-2.5 rounded-sm bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-sm bg-white/50" />
                <div className="w-2.5 h-2.5 rounded-sm bg-white" />
                <span>More</span>
              </div>
            </div>
          </Card>

          {/* Goals Checklist */}
          <Card className="p-6 space-y-4" hoverEffect={false}>
            <h3 className="font-outfit font-bold text-sm text-white">Milestone Goals</h3>
            <div className="space-y-3">
              {goals.map((g, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/3">
                  <span className={`flex items-center gap-2.5 ${g.completed ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
                    <input 
                      type="checkbox" 
                      checked={g.completed}
                      readOnly 
                      className="rounded border-white/10 bg-transparent text-white focus:ring-0 focus:outline-none"
                    />
                    {g.label}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-zinc-600 bg-white/3 px-2 py-0.5 rounded">
                    {g.period}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Skill radar chart (Col span 4) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-4" hoverEffect={false}>
            <div className="border-b border-white/5 pb-2">
              <h3 className="font-outfit font-bold text-sm text-white">Skill Radar</h3>
            </div>

            {/* Custom SVG radar chart overlay */}
            <div className="w-full h-44 flex items-center justify-center pt-2">
              <svg viewBox="0 0 120 120" className="w-full h-full text-white">
                {/* Pentagonal grids */}
                <polygon points="60,10 108,45 89,102 31,102 12,45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <polygon points="60,25 96,51 82,94 38,94 24,51" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <polygon points="60,40 84,58 74,86 46,86 36,58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                
                {/* Spoke axis lines */}
                <line x1="60" y1="60" x2="60" y2="10" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
                <line x1="60" y1="60" x2="108" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
                <line x1="60" y1="60" x2="89" y2="102" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
                <line x1="60" y1="60" x2="31" y2="102" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />
                <line x1="60" y1="60" x2="12" y2="45" stroke="rgba(255,255,255,0.1)" strokeWidth="0.75" />

                {/* Score polygon path */}
                {/* 1: 85% -> 60-42.5=17.5 */}
                {/* 2: 70% -> 60+33.6=93.6 */}
                {/* 3: 40% -> 60+11.6=71.6 */}
                {/* 4: 90% -> 60-26.1=33.9 */}
                {/* 5: 75% -> 60-36=24 */}
                <polygon 
                  points="60,17.5 93.6,49.5 71.6,76.8 33.9,97.8 24,48.7" 
                  fill="rgba(255,255,255,0.1)" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.5" 
                  className="drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                />
              </svg>
            </div>

            {/* Legend indexes */}
            <div className="space-y-2 text-[10px]">
              {skillPoints.map((sp, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-zinc-400 font-light">{sp.label}</span>
                  <span className="font-bold text-white">{sp.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
export default ProgressPage;
