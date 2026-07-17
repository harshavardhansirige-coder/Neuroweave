import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Progress } from '../UI/Progress';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Clock, 
  BookOpen, 
  ChevronLeft, 
  Play, 
  CheckCircle, 
  User, 
  MessageSquare, 
  Compass,
  Paperclip,
  Bookmark
} from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const courses = [
    {
      id: "rust-async",
      title: "Rust Concurrent Pipelines",
      category: "backend",
      difficulty: "Advanced",
      duration: "15 Days",
      progress: 60,
      description: "Learn asynchronous programming in Rust using async/await, Tokios event loops, futures, channels, and synchronization parameters.",
      instructor: "Rust-Teacher AI",
      lessonsCount: 12,
      objectives: [
        "Understand Rust ownership boundaries within thread closures",
        "Implement select! multiplexing loops on concurrent streams",
        "Design non-blocking background workers using crossbeam channels"
      ],
      modules: [
        { title: "Module 1: Futures & Execution Polls", lessons: ["The Future Trait mechanics", "Waker functions and context registers", "Pinning and Unpin memory allocations"] },
        { title: "Module 2: Tokio Runtime Operations", lessons: ["Multi-threaded work-stealing systems", "I/O event loops and non-blocking sockets", "Spawning and task boundary guards"] },
        { title: "Module 3: Channel Communications", lessons: ["mpsc, broadcast, and watch topologies", "Handling backpressure in pipeline nodes", "Mutexes and shared state parameters"] }
      ]
    },
    {
      id: "react-compiler",
      title: "NextJS & React Compiler Architecture",
      category: "frontend",
      difficulty: "Intermediate",
      duration: "10 Days",
      progress: 40,
      description: "Deep dive into React 19 memoization, compiler internals, Server Components, hydration states, and Suspense layouts.",
      instructor: "Vercel-Teacher AI",
      lessonsCount: 8,
      objectives: [
        "Explain automated useMemo and useCallback compiler translation",
        "Implement parallel Suspense data fetching systems",
        "Optimize initial client hydration profiles"
      ],
      modules: [
        { title: "Module 1: Compiler Compiling Passes", lessons: ["Abstract Syntax Tree transformations", "Memoization code generators", "Static analysis checks"] },
        { title: "Module 2: React Server Components", lessons: ["Server/Client boundaries", "Hydration markers and streaming JSON payloads", "Parallel rendering pipelines"] }
      ]
    },
    {
      id: "ml-math",
      title: "Mathematics for Neural Networks",
      category: "ai",
      difficulty: "Advanced",
      duration: "20 Days",
      progress: 10,
      description: "Master partial derivatives, linear algebra transformation matrix operations, backpropagation pathways, and optimizer mathematics.",
      instructor: "Research-Teacher AI",
      lessonsCount: 16,
      objectives: [
        "Compute backpropagation gradient vectors by hand",
        "Write custom weights updating SGD optimizers",
        "Understand matrix dot product dimensional alignments"
      ],
      modules: [
        { title: "Module 1: Multivariable Calculus", lessons: ["Partial gradients and Jacobian matrix values", "Chain rules for compound layers", "Gradient descent convergence limits"] }
      ]
    }
  ];

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const activeCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="space-y-6 text-left">
      
      {!selectedCourseId ? (
        <>
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-2xl font-bold font-outfit text-white">Syllabus Classrooms</h2>
              <p className="text-sm text-zinc-400 font-light mt-1">Review, search, and continue your active agentic courses.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Grid / List Toggle */}
              <div className="flex rounded-xl bg-white/5 border border-white/5 p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <Grid size={15} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search syllabi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-950/60"
            >
              <option value="all">All Categories</option>
              <option value="frontend">Frontend Architecture</option>
              <option value="backend">Backend Systems</option>
              <option value="ai">AI & Machine Learning</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl glass-input text-xs bg-slate-950/60"
            >
              <option value="all">All Difficulties</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Courses Listing grid */}
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredCourses.map((course) => (
              <Card 
                key={course.id}
                onClick={() => setSelectedCourseId(course.id)}
                className={`p-6 cursor-pointer flex flex-col justify-between ${viewMode === 'list' ? 'flex-row items-center gap-6' : 'h-64'}`}
                hoverEffect
              >
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span>{course.difficulty}</span>
                    <span>•</span>
                    <span className="text-zinc-400">{course.category}</span>
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug truncate">{course.title}</h3>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed line-clamp-2">{course.description}</p>
                </div>

                <div className={`space-y-3 pt-4 border-t border-white/5 ${viewMode === 'list' ? 'border-t-0 pt-0 w-64' : ''}`}>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1"><Clock size={11} /> {course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} /> {course.lessonsCount} lessons</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-semibold text-zinc-400">
                      <span>Completion</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* Detailed Expanded Course syllabus view */
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedCourseId(null)}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Return to course list
          </button>

          {activeCourse && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Syllabus details (Left side) */}
              <div className="lg:col-span-8 space-y-6">
                <Card className="p-8 space-y-4" hoverEffect={false}>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>{activeCourse.difficulty}</span>
                    <span>•</span>
                    <span>{activeCourse.category}</span>
                  </div>
                  <h3 className="text-3xl font-extrabold font-outfit text-white leading-tight">
                    {activeCourse.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">{activeCourse.description}</p>
                </Card>

                {/* Modules Accordion */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">Modules Syllabus Path</h4>
                  {activeCourse.modules.map((mod, idx) => (
                    <Card key={idx} className="p-5 space-y-3" hoverEffect={false}>
                      <h5 className="font-semibold text-sm text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        {mod.title}
                      </h5>
                      <div className="pl-3.5 space-y-2 border-l border-white/5">
                        {mod.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex justify-between items-center text-xs text-zinc-400 group py-1">
                            <span className="flex items-center gap-2">
                              <Play size={10} className="text-zinc-600 group-hover:text-white transition-colors" />
                              {lesson}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">15m</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar Instructor Profile & Progress (Right side) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Progress detail */}
                <Card className="p-6 space-y-4" hoverEffect={false}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Course Progress</h4>
                  <div className="text-3xl font-extrabold text-white">{activeCourse.progress}%</div>
                  <Progress value={activeCourse.progress} />
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Continue Day {Math.floor(activeCourse.progress / 10) + 1} Lesson
                  </Button>
                </Card>

                {/* Instructor profile */}
                <Card className="p-5 space-y-4" hoverEffect={false}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} /> Instructor Profile
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <User size={16} />
                    </div>
                    <div className="text-left">
                      <h5 className="text-xs font-bold text-white leading-none">{activeCourse.instructor}</h5>
                      <span className="text-[9px] text-zinc-500 font-semibold uppercase mt-1 block">Subject Specialist AI</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-light">
                    Hi! I am your AI guide for this curriculum. Ask me questions, clear up concepts, or ask for code playground debug actions anytime.
                  </p>
                  <Button variant="glass" size="sm" className="w-full text-xs flex items-center justify-center gap-1">
                    <MessageSquare size={12} /> Chat with Instructor
                  </Button>
                </Card>

                {/* Additional assets */}
                <Card className="p-5 space-y-3 text-xs" hoverEffect={false}>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Reference Resources</h4>
                  <div className="space-y-2 text-zinc-400">
                    <div className="flex items-center justify-between hover:text-white cursor-pointer transition-colors">
                      <span className="flex items-center gap-1.5"><Paperclip size={12} /> Tokyo crate docs</span>
                      <Bookmark size={12} className="text-zinc-600" />
                    </div>
                    <div className="flex items-center justify-between hover:text-white cursor-pointer transition-colors">
                      <span className="flex items-center gap-1.5"><Paperclip size={12} /> Concurrency limits cheat-sheet</span>
                      <Bookmark size={12} className="text-zinc-600" />
                    </div>
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
export default CoursesPage;
