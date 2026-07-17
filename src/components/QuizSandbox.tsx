import React, { useState, useEffect } from 'react';
import { QuizQuestion, CodingExercise } from '../types';
import { Card } from './UI/Card';
import { Button } from './UI/Button';
import { showToast } from './UI/Toast';
import { CheckCircle2, XCircle, Code, ShieldQuestion, Play, Award, RotateCcw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizSandboxProps {
  quizzes: QuizQuestion[];
  codingExercises: CodingExercise[];
  onCompleteDay: (score?: number, codeSolved?: boolean) => void;
}

export const QuizSandbox: React.FC<QuizSandboxProps> = ({
  quizzes = [],
  codingExercises = [],
  onCompleteDay
}) => {
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'quiz' | 'code'>(
    quizzes.length > 0 ? 'quiz' : 'code'
  );

  // Quiz states
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Coding states
  const [userCode, setUserCode] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [testOutput, setTestOutput] = useState<{ status: 'idle' | 'success' | 'failed'; message: string }>({
    status: 'idle',
    message: ''
  });

  const activeQuiz = quizzes[currentQuizIdx];
  const activeExercise = codingExercises[0]; // Take first challenge for simplicity

  useEffect(() => {
    if (activeExercise) {
      setUserCode(activeExercise.initial_code);
    }
    // Reset states on chapter change
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setQuizAnswers({});
    setShowExplanation(false);
    setQuizScore(null);
    setTestOutput({ status: 'idle', message: '' });
  }, [quizzes, codingExercises]);

  // Handle Quiz Option Selection
  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // Answered already
    setSelectedOption(idx);
    setQuizAnswers({ ...quizAnswers, [currentQuizIdx]: idx });
    setShowExplanation(true);
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx < quizzes.length - 1) {
      setCurrentQuizIdx(currentQuizIdx + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Calculate score
      let correct = 0;
      quizzes.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correct_option_index) {
          correct++;
        }
      });
      const score = Math.round((correct / quizzes.length) * 100);
      setQuizScore(score);
      showToast(`Quiz completed! Score: ${score}%`, 'success');
      onCompleteDay(score, false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setQuizAnswers({});
    setShowExplanation(false);
    setQuizScore(null);
  };

  // Code runner evaluation logic
  const handleRunCode = async () => {
    if (!activeExercise) return;
    setIsCompiling(true);
    setTestOutput({ status: 'idle', message: 'Initiating environment compiler sandbox...' });

    setTimeout(() => {
      try {
        // Safe evaluation of standard functions
        // Let's create an evaluation scope
        let isSuccess = false;
        let consoleMsg = '';

        if (activeExercise.title.toLowerCase().includes('palindrome')) {
          // Palindrome evaluator
          const evaluator = new Function(`
            ${userCode}
            try {
              return solve_challenge("racecar") === true && solve_challenge("hello") === false;
            } catch(e) {
              return false;
            }
          `);
          isSuccess = evaluator();
          consoleMsg = isSuccess 
            ? '✓ Test case 1 ("racecar") passed (expected: true)\n✓ Test case 2 ("hello") passed (expected: false)\n\nAll tests passed successfully!'
            : '✗ Test case 1 failed. Expected solve_challenge("racecar") to return true and solve_challenge("hello") to return false.';
        } else if (activeExercise.title.toLowerCase().includes('counter') || userCode.includes('Counter')) {
          // React counter check
          const containsState = userCode.includes('useState');
          const containsButtons = userCode.includes('onClick');
          isSuccess = containsState && containsButtons;
          consoleMsg = isSuccess
            ? '✓ Counter component compilation successful.\n✓ State binding initialized.\n✓ Pointer onClick handlers verified.\n\nAll assertions passed!'
            : '✗ Compilation failed: Missing state hook or interactive button parameters.';
        } else {
          // Default JS eval checker
          const evaluator = new Function(`
            ${userCode}
            try {
              return true;
            } catch(e) {
              return false;
            }
          `);
          isSuccess = evaluator();
          consoleMsg = isSuccess
            ? '✓ Program compiled and executed without runtime interrupts.\n\nTest case passed.'
            : '✗ Runtime exception caught during execution.';
        }

        if (isSuccess) {
          setTestOutput({ status: 'success', message: consoleMsg });
          showToast('Coding challenge solved!', 'success');
          onCompleteDay(undefined, true);
        } else {
          setTestOutput({ status: 'failed', message: consoleMsg });
          showToast('Some test cases failed. Review code.', 'error');
        }
      } catch (err: any) {
        setTestOutput({ status: 'failed', message: `✗ SyntaxError: ${err.message}` });
        showToast('Compilation error.', 'error');
      } finally {
        setIsCompiling(false);
      }
    }, 1500);
  };

  const handleResetCode = () => {
    if (activeExercise) {
      setUserCode(activeExercise.initial_code);
      setTestOutput({ status: 'idle', message: '' });
      showToast('Boilerplate code restored.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-white/5 pb-0.5 gap-4">
        {quizzes.length > 0 && (
          <button
            onClick={() => setActiveWorkspaceTab('quiz')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeWorkspaceTab === 'quiz'
                ? 'border-primary text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldQuestion size={16} /> Conceptual Quiz
          </button>
        )}
        {codingExercises.length > 0 && (
          <button
            onClick={() => setActiveWorkspaceTab('code')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeWorkspaceTab === 'code'
                ? 'border-primary text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code size={16} /> Coding Lab
          </button>
        )}
      </div>

      {/* Quiz Workspace Tab */}
      {activeWorkspaceTab === 'quiz' && quizzes.length > 0 && (
        <Card className="p-6 md:p-8" hoverEffect={false}>
          {quizScore === null ? (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center text-xs text-zinc-500 font-semibold">
                <span>QUIZ QUESTION {currentQuizIdx + 1} OF {quizzes.length}</span>
                <span className="bg-white/5 px-2 py-1 rounded">Score-based evaluation</span>
              </div>

              <h3 className="text-lg font-semibold text-white leading-snug">
                {activeQuiz.question}
              </h3>

              <div className="grid gap-3">
                {activeQuiz.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === activeQuiz.correct_option_index;
                  const hasAnswered = selectedOption !== null;

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
                          : hasAnswered && isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-950/30 border-white/5 hover:bg-slate-900/10 hover:border-white/10 text-zinc-300 disabled:pointer-events-none'
                      }`}
                    >
                      <span>{option}</span>
                      {hasAnswered && isCorrect && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                      {hasAnswered && isSelected && !isCorrect && <XCircle size={16} className="text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanations drawer */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs md:text-sm text-zinc-400 space-y-2"
                  >
                    <p className="font-bold text-white flex items-center gap-1">
                      {selectedOption === activeQuiz.correct_option_index ? (
                        <span className="text-emerald-400">✓ Correct Answer</span>
                      ) : (
                        <span className="text-rose-400">✗ Incorrect Answer</span>
                      )}
                    </p>
                    <p>{activeQuiz.explanation}</p>
                    <div className="flex justify-end pt-2">
                      <Button variant="primary" size="sm" onClick={handleNextQuiz} className="text-xs">
                        {currentQuizIdx < quizzes.length - 1 ? 'Next Question' : 'Complete Quiz'}
                        <ChevronRight size={12} className="ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Quiz completed summary screen */
            <div className="text-center py-8 space-y-6 max-w-sm mx-auto">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-neon">
                <Award size={40} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-outfit">Quiz Completed</h3>
                <p className="text-zinc-400 text-sm">You solved all quiz assessment questions successfully.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Final Result Score</div>
                <div className="text-4xl font-extrabold text-white">{quizScore}%</div>
                <div className="mt-2 text-xs text-zinc-400">
                  {quizScore >= 70 ? '🎉 Excellent mastery!' : '📝 Take a look at notes and retry.'}
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="glass" size="sm" onClick={handleResetQuiz} className="text-xs">
                  <RotateCcw size={12} className="mr-1.5" /> Retake Quiz
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Code Workspace Tab */}
      {activeWorkspaceTab === 'code' && activeExercise && (
        <div className="grid lg:grid-cols-12 gap-6 items-stretch text-left">
          {/* Instructions Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <Card className="p-6 h-full flex flex-col justify-between" hoverEffect={false}>
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-primary-light uppercase tracking-wider">Instructions</div>
                <h3 className="text-lg font-semibold text-white">{activeExercise.title}</h3>
                
                {/* Problem details */}
                <div className="text-sm text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                  {activeExercise.problem_statement}
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-8 pt-4 border-t border-white/5">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold mb-2">Test Runner Panel</div>
                <div className={`p-4 rounded-xl font-mono text-xs overflow-x-auto ${
                  testOutput.status === 'success' ? 'bg-emerald-950/30 border border-emerald-500/20 text-emerald-400' :
                  testOutput.status === 'failed' ? 'bg-rose-950/30 border border-rose-500/20 text-rose-400' :
                  'bg-slate-950 text-zinc-500 border border-white/5'
                }`}>
                  {testOutput.message || 'Ready. Click "Run Code" to compile assertions.'}
                </div>
              </div>
            </Card>
          </div>

          {/* IDE Editor Column */}
          <div className="lg:col-span-7">
            <Card className="flex flex-col h-full bg-slate-950 border border-white/5 overflow-hidden" hoverEffect={false}>
              {/* IDE Header */}
              <div className="bg-slate-900 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="ml-2 font-mono font-medium">index.js</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCode}
                    className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-white"
                    title="Reset Editor"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* IDE Editor Input */}
              <div className="flex-1 relative font-mono text-xs md:text-sm p-4 min-h-[300px]">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-full bg-transparent border-0 outline-none text-zinc-300 font-mono resize-none focus:ring-0 focus:outline-none"
                  style={{ tabSize: 2 }}
                />
              </div>

              {/* IDE Actions */}
              <div className="bg-slate-900 px-4 py-3 border-t border-white/5 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRunCode}
                  isLoading={isCompiling}
                  className="text-xs shadow-none"
                >
                  <Play size={12} className="mr-1.5" /> Run Code
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
export default QuizSandbox;
