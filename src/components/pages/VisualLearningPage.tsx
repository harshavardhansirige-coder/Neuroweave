import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { showToast } from '../UI/Toast';
import { 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  Download, 
  Maximize2, 
  ChevronLeft, 
  Sparkles, 
  Eye, 
  Network, 
  Activity, 
  Database 
} from 'lucide-react';

export const VisualLearningPage: React.FC = () => {
  const [selectedDiagramId, setSelectedDiagramId] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const [promptInput, setPromptInput] = useState('');

  const diagrams = [
    {
      id: "event-loop",
      title: "Tokio Event Loop & Workers Thread",
      category: "Concurrency Flow",
      description: "Visualization of Tokio's work-stealing scheduling architecture, IO task polls, and waker synchronization pipelines.",
      icon: Network,
      rawSvg: (
        <svg viewBox="0 0 400 200" className="w-full h-full text-white" fill="none">
          <rect width="400" height="200" rx="12" fill="rgba(255,255,255,0.01)" />
          {/* Main Loop Circle */}
          <circle cx="200" cy="100" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="5,5" className="animate-spin-slow" />
          <circle cx="200" cy="100" r="5" fill="#FFFFFF" />
          {/* Worker threads */}
          <rect x="40" y="75" width="70" height="50" rx="8" stroke="#FFFFFF" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
          <text x="75" y="105" fill="#FFFFFF" fontSize="10" textAnchor="middle" fontFamily="Outfit">Worker 1</text>
          
          <rect x="290" y="75" width="70" height="50" rx="8" stroke="#FFFFFF" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
          <text x="325" y="105" fill="#FFFFFF" fontSize="10" textAnchor="middle" fontFamily="Outfit">Worker 2</text>
          
          {/* Channels */}
          <line x1="110" y1="100" x2="155" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="245" y1="100" x2="290" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" markerEnd="url(#arrow)" />
        </svg>
      )
    },
    {
      id: "rsc-boundary",
      title: "React Server/Client Component Hydration",
      category: "Frontend Architecture",
      description: "Visual trace showing backend render flows passing JSON serialization markers to client components during HTML hydration.",
      icon: Activity,
      rawSvg: (
        <svg viewBox="0 0 400 200" className="w-full h-full text-white" fill="none">
          <rect width="400" height="200" rx="12" fill="rgba(255,255,255,0.01)" />
          {/* Server Node */}
          <rect x="30" y="40" width="110" height="120" rx="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
          <text x="85" y="65" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">SERVER NODE</text>
          <text x="85" y="95" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">DB Query -&gt; JSON</text>

          {/* Client Node */}
          <rect x="260" y="40" width="110" height="120" rx="10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
          <text x="315" y="65" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Outfit">CLIENT BROWSER</text>
          <text x="315" y="95" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Hydrates HTML</text>

          {/* Connection Vector */}
          <line x1="140" y1="100" x2="260" y2="100" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4,4" />
        </svg>
      )
    },
    {
      id: "backpropagation",
      title: "Backpropagation Mathematical Node Path",
      category: "Machine Learning Math",
      description: "Visual diagram tracing matrix transposes, activation nodes, and chain rule derivative multiplications.",
      icon: Database,
      rawSvg: (
        <svg viewBox="0 0 400 200" className="w-full h-full text-white" fill="none">
          <rect width="400" height="200" rx="12" fill="rgba(255,255,255,0.01)" />
          {/* Layer nodes */}
          <circle cx="80" cy="60" r="15" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="80" cy="140" r="15" stroke="#FFFFFF" strokeWidth="1.5" />
          
          <circle cx="200" cy="100" r="15" stroke="#FFFFFF" strokeWidth="1.5" />
          
          <circle cx="320" cy="100" r="15" stroke="#FFFFFF" strokeWidth="1.5" />

          {/* Vector weights */}
          <line x1="95" y1="65" x2="185" y2="95" stroke="rgba(255,255,255,0.2)" />
          <line x1="95" y1="135" x2="185" y2="105" stroke="rgba(255,255,255,0.2)" />
          <line x1="215" y1="100" x2="305" y2="100" stroke="rgba(255,255,255,0.2)" />
        </svg>
      )
    }
  ];

  const activeDiagram = diagrams.find(d => d.id === selectedDiagramId);

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.25, 0.75));

  const handleDownload = () => {
    showToast('Mock SVG file downloaded successfully!', 'success');
  };

  const handleBookmark = () => {
    showToast('Diagram bookmarked to learning session.', 'info');
  };

  const handleTriggerGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    showToast('Visual Agent compilation triggered (mock)! Generates new SVG chart.', 'success');
    setPromptInput('');
  };

  return (
    <div className="space-y-6 text-left">
      
      {!selectedDiagramId ? (
        <>
          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-outfit text-white">Visual Laboratory</h2>
              <p className="text-sm text-zinc-400 font-light mt-1">Interactive SVGs, mind maps, and workflow animations compiled by the Visual Agent.</p>
            </div>
          </div>

          {/* Quick Generator Box */}
          <Card className="p-5" hoverEffect={false}>
            <form onSubmit={handleTriggerGenerate} className="flex gap-3">
              <input
                type="text"
                placeholder="Ask Visual Agent to generate a custom SVG layout (e.g. 'Docker architecture')..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
              />
              <Button type="submit" variant="primary" size="sm" className="text-xs flex items-center gap-1">
                <Sparkles size={13} /> Compile Chart
              </Button>
            </form>
          </Card>

          {/* Grid listing */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagrams.map((d) => {
              const Icon = d.icon;
              return (
                <Card 
                  key={d.id}
                  onClick={() => {
                    setSelectedDiagramId(d.id);
                    setZoomScale(1);
                  }}
                  className="p-5 flex flex-col justify-between h-80 cursor-pointer"
                  hoverEffect
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase font-bold text-zinc-500">{d.category}</span>
                      <div className="p-1.5 rounded-lg bg-white/5 text-white">
                        <Icon size={14} />
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug">{d.title}</h3>
                    <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">{d.description}</p>
                  </div>

                  {/* Thumbnail vector preview wrapper */}
                  <div className="w-full h-32 mt-4 bg-slate-950/80 border border-white/5 rounded-xl overflow-hidden flex items-center justify-center p-2">
                    <div className="w-full h-full opacity-60 scale-90">
                      {d.rawSvg}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        /* Detailed Fullscreen Inspector Panel */
        activeDiagram && (
          <div className="space-y-6">
            <button 
              onClick={() => setSelectedDiagramId(null)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} /> Return to gallery
            </button>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Fullscreen Canvas view (Left side, col span 8) */}
              <div className="lg:col-span-8 space-y-4">
                <Card className="p-6 bg-slate-950 border border-white/5 relative h-[50vh] flex items-center justify-center overflow-hidden" hoverEffect={false}>
                  {/* Tool Action Controls */}
                  <div className="absolute top-4 right-4 flex gap-1.5 z-10 bg-black/40 backdrop-blur-md border border-white/10 p-1 rounded-xl">
                    <button onClick={handleZoomIn} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" title="Zoom In">
                      <ZoomIn size={14} />
                    </button>
                    <button onClick={handleZoomOut} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors" title="Zoom Out">
                      <ZoomOut size={14} />
                    </button>
                  </div>

                  {/* SVG Container with transform scaling */}
                  <div 
                    style={{ transform: `scale(${zoomScale})` }} 
                    className="w-full h-full max-w-md max-h-64 transition-transform duration-200 ease-out"
                  >
                    {activeDiagram.rawSvg}
                  </div>
                </Card>

                {/* Info and download */}
                <div className="flex justify-between items-center bg-[#0A0A0A] border border-white/5 p-4 rounded-2xl">
                  <span className="text-xs text-zinc-400">Scale: {Math.round(zoomScale * 100)}%</span>
                  <div className="flex gap-2">
                    <Button variant="glass" size="sm" onClick={handleBookmark} className="text-xs flex items-center gap-1">
                      <Bookmark size={12} /> Bookmark
                    </Button>
                    <Button variant="primary" size="sm" onClick={handleDownload} className="text-xs flex items-center gap-1">
                      <Download size={12} /> Download SVG
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notes sidebar (Right side, col span 4) */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="p-6 space-y-4" hoverEffect={false}>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-zinc-500">{activeDiagram.category}</span>
                    <h3 className="text-xl font-bold font-outfit text-white leading-tight">{activeDiagram.title}</h3>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="space-y-3 text-xs leading-relaxed text-zinc-400 font-light">
                    <p>This layout outlines how task execution parameters pass state variables.</p>
                    <p>• Rectangles designate processing executors.</p>
                    <p>• Circle clusters represent active loop iterations.</p>
                    <p>• Dotted lines represent messaging queues.</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )
      )}

    </div>
  );
};
export default VisualLearningPage;
