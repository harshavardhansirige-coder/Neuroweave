import React from 'react';
import { RoadmapDay, UserProgress } from '../types';
import { Card } from './UI/Card';
import { CheckCircle2, Circle, Clock, ChevronRight } from 'lucide-react';

interface RoadmapViewProps {
  days: RoadmapDay[];
  progress: UserProgress[];
  selectedDayId: string | null;
  onSelectDay: (dayId: string) => void;
  onToggleComplete: (dayId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  days,
  progress,
  selectedDayId,
  onSelectDay,
  onToggleComplete
}) => {
  const isDayCompleted = (dayId: string) => {
    return progress.some(p => p.day_id === dayId);
  };

  return (
    <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h3 className="font-outfit font-bold text-lg text-white">Course Syllabus</h3>
        <span className="text-xs text-zinc-400 font-semibold bg-white/5 px-2.5 py-1 rounded-full">
          {progress.length} / {days.length} Completed
        </span>
      </div>

      <div className="space-y-3 relative pl-3 border-l-2 border-white/5">
        {days.map((day, index) => {
          const completed = isDayCompleted(day.id);
          const isSelected = selectedDayId === day.id;

          return (
            <div key={day.id} className="relative group">
              {/* Timeline Connector Bullet */}
              <div 
                className={`absolute -left-[19px] top-6 w-3 h-3 rounded-full border-2 transition-all ${
                  completed 
                    ? 'bg-primary border-primary shadow-neon' 
                    : isSelected 
                      ? 'bg-secondary border-secondary' 
                      : 'bg-[#030014] border-white/10'
                }`}
              />

              <div
                onClick={() => onSelectDay(day.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-primary/10 border-primary/40 shadow-neon-secondary'
                    : 'bg-slate-950/30 border-white/5 hover:border-white/10 hover:bg-slate-900/20'
                }`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      completed 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-white/5 text-zinc-400'
                    }`}>
                      Day {day.day_number}
                    </span>
                    <span className="text-zinc-500 text-xs flex items-center gap-1">
                      <Clock size={11} /> {day.estimated_minutes}m
                    </span>
                  </div>
                  <h4 className={`font-semibold text-sm leading-tight transition-colors ${
                    isSelected ? 'text-white font-bold' : 'text-zinc-300'
                  }`}>
                    {day.title.replace(/^Day \d+:\s*/, '')}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(day.id);
                    }}
                    className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
                  >
                    {completed ? (
                      <CheckCircle2 size={18} className="text-emerald-400 fill-emerald-950/50" />
                    ) : (
                      <Circle size={18} className="text-zinc-600 hover:text-primary-light" />
                    )}
                  </button>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default RoadmapView;
