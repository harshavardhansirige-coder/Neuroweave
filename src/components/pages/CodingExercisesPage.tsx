import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { showToast } from '../UI/Toast';
import { 
  Play, 
  Send, 
  Terminal, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  Award, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  FileCode
} from 'lucide-react';

export const CodingExercisesPage: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>("task-1");
  const [consoleOutput, setConsoleOutput] = useState<string[]>(["Idle. Awaiting execution trigger..."]);
  const [isRunning, setIsRunning] = useState(false);
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);

  const challenges = [
    {
      id: "task-1",
      title: "Asynchronous Sleep Helper",
      difficulty: "Intermediate",
      tags: ["Async", "Promises"],
      description: "Write a JavaScript function sleep(ms) that returns a Promise which resolves after ms milliseconds. This is essential for controlling execution intervals.",
      boilerplate: `function sleep(ms) {\n  // Write your code here\n  \n}`,
      testCase: "await sleep(100) -> resolves in ~100ms",
      solutionCheck: (code: string) => {
        return code.includes('Promise') && (code.includes('setTimeout') || code.includes('resolve'));
      }
    },
    {
      id: "task-2",
      title: "Object Property Path Resolver",
      difficulty: "Advanced",
      tags: ["Objects", "Algorithms"],
      description: "Write a helper function getPath(obj, path) that takes a nested object and a dot-notation path (e.g. 'user.profile.name') and returns the value, or undefined if the path does not exist.",
      boilerplate: `function getPath(obj, path) {\n  // Write your code here\n  \n}`,
      testCase: "getPath({a:{b:2}}, 'a.b') -> 2",
      solutionCheck: (code: string) => {
        return code.includes('split') || code.includes('reduce');
      }
    }
  ];

  const activeChallenge = challenges.find(c => c.id === selectedTaskId) || challenges[0];
  const [editorCode, setEditorCode] = useState(activeChallenge.boilerplate);

  const handleSelectChallenge = (id: string) => {
    setSelectedTaskId(id);
    const selected = challenges.find(c => c.id === id);
    if (selected) {
      setEditorCode(selected.boilerplate);
      setConsoleOutput(["Console cleared. Loaded task: " + selected.title]);
      setAiExplanation(null);
    }
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(prev => [...prev, "> Starting evaluation runner..."]);
    
    setTimeout(() => {
      let isCorrect = false;
      try {
        isCorrect = activeChallenge.solutionCheck(editorCode);
      } catch (err) {
        setConsoleOutput(prev => [...prev, `[ERROR] Compile failed: ${err}`]);
        setIsRunning(false);
        return;
      }

      setIsRunning(false);
      if (isCorrect) {
        setConsoleOutput(prev => [
          ...prev,
          `> Executing: ${activeChallenge.testCase}`,
          `[SUCCESS] Test Assertion Passed! Return code valid.`,
          `Status: Ready to submit.`
        ]);
        showToast('Challenge test cases passed!', 'success');
      } else {
        setConsoleOutput(prev => [
          ...prev,
          `> Executing: ${activeChallenge.testCase}`,
          `[FAILURE] Assertion failed. The function returned undefined or did not formulate a promise structure.`,
          `Check your logic and retry.`
        ]);
        showToast('Test assertion failed.', 'danger');
      }
    }, 800);
  };

  const handleSubmitCode = () => {
    const isCorrect = activeChallenge.solutionCheck(editorCode);
    if (isCorrect) {
      showToast('Solution submitted successfully! Learning session updated.', 'success');
    } else {
      showToast('Verify that code passes test runners before submitting.', 'warning');
    }
  };

  const handleTriggerAiHint = () => {
    setIsAiExplaining(true);
    setTimeout(() => {
      setIsAiExplaining(false);
      setAiExplanation(
        `Coding Agent Recommendation:\n` +
        `- For sleep(ms), return a new Promise(resolve => ...).\n` +
        `- Inside the executor callback, spawn a setTimeout that invokes resolve() after the specified milliseconds.\n` +
        `- This suspends the synchronous caller scope effectively.`
      );
      showToast('AI suggestions rendered.', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-outfit text-white">Coding Playground</h2>
          <p className="text-sm text-zinc-400 font-light mt-1">Write, compile, and submit hands-on programming challenges evaluated by the Coding Agent.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Challenge list sidebar (Col span 3) */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 space-y-4" hoverEffect={false}>
            <div className="border-b border-white/5 pb-2">
              <h3 className="font-bold text-xs text-zinc-500 uppercase tracking-widest">Active Exercises</h3>
            </div>
            <div className="space-y-2">
              {challenges.map(chal => (
                <Card
                  key={chal.id}
                  onClick={() => handleSelectChallenge(chal.id)}
                  className={`p-4 cursor-pointer text-left transition-all ${
                    selectedTaskId === chal.id 
                      ? 'bg-white/5 border-primary/30' 
                      : 'bg-transparent border-white/5'
                  }`}
                  hoverEffect
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500">
                      <span>{chal.difficulty}</span>
                    </div>
                    <h4 className="font-bold text-white text-xs leading-snug">{chal.title}</h4>
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      {chal.tags.map((t, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[8px] text-zinc-400 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Coding Area splits (Col span 9) */}
        <div className="lg:col-span-9 grid md:grid-cols-12 gap-4 items-stretch">
          
          {/* Problem Statement & Hint Panel (Col span 4) */}
          <div className="md:col-span-4 space-y-4">
            <Card className="p-5 space-y-4 h-full flex flex-col justify-between" hoverEffect={false}>
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Problem Statement</span>
                  <h4 className="font-bold text-sm text-white leading-tight">{activeChallenge.title}</h4>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  {activeChallenge.description}
                </p>
                <div className="p-3 bg-white/3 border border-white/5 rounded-xl text-[10px] text-zinc-400 font-mono space-y-1">
                  <div className="font-bold text-white uppercase text-[8px] tracking-wide mb-1">Expected Test:</div>
                  {activeChallenge.testCase}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <Button 
                  variant="glass" 
                  size="sm" 
                  onClick={handleTriggerAiHint} 
                  disabled={isAiExplaining}
                  className="w-full text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={12} />
                  {isAiExplaining ? 'Thinking...' : 'Ask AI Agent Hint'}
                </Button>
                
                {aiExplanation && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-[10px] font-mono text-zinc-400 leading-normal whitespace-pre-wrap">
                    {aiExplanation}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Code Editor & Console output (Col span 8) */}
          <div className="md:col-span-8 space-y-4 flex flex-col justify-between">
            {/* Editor Plate */}
            <Card className="p-4 flex-1 flex flex-col justify-between" hoverEffect={false}>
              <div className="space-y-2 flex-1 flex flex-col">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase pb-2 border-b border-white/5">
                  <span className="flex items-center gap-1"><FileCode size={12} /> editor.js</span>
                  <span>JavaScript</span>
                </div>
                
                <textarea
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className="w-full flex-1 min-h-[30vh] bg-transparent border-0 outline-none text-zinc-300 font-mono text-xs md:text-sm resize-none focus:ring-0 focus:outline-none pt-4"
                />
              </div>

              {/* Action runner buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-[10px] text-zinc-500 font-mono">Lines: {editorCode.split('\n').length}</span>
                <div className="flex gap-2">
                  <Button variant="glass" size="sm" onClick={handleRunCode} disabled={isRunning} className="text-xs flex items-center gap-1">
                    <Play size={12} /> Run Code
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSubmitCode} className="text-xs flex items-center gap-1">
                    <Send size={12} /> Submit
                  </Button>
                </div>
              </div>
            </Card>

            {/* Console Output Plate */}
            <Card className="p-4 bg-slate-950/80 border border-white/5 font-mono text-[11px] text-zinc-400 h-36 flex flex-col justify-between" hoverEffect={false}>
              <div className="flex items-center justify-between border-b border-white/5 pb-2 text-zinc-500">
                <span className="flex items-center gap-1.5 uppercase font-bold text-[9px] tracking-wide">
                  <Terminal size={13} /> Evaluator Stderr/Stdout
                </span>
                <span>Node.js v20.x</span>
              </div>
              <div className="flex-1 overflow-y-auto pt-2 space-y-1.5">
                {consoleOutput.map((out, idx) => (
                  <div key={idx} className={out.includes('[SUCCESS]') ? 'text-emerald-400' : out.includes('[ERROR]') || out.includes('[FAILURE]') ? 'text-rose-400' : ''}>
                    {out}
                  </div>
                ))}
              </div>
            </Card>

          </div>

        </div>

      </div>

    </div>
  );
};
export default CodingExercisesPage;
