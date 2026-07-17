import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { showToast } from '../UI/Toast';
import { 
  Folder, 
  Search, 
  Plus, 
  Pin, 
  FileText, 
  BookOpen, 
  Maximize2, 
  Edit3, 
  Download, 
  Sparkles, 
  Languages, 
  BrainCircuit,
  CornerDownRight
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("note-1");
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');

  const folders = [
    { id: "all", name: "All Folders", count: 4 },
    { id: "rust", name: "Rust Backend", count: 2 },
    { id: "react", name: "React Compiler", count: 1 },
    { id: "ml", name: "Neural Math", count: 1 }
  ];

  const [notes, setNotes] = useState([
    {
      id: "note-1",
      title: "Rust Mutex & Lock Operations",
      folder: "rust",
      pinned: true,
      lastModified: "2h ago",
      content: `# Rust Mutex & Lock Operations\n\nMutex (Mutual Exclusion) guarantees safe mutable sharing across thread borders in Rust. When locking shared data, remember:\n\n1. Lock acquisition blocks current thread execution until lock ownership drops.\n2. In Rust,Mutex guard wrappers unlock instantly when scope closes.\n\n\`\`\`rust\nuse std::sync::Mutex;\n\nlet counter = Mutex::new(0);\n{\n    let mut data = counter.lock().unwrap();\n    *data += 1;\n} // unlocked automatically\n\`\`\``
    },
    {
      id: "note-2",
      title: "Concurrent Channels Design Patterns",
      folder: "rust",
      pinned: true,
      lastModified: "Yesterday",
      content: `# Concurrent Channels Design Patterns\n\nChannels are multi-producer, single-consumer communication conduits. Standard implementations include:\n\n- **mpsc**: Multi-producer, single consumer channels.\n- **broadcast**: Sends channel payload events to all active thread listeners.\n- **watch**: State-tracking channel keeping the newest value inside cache.`
    },
    {
      id: "note-3",
      title: "React Server Components Hydration",
      folder: "react",
      pinned: false,
      lastModified: "3 days ago",
      content: `# React Server Components Hydration\n\nReact Server Components (RSC) allow rendering parts of components directly on the backend database nodes, reducing package bundles. Hydration is completed on client DOM hooks by rendering static elements first, then binding interactive handlers.`
    },
    {
      id: "note-4",
      title: "Jacobian Matrix Backpropagation Values",
      folder: "ml",
      pinned: false,
      lastModified: "1 week ago",
      content: `# Jacobian Matrix Backpropagation Values\n\nIn neural networks, gradient updating steps require chain rules to multiply derivatives. The Jacobian matrix maps variable dimension changes to error outputs.`
    }
  ]);

  const activeNote = notes.find(n => n.id === selectedNoteId);

  const handleUpdateContent = (newText: string) => {
    setNotes(prev => prev.map(n => n.id === selectedNoteId ? { ...n, content: newText } : n));
  };

  const handleSummarize = () => {
    if (!activeNote) return;
    const summaryText = `\n\n---\n**AI Summary Notes:**\nThis lecture explains synchronous and asynchronous boundaries. Key takeaways include mutex lock scopes, drop guards, and thread bounds.`;
    handleUpdateContent(activeNote.content + summaryText);
    showToast('AI summary generated and appended!', 'success');
  };

  const handleTranslate = () => {
    showToast('Note translated to Spanish (simulated)!', 'info');
  };

  const handleCreateFlashcards = () => {
    showToast('Leitner flashcards generated from note contents!', 'success');
  };

  const handleExportMarkdown = () => {
    showToast('Markdown exported successfully!', 'success');
  };

  const handleCreateNote = () => {
    const newId = `note-${Date.now()}`;
    const newNote = {
      id: newId,
      title: "Untitled Note",
      folder: activeFolder === 'all' ? 'rust' : activeFolder,
      pinned: false,
      lastModified: "Just now",
      content: "# Untitled Note\n\nWrite something..."
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newId);
    showToast('New note created.', 'success');
  };

  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolder === 'all' || n.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  return (
    <div className="grid lg:grid-cols-12 gap-6 items-stretch min-h-[72vh] text-left">
      
      {/* 1. Folders Pane (Col span 3) */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="p-4 space-y-4 h-full" hoverEffect={false}>
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <h3 className="font-outfit font-bold text-sm text-white uppercase tracking-wider">Notebooks</h3>
            <button 
              onClick={handleCreateNote}
              className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1">
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFolder(f.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                  activeFolder === f.id 
                    ? 'bg-white/5 text-white font-bold' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/3'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Folder size={13} className="text-zinc-500" />
                  {f.name}
                </span>
                <span className="bg-white/5 px-2 py-0.5 rounded text-[10px] text-zinc-500">{f.count}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* 2. Notes List Pane (Col span 3) */}
      <div className="lg:col-span-3 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredNotes.map(note => (
            <Card
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`p-4 cursor-pointer text-left transition-all ${
                selectedNoteId === note.id 
                  ? 'bg-white/5 border-primary/30' 
                  : 'bg-transparent border-white/5'
              }`}
              hoverEffect
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-bold text-zinc-500">{note.folder}</span>
                  {note.pinned && <Pin size={10} className="text-white fill-white" />}
                </div>
                <h4 className="font-bold text-white text-xs leading-snug truncate">{note.title}</h4>
                <div className="flex justify-between items-center text-[9px] text-zinc-500 font-mono">
                  <span>{note.lastModified}</span>
                  <span className="flex items-center gap-0.5"><FileText size={8} /> {note.content.length} chars</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. Note Editor Pane (Col span 6) */}
      <div className="lg:col-span-6">
        {activeNote ? (
          <Card className="p-6 h-full flex flex-col justify-between" hoverEffect={false}>
            <div className="space-y-4 flex-1 flex flex-col">
              
              {/* Note actions toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 size={14} className="text-zinc-500" />
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setNotes(prev => prev.map(n => n.id === activeNote.id ? { ...n, title: newTitle } : n));
                    }}
                    className="bg-transparent border-none outline-none font-bold text-white text-sm focus:ring-0 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={handleExportMarkdown} className="p-1.5 text-zinc-500 hover:text-white" title="Export Markdown">
                    <Download size={13} />
                  </Button>
                </div>
              </div>

              {/* Action AI bar */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="glass" size="sm" onClick={handleSummarize} className="text-[10px] px-2.5 py-1 flex items-center gap-1.5">
                  <Sparkles size={11} /> Summarize
                </Button>
                <Button variant="glass" size="sm" onClick={handleTranslate} className="text-[10px] px-2.5 py-1 flex items-center gap-1.5">
                  <Languages size={11} /> Translate
                </Button>
                <Button variant="glass" size="sm" onClick={handleCreateFlashcards} className="text-[10px] px-2.5 py-1 flex items-center gap-1.5">
                  <BrainCircuit size={11} /> Make Flashcards
                </Button>
              </div>

              {/* Edit textarea */}
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateContent(e.target.value)}
                className="w-full flex-1 min-h-[40vh] bg-transparent border-0 outline-none text-zinc-300 font-mono text-xs md:text-sm resize-none focus:ring-0 focus:outline-none pt-4"
              />
            </div>

            <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-[10px] text-zinc-500 font-mono">
              <span>Saved locally</span>
              <span>UTF-8</span>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center text-zinc-500 h-full flex flex-col justify-center items-center" hoverEffect={false}>
            <BookOpen size={36} className="text-zinc-700 mb-3" />
            <h4 className="text-white font-bold font-outfit">No Note Selected</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">Select a note outline from the left to load rich text details.</p>
          </Card>
        )}
      </div>

    </div>
  );
};
export default NotesPage;
