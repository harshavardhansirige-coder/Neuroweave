import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { showToast } from '../UI/Toast';
import { 
  History, 
  Play, 
  Trash2, 
  MessageSquare, 
  Terminal, 
  BookOpen, 
  HelpCircle,
  Clock,
  Archive,
  Compass
} from 'lucide-react';

export const LearningSessionsPage: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>("session-1");
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');

  const [sessions, setSessions] = useState([
    {
      id: "session-1",
      topic: "Tokio Mutex Lock Scopes",
      date: "2 hours ago",
      duration: "45 mins",
      isArchived: false,
      status: "Active",
      historyLogs: [
        { sender: "user", text: "Explain Mutex deadlocks in Tokio async threads.", time: "18:02" },
        { sender: "agent-research", text: "Research Agent found 4 references. Main cause is holding standard std::sync::Mutex across await boundary points.", time: "18:03" },
        { sender: "agent-teacher", text: "Teacher Agent generated Markdown study note: 'Tokio Mutex & Lock Operations'.", time: "18:05" }
      ]
    },
    {
      id: "session-2",
      topic: "React Compiler Auto-Memoization",
      date: "Yesterday",
      duration: "1h 12m",
      isArchived: false,
      status: "Suspended",
      historyLogs: [
        { sender: "user", text: "Does React 19 compiler automatically optimize inline functions?", time: "Yesterday 14:10" },
        { sender: "agent-research", text: "Research Agent confirms compiler parses AST tree to automate useMemo / useCallback.", time: "Yesterday 14:11" }
      ]
    },
    {
      id: "session-3",
      topic: "Backpropagation Derivatives Chain Rules",
      date: "1 week ago",
      duration: "30 mins",
      isArchived: true,
      status: "Archived",
      historyLogs: [
        { sender: "user", text: "Solve partial derivatives for vector gradient updates.", time: "2026-07-10" }
      ]
    }
  ]);

  const activeSession = sessions.find(s => s.id === selectedSessionId);

  const handleResumeSession = (topic: string) => {
    showToast(`Resumed learning session: '${topic}'`, 'success');
  };

  const handleArchiveSession = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isArchived: !s.isArchived } : s));
    showToast('Session status updated.', 'success');
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast('Learning session deleted.', 'success');
  };

  const filteredSessions = sessions.filter(s => activeTab === 'active' ? !s.isArchived : s.isArchived);

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-stretch min-h-[70vh] text-left">
      
      {/* 1. Sessions Directory (Col span 5) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
          <h2 className="text-xl font-bold font-outfit text-white">Learning Sessions</h2>
          
          <div className="flex rounded-lg bg-white/5 border border-white/5 p-1 text-[10px]">
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'active' ? 'bg-white/10 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab('archived')}
              className={`px-3 py-1 rounded transition-colors ${activeTab === 'archived' ? 'bg-white/10 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Archived
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              onClick={() => setSelectedSessionId(session.id)}
              className={`p-5 cursor-pointer text-left transition-all ${
                selectedSessionId === session.id 
                  ? 'bg-white/5 border-primary/30' 
                  : 'bg-transparent border-white/5'
              }`}
              hoverEffect
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-mono font-bold text-zinc-500">{session.date}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                    session.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-zinc-500/10 text-zinc-500 border border-white/5'
                  }`}>
                    {session.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug truncate">{session.topic}</h3>
                
                <div className="flex justify-between items-center text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1 font-mono"><Clock size={11} /> {session.duration}</span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleArchiveSession(session.id);
                      }}
                      className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-white"
                      title={session.isArchived ? "Unarchive" : "Archive"}
                    >
                      <Archive size={12} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="p-1 rounded hover:bg-white/5 text-zinc-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 2. Interactive Timeline Viewer (Col span 7) */}
      <div className="lg:col-span-7">
        {activeSession ? (
          <Card className="p-6 h-full flex flex-col justify-between" hoverEffect={false}>
            <div className="space-y-6 flex-1 flex flex-col">
              
              {/* Toolbar */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="text-left">
                  <h3 className="font-bold font-outfit text-white text-base">{activeSession.topic}</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">ID: {activeSession.id}</span>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => handleResumeSession(activeSession.topic)}
                  className="text-xs flex items-center gap-1.5"
                >
                  <Play size={12} /> Resume Chat
                </Button>
              </div>

              {/* Chat timeline logs */}
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[48vh] pr-2">
                {activeSession.historyLogs.map((log, idx) => {
                  const isUser = log.sender === "user";
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 mb-1 font-mono">
                        <span>{isUser ? 'You' : log.sender.replace('agent-', '').toUpperCase()}</span>
                        <span>•</span>
                        <span>{log.time}</span>
                      </div>
                      <div className={`p-4 rounded-2xl text-xs max-w-lg leading-relaxed ${
                        isUser 
                          ? 'bg-white text-black font-medium' 
                          : 'bg-white/5 border border-white/5 text-zinc-300 font-light'
                      }`}>
                        {log.text}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-zinc-500 font-mono flex justify-between">
              <span>Encryption keys synchronized</span>
              <span>Supabase Session State</span>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center text-zinc-500 h-full flex flex-col justify-center items-center" hoverEffect={false}>
            <History size={36} className="text-zinc-700 mb-3" />
            <h4 className="text-white font-bold font-outfit">No Session Loaded</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">Select an active history log from the left index panel to check agent prompt chains.</p>
          </Card>
        )}
      </div>

    </div>
  );
};
export default LearningSessionsPage;
