import React, { useState } from 'react';
import { StudyNote } from '../types';
import { Card } from './UI/Card';
import { BookOpen, Copy, Check, Info } from 'lucide-react';
import { showToast } from './UI/Toast';

interface StudyNotesProps {
  note: StudyNote | undefined;
}

export const StudyNotes: React.FC<StudyNotesProps> = ({ note }) => {
  const [copied, setCopied] = useState(false);

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500">
        <BookOpen size={48} className="text-zinc-600 mb-4 animate-bounce" />
        <p className="font-semibold">Loading lesson syllabus notes...</p>
        <p className="text-xs text-zinc-600 mt-1">Select a chapter from the left to load content.</p>
      </div>
    );
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom parser to split notes into sections and parse headers, code blocks and bullet items
  const renderFormattedContent = (markdown: string) => {
    const lines = markdown.split('\n');
    let isInsideCodeBlock = false;
    let codeContent: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      // Code block check
      if (line.trim().startsWith('```')) {
        if (isInsideCodeBlock) {
          // Closing code block
          isInsideCodeBlock = false;
          const codeString = codeContent.join('\n');
          elements.push(
            <div key={`code-${idx}`} className="relative my-4 rounded-xl border border-white/5 overflow-hidden bg-slate-950 font-mono text-xs md:text-sm">
              <div className="bg-slate-900/60 px-4 py-2 border-b border-white/5 flex items-center justify-between text-zinc-500 select-none">
                <span>Code Example</span>
                <button
                  onClick={() => handleCopyCode(codeString)}
                  className="p-1 rounded hover:bg-white/5 text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-zinc-300 leading-relaxed">
                <code>{codeString}</code>
              </pre>
            </div>
          );
          codeContent = [];
        } else {
          // Starting code block
          isInsideCodeBlock = true;
        }
        return;
      }

      if (isInsideCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headers parsing
      if (line.startsWith('# ')) {
        elements.push(
          <h2 key={idx} className="text-2xl md:text-3xl font-bold font-outfit text-white mt-6 mb-3 border-b border-white/5 pb-2">
            {line.replace('# ', '')}
          </h2>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3 key={idx} className="text-xl md:text-2xl font-semibold font-outfit text-primary-light mt-5 mb-2.5">
            {line.replace('## ', '')}
          </h3>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="text-lg md:text-xl font-semibold text-secondary-light mt-4 mb-2">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Bullet items
      else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <ul key={idx} className="list-disc pl-6 text-zinc-300 my-2 space-y-1">
            <li>{line.replace(/^[\s*-]+/, '')}</li>
          </ul>
        );
      } else if (/^\d+\.\s/.test(line.trim())) {
        elements.push(
          <ol key={idx} className="list-decimal pl-6 text-zinc-300 my-2 space-y-1">
            <li>{line.replace(/^\d+\.\s+/, '')}</li>
          </ol>
        );
      }
      // Blank space
      else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />);
      }
      // Regular paragraph
      else {
        // Simple inline code parser `const a = 1` -> <code className="bg-white/5 rounded px-1.5 py-0.5 font-mono text-xs text-primary-light">const a = 1</code>
        const inlineCodeRegex = /`([^`]+)`/g;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        
        let text = line;
        
        // Return paragraphs with standard React structure
        elements.push(
          <p key={idx} className="text-zinc-300 leading-relaxed text-sm md:text-base my-2 font-light">
            {line.split(' ').map((word, wIdx) => {
              // Quick check for backticks
              if (word.startsWith('`') && word.endsWith('`')) {
                return (
                  <code key={wIdx} className="bg-white/10 text-primary-light px-1.5 py-0.5 rounded font-mono text-xs mr-1">
                    {word.replace(/`/g, '')}
                  </code>
                );
              }
              // Quick bold check
              if (word.startsWith('**') && word.endsWith('**')) {
                return (
                  <strong key={wIdx} className="text-white font-semibold mr-1">
                    {word.replace(/\*\*/g, '')}
                  </strong>
                );
              }
              return word + ' ';
            })}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Key Takeaways panel */}
      {note.key_takeaways && note.key_takeaways.length > 0 && (
        <Card className="bg-primary/5 border border-primary/20 p-5 rounded-2xl relative overflow-hidden" hoverEffect={false}>
          <div className="absolute -right-6 -bottom-6 text-primary/10 select-none">
            <Info size={100} />
          </div>
          
          <h4 className="font-outfit font-bold text-sm text-primary-light uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Info size={16} /> Key Takeaways
          </h4>
          
          <ul className="space-y-2 text-zinc-300 text-sm">
            {note.key_takeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Main content body */}
      <div className="prose prose-invert max-w-none text-left">
        {renderFormattedContent(note.content)}
      </div>
    </div>
  );
};
export default StudyNotes;
