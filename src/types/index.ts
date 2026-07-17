export interface Profile {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  created_at: string;
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LearningSession {
  id: string;
  user_id: string;
  prompt: string;
  topic: string;
  difficulty_level: DifficultyLevel;
  duration_days: number;
  language: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface AgentExecution {
  id: string;
  session_id: string;
  agent_name: 'Research' | 'Curriculum' | 'Teacher' | 'Coding' | 'Quiz' | 'Revision' | 'Aggregator';
  status: 'idle' | 'running' | 'completed' | 'failed';
  output_summary: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface Roadmap {
  id: string;
  session_id: string;
  title: string;
  description: string | null;
  duration_days: number;
  created_at: string;
}

export interface RoadmapDay {
  id: string;
  roadmap_id: string;
  day_number: number;
  title: string;
  description: string | null;
  estimated_minutes: number;
  completed: boolean;
  created_at: string;
}

export interface StudyNote {
  id: string;
  day_id: string;
  content: string; // Markdown content
  key_takeaways: string[];
  created_at: string;
}

export interface TestCase {
  input: string;
  expected: string;
}

export interface CodingExercise {
  id: string;
  day_id: string;
  title: string;
  problem_statement: string;
  initial_code: string;
  solution_code: string;
  test_cases: TestCase[];
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  day_id: string;
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string | null;
  created_at: string;
}

export interface Flashcard {
  id: string;
  session_id: string;
  day_id: string | null;
  front: string;
  back: string;
  box_level: number;
  next_review_at: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  session_id: string;
  day_id: string;
  completed_at: string;
  quiz_score: number | null;
  code_solved: boolean;
}

export interface CompleteSessionData {
  session: LearningSession;
  roadmap: Roadmap;
  days: RoadmapDay[];
  notes: Record<string, StudyNote>; // key: day_id
  codingExercises: Record<string, CodingExercise[]>; // key: day_id
  quizzes: Record<string, QuizQuestion[]>; // key: day_id
  flashcards: Flashcard[];
  progress: UserProgress[];
}
