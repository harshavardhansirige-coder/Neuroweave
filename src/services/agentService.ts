import axios from 'axios';
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { CompleteSessionData, LearningSession, AgentExecution, RoadmapDay } from '../types';

// Let's create a localStorage key for user-supplied Gemini API Keys
// This lets users run the multi-agent system fully client-side if they don't have a backend!
export const getGeminiApiKey = () => {
  return localStorage.getItem('neuroweave_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const setGeminiApiKey = (key: string) => {
  localStorage.setItem('neuroweave_gemini_api_key', key);
};

// Simulation log generator
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface OrchestrationLog {
  agentName: string;
  status: 'running' | 'completed' | 'failed';
  message: string;
  timestamp: string;
}

export class AgentOrchestrator {
  private sessionId: string;
  private onLogCallback?: (logs: OrchestrationLog[]) => void;
  private logs: OrchestrationLog[] = [];

  constructor(sessionId: string, onLog?: (logs: OrchestrationLog[]) => void) {
    this.sessionId = sessionId;
    this.onLogCallback = onLog;
  }

  private addLog(agentName: string, status: 'running' | 'completed' | 'failed', message: string) {
    const logEntry: OrchestrationLog = {
      agentName,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    this.logs = [...this.logs, logEntry];
    if (this.onLogCallback) {
      this.onLogCallback(this.logs);
    }
  }

  // Trigger orchestration
  public async orchestrate(
    prompt: string,
    level: string,
    duration: number,
    language: string
  ): Promise<CompleteSessionData> {
    
    // 1. If backend Supabase functions are ready and configured, make the real API request
    if (isSupabaseConfigured) {
      try {
        this.addLog('Master Orchestrator', 'running', 'Contacting Supabase backend orchestrator...');
        const { data: { session } } = await supabase.auth.getSession();
        const jwtToken = session?.access_token;

        const response = await axios.post(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-learning`,
          { prompt, level, duration, language, sessionId: this.sessionId },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            }
          }
        );

        this.addLog('Aggregator', 'completed', 'Backend generation finished successfully!');
        return response.data;
      } catch (err: any) {
        console.error('Supabase function call failed, falling back to local orchestrator:', err);
        this.addLog('Master Orchestrator', 'running', 'Supabase backend failed. Falling back to client-side orchestrator...');
      }
    }

    // 2. Client-side Local Execution (Simulation or Direct Gemini calls)
    return this.runLocalOrchestration(prompt, level, duration, language);
  }

  private async runLocalOrchestration(
    prompt: string,
    level: string,
    duration: number,
    language: string
  ): Promise<CompleteSessionData> {
    const apiKey = getGeminiApiKey();
    const useDirectGemini = !!apiKey;

    this.addLog('Prompt Analyzer', 'running', `Analyzing learning intent: "${prompt}"...`);
    await sleep(2000);
    this.addLog('Prompt Analyzer', 'completed', `Topic: "${prompt}", Level: ${level}, Duration: ${duration} days.`);

    // --- AGENT 1: RESEARCH AGENT ---
    this.addLog('Research Agent', 'running', 'Analyzing topic taxonomy, framework dependencies, and conceptual nodes...');
    await sleep(2500);
    
    let topics: string[] = [];
    if (useDirectGemini) {
      try {
        topics = await this.callGeminiResearch(apiKey, prompt, level);
        this.addLog('Research Agent', 'completed', `Discovered ${topics.length} core subject domains.`);
      } catch (e) {
        console.error(e);
        topics = this.getFallbackTopics(prompt);
        this.addLog('Research Agent', 'completed', 'Gemini research failed. Using heuristic taxonomy node extraction.');
      }
    } else {
      topics = this.getFallbackTopics(prompt);
      this.addLog('Research Agent', 'completed', 'Extracted key nodes: ' + topics.slice(0, 4).join(', ') + '...');
    }

    // --- AGENT 2: CURRICULUM AGENT ---
    this.addLog('Curriculum Agent', 'running', 'Structuring day-by-day learning milestones and micro-syllabus...');
    await sleep(2500);
    const dayModules = this.generateDayModules(topics, duration);
    this.addLog('Curriculum Agent', 'completed', `Created ${dayModules.length} comprehensive lesson schedules.`);

    // --- AGENT 3: TEACHER AGENT ---
    this.addLog('Teacher Agent', 'running', 'Drafting educational summaries, core principles, and coding examples...');
    await sleep(3000);
    const notes: Record<string, any> = {};
    dayModules.forEach((day, index) => {
      notes[day.id] = {
        id: `note-${day.id}`,
        day_id: day.id,
        content: this.getGeneratedNotes(day.title, index + 1, level),
        key_takeaways: [
          `Mastered the core architecture of ${day.title}`,
          `Implemented key practical paradigms of ${day.title}`,
          `Analyzed best practices and anti-patterns`
        ],
        created_at: new Date().toISOString()
      };
    });
    this.addLog('Teacher Agent', 'completed', 'Compiled markdown lectures and architectural case-studies.');

    // --- AGENT 4: CODING AGENT ---
    this.addLog('Coding Agent', 'running', 'Scaffolding programming challenges, test cases, and code templates...');
    await sleep(2500);
    const codingExercises: Record<string, any[]> = {};
    dayModules.forEach((day, idx) => {
      // Create programming challenges for coding days (let's say all, or alternate)
      codingExercises[day.id] = [
        {
          id: `code-${day.id}`,
          day_id: day.id,
          title: `Hands-on: Implement ${day.title}`,
          problem_statement: `Write a robust program demonstrating ${day.title}. Follow the instructions in the comments.\n\n### Requirements:\n1. Solve the challenge returning the expected result.\n2. Do not modify the function parameters.`,
          initial_code: this.getInitialCode(day.title),
          solution_code: this.getSolutionCode(day.title),
          test_cases: [
            { input: 'test1', expected: 'success' }
          ],
          created_at: new Date().toISOString()
        }
      ];
    });
    this.addLog('Coding Agent', 'completed', 'Synthesized unit tests and workspace files.');

    // --- AGENT 5: QUIZ AGENT ---
    this.addLog('Quiz Agent', 'running', 'Formulating cognitive MCQs and contextual explanations...');
    await sleep(2500);
    const quizzes: Record<string, any[]> = {};
    dayModules.forEach((day) => {
      quizzes[day.id] = this.getGeneratedQuizzes(day.id, day.title);
    });
    this.addLog('Quiz Agent', 'completed', 'Generated conceptual multi-choice assessments.');

    // --- AGENT 6: REVISION AGENT ---
    this.addLog('Revision Agent', 'running', 'Scaffolding spaced-repetition Leitner flashcards...');
    await sleep(2000);
    const flashcards: any[] = [];
    dayModules.forEach((day) => {
      const cards = this.getGeneratedFlashcards(day.id, day.title);
      flashcards.push(...cards);
    });
    this.addLog('Revision Agent', 'completed', 'Created flashcard decks with smart intervals.');

    // --- AGENT 7: AGGREGATOR ---
    this.addLog('Aggregator', 'running', 'Consolidating multi-agent deliverables into client response payload...');
    await sleep(2000);

    const mockSession: LearningSession = {
      id: this.sessionId,
      user_id: 'guest',
      prompt: prompt,
      topic: prompt.replace(/learn/i, '').trim(),
      difficulty_level: level as any,
      duration_days: duration,
      language: language,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    const mockRoadmap = {
      id: `roadmap-${this.sessionId}`,
      session_id: this.sessionId,
      title: `Masterclass: ${mockSession.topic}`,
      description: `Structured curriculum focused on "${prompt}" customized for ${level} level.`,
      duration_days: duration,
      created_at: new Date().toISOString()
    };

    const finalPayload: CompleteSessionData = {
      session: mockSession,
      roadmap: mockRoadmap,
      days: dayModules,
      notes,
      codingExercises,
      quizzes,
      flashcards,
      progress: []
    };

    // Save locally
    const existingSessions = JSON.parse(localStorage.getItem('neuroweave_local_sessions') || '[]');
    existingSessions.push(finalPayload);
    localStorage.setItem('neuroweave_local_sessions', JSON.stringify(existingSessions));

    this.addLog('Aggregator', 'completed', 'Learning workspace deployed successfully!');
    return finalPayload;
  }

  // Gemini Direct API Integration
  private async callGeminiResearch(apiKey: string, prompt: string, level: string): Promise<string[]> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const instruction = `Identify 10 core logical topics required to master: "${prompt}" at a ${level} level. Return ONLY a JSON list of strings representing the topic titles. Do not wrap in markdown or backticks.`;

    const res = await axios.post(url, {
      contents: [{ parts: [{ text: instruction }] }]
    });

    const text = res.data.candidates[0].content.parts[0].text;
    try {
      // clean backticks if model generated them
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return this.getFallbackTopics(prompt);
    }
  }

  // Fallbacks Heuristics
  private getFallbackTopics(prompt: string): string[] {
    const cleanPrompt = prompt.toLowerCase();
    if (cleanPrompt.includes('react')) {
      return [
        'React Architecture & Virtual DOM',
        'JSX Syntax and Styling Paradigms',
        'Components, Props and Composition',
        'State Management: useState & useReducer',
        'Component Lifecycle and useEffect Hook',
        'Advanced Hooks: useRef, useMemo, useCallback',
        'Context API & Global State Design',
        'React Router & Dynamic Page Navigation',
        'Data Fetching with Axios & Query Hooks',
        'React Testing, Performance Tuning & Deployment'
      ];
    }
    if (cleanPrompt.includes('python')) {
      return [
        'Python Syntax, Variables & Basic Operations',
        'Control Structures: Loops & Conditional Logic',
        'Data Collections: Lists, Tuples, Dictionaries, Sets',
        'Functional Programming: Parameters, Return Values & Scope',
        'File Handling & Exception Control',
        'Object-Oriented Programming (OOP) in Python',
        'Modules, Packages, and virtualenv Setup',
        'Regular Expressions & Text Operations',
        'API Operations & JSON Parsers',
        'Algorithms, Testing, and PEP 8 Guidelines'
      ];
    }
    // General topics
    return [
      'Foundations & Core Terminology',
      'Structural Setup & Key Frameworks',
      'Basic Operations & Syntactical Paradigms',
      'Intermediate Mechanics & Subsystem Execution',
      'Data Manipulation & Storage Strategies',
      'Best Practices, Security & Common Vulnerabilities',
      'Advanced Refactoring & Optimization Techniques',
      'Integration Pipelines & Dynamic Interactivity',
      'Unit Testing, Validation & Error Handling',
      'Production Deployment & Systems Monitoring'
    ];
  }

  private generateDayModules(topics: string[], duration: number): RoadmapDay[] {
    const days: RoadmapDay[] = [];
    
    for (let i = 1; i <= duration; i++) {
      const topicIndex = Math.min(Math.floor(((i - 1) / duration) * topics.length), topics.length - 1);
      const topic = topics[topicIndex];
      
      days.push({
        id: `day-${this.sessionId}-${i}`,
        roadmap_id: `roadmap-${this.sessionId}`,
        day_number: i,
        title: `Day ${i}: ${topic}`,
        description: `Deep dive into key concepts, examples, hands-on labs, and quizzes on ${topic.toLowerCase()}.`,
        estimated_minutes: 45 + Math.floor(Math.random() * 30),
        completed: false,
        created_at: new Date().toISOString()
      });
    }

    return days;
  }

  private getInitialCode(topic: string): string {
    const clean = topic.toLowerCase();
    if (clean.includes('react') || clean.includes('dom') || clean.includes('jsx')) {
      return `import React, { useState } from 'react';\n\n// Challenge: Create a Counter component that increments, decrements, and resets\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="p-6 text-center">\n      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>\n      {/* Write your interactive buttons below with onClick handlers */}\n      <div className="flex gap-4 justify-center">\n        {/* Increment */}\n        {/* Decrement */}\n        {/* Reset */}\n      </div>\n    </div>\n  );\n}`;
    }
    if (clean.includes('python')) {
      return `def solve_challenge(val):\n    # Challenge: Write a function that returns true if the input is a palindrome, false otherwise.\n    # Your code here\n    pass`;
    }
    return `// Challenge: Implement a solution for ${topic}\nfunction execute(input) {\n  // Write logic here\n  return input;\n}\n\nconsole.log(execute("success"));`;
  }

  private getSolutionCode(topic: string): string {
    const clean = topic.toLowerCase();
    if (clean.includes('react') || clean.includes('dom') || clean.includes('jsx')) {
      return `import React, { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="p-6 text-center">\n      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>\n      <div className="flex gap-4 justify-center">\n        <button onClick={() => setCount(count + 1)} className="px-4 py-2 bg-primary rounded">Increment</button>\n        <button onClick={() => setCount(count - 1)} className="px-4 py-2 bg-zinc-700 rounded">Decrement</button>\n        <button onClick={() => setCount(0)} className="px-4 py-2 bg-red-600 rounded">Reset</button>\n      </div>\n    </div>\n  );\n}`;
    }
    return `function execute(input) {\n  return "success";\n}`;
  }

  private getGeneratedNotes(topic: string, day: number, level: string): string {
    return `# ${topic}\n\nWelcome to Day ${day} of your personalized ${level} program. Today we cover key theoretical principles, design paradigms, and real-world implementations.\n\n## 1. Core Architectural Concepts\n- **Principle A**: High cohesion, low coupling. Understanding how this fits into current patterns.\n- **Principle B**: Data flow unidirectional binding. Essential for maintaining clean system states.\n- **Principle C**: Abstract syntax trees (ASTs) and processing compilers.\n\n### Detailed Breakdown\n\`\`\`javascript\n// Typical implementation snippet:\nconst initConfig = {\n  debug: true,\n  env: 'development',\n  orchestrationRate: 'realtime'\n};\n\nfunction initializeWorker(name) {\n  console.log(\`Initializing \${name} engine...\`);\n  return { ...initConfig, status: 'operational' };\n}\n\nconst agentNode = initializeWorker("MasterAgent");\n\`\`\`\n\n## 2. Best Practices\n1. **Always keep state local** unless share state is explicitly required.\n2. **Clean up listeners** in side effects to prevent severe memory leaks.\n3. **Handle errors gracefully** utilizing error boundary fallback UI screens.\n\n## 3. Real-world Scenarios\nWhen deploying this at scale, ensure your servers implement horizontal auto-scaling combined with Redis connection pooling to optimize cache lookups.`;
  }

  private getGeneratedQuizzes(dayId: string, topic: string): any[] {
    return [
      {
        id: `q1-${dayId}`,
        day_id: dayId,
        question: `What is the primary architectural goal of ${topic}?`,
        options: [
          'Maximizing global state storage parameters',
          'Enforcing decoupled components, local encapsulation and clean data binding',
          'Eliminating CSS compilation overhead completely',
          'Enabling serverless database schema execution directly on raw client clients'
        ],
        correct_option_index: 1,
        explanation: 'Enforcing modular decoupling, localized encapsulation, and structured interfaces ensures systems remain testable, highly maintainable, and scalable.',
        created_at: new Date().toISOString()
      },
      {
        id: `q2-${dayId}`,
        question: `Which of the following describes a key anti-pattern in ${topic}?`,
        options: [
          'Utilizing dependency injection patterns',
          'Deep component nesting without abstraction, and mutating state props directly',
          'Enforcing strict TypeScript type validation properties',
          'Configuring CORS policies restrictively on API gateways'
        ],
        correct_option_index: 1,
        explanation: 'Mutating props directly violates the immutability design principle, leading to side-effects that are difficult to trace and fix.',
        created_at: new Date().toISOString()
      }
    ];
  }

  private getGeneratedFlashcards(dayId: string, topic: string): any[] {
    return [
      {
        id: `fc1-${dayId}`,
        day_id: dayId,
        front: `What does 'Immutability' mean in the context of ${topic}?`,
        back: `Immutability means that once data/state is created, it cannot be changed directly. Instead, new copies are created, ensuring predictable data flows and easy undo/redo support.`,
        box_level: 1,
        next_review_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      },
      {
        id: `fc2-${dayId}`,
        day_id: dayId,
        front: `What is a primary side effect of not cleaning up timers in ${topic}?`,
        back: `Failing to clear timers (like setInterval) when components unmount causes severe Memory Leaks, since the callback references still reside in heap memory.`,
        box_level: 1,
        next_review_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }
    ];
  }
}
