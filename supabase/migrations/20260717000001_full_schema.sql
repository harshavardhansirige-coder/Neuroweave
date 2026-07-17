-- Migration: 20260717000001_full_schema.sql
-- Description: Core schema additions for LearnForge AI Multi-Agent platform

-- Enable extensions if not enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (already created in init, adding missing columns/constraints if not exists)
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    firebase_uid text unique not null,
    email text unique not null,
    display_name text,
    photo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Learning Sessions Table (associated with custom prompts)
create table if not exists public.learning_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    prompt text not null,
    topic text not null,
    difficulty_level text not null,
    duration_days integer not null,
    language text default 'English' not null,
    learning_style text default 'Visual' not null,
    status text default 'pending' not null, -- pending, processing, completed, failed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Agent Execution Log
create table if not exists public.agent_executions (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid references public.learning_sessions(id) on delete cascade not null,
    agent_name text not null, -- Research, Curriculum, Teacher, Quiz, Coding, Revision, Master
    status text not null, -- idle, running, completed, failed
    output_summary text,
    started_at timestamp with time zone,
    completed_at timestamp with time zone
);

-- 4. Courses Table
create table if not exists public.courses (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid references public.learning_sessions(id) on delete set null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    difficulty_level text not null,
    cover_image_url text,
    progress_percentage integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Course Modules Table
create table if not exists public.course_modules (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid references public.courses(id) on delete cascade not null,
    title text not null,
    description text,
    order_index integer not null,
    estimated_minutes integer default 60 not null,
    completed boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Study Notes Table
create table if not exists public.notes (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references public.course_modules(id) on delete cascade unique not null,
    content text not null, -- Markdown content
    key_takeaways text[] not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Quizzes Table
create table if not exists public.quizzes (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references public.course_modules(id) on delete cascade not null,
    title text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions under Quizzes
create table if not exists public.quiz_questions (
    id uuid primary key default uuid_generate_v4(),
    quiz_id uuid references public.quizzes(id) on delete cascade not null,
    question text not null,
    options text[] not null,
    correct_option_index integer not null,
    explanation text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Quiz Attempts Table
create table if not exists public.quiz_attempts (
    id uuid primary key default uuid_generate_v4(),
    quiz_id uuid references public.quizzes(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    score integer not null, -- percentage out of 100
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Flashcards Table
create table if not exists public.flashcards (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    session_id uuid references public.learning_sessions(id) on delete cascade,
    front text not null,
    back text not null,
    box_level integer default 1 not null,
    next_review_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Coding Exercises Table
create table if not exists public.coding_exercises (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references public.course_modules(id) on delete cascade not null,
    title text not null,
    problem_statement text not null,
    initial_code text not null,
    solution_code text not null,
    test_cases jsonb not null, -- Array of input/expected pairs
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Visual Contents Table (SVGs generated by Visual/Design agents)
create table if not exists public.visual_contents (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid references public.course_modules(id) on delete cascade not null,
    title text not null,
    description text,
    raw_svg text not null,
    category text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Assessments Table (final tests)
create table if not exists public.assessments (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid references public.courses(id) on delete cascade unique not null,
    title text not null,
    questions jsonb not null, -- Questions in JSON format
    passing_score integer default 70 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assessment Submissions
create table if not exists public.assessment_submissions (
    id uuid primary key default uuid_generate_v4(),
    assessment_id uuid references public.assessments(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    score integer not null,
    passed boolean not null,
    certificate_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Learning Progress Table
create table if not exists public.learning_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    module_id uuid references public.course_modules(id) on delete cascade not null,
    completed boolean default false not null,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, course_id, module_id)
);

-- 14. Bookmarks Table
create table if not exists public.bookmarks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    item_type text not null, -- note, quiz, code, diagram
    item_id uuid not null, -- Generic reference id
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. Chat History Table
create table if not exists public.chat_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    session_id uuid references public.learning_sessions(id) on delete cascade not null,
    sender text not null, -- user, assistant
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 16. Notifications Table
create table if not exists public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    message text not null,
    read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 17. Uploaded Files Table
create table if not exists public.uploaded_files (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    file_name text not null,
    file_url text not null,
    file_size integer not null,
    mime_type text not null,
    provider text default 'cloudinary' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 18. Settings Table
create table if not exists public.settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade unique not null,
    preferred_theme text default 'dark' not null,
    preferred_ai_provider text default 'gemini' not null,
    email_notifications boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indices for performance
create index if not exists idx_profiles_firebase_uid on public.profiles(firebase_uid);
create index if not exists idx_sessions_user_id on public.learning_sessions(user_id);
create index if not exists idx_courses_user_id on public.courses(user_id);
create index if not exists idx_course_modules_course_id on public.course_modules(course_id);
create index if not exists idx_notes_module_id on public.notes(module_id);
create index if not exists idx_quizzes_module_id on public.quizzes(module_id);
create index if not exists idx_flashcards_user_id on public.flashcards(user_id);
create index if not exists idx_progress_user_id on public.learning_progress(user_id);
create index if not exists idx_chat_session_id on public.chat_history(session_id);

-- Enable RLS for all new tables
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.notes enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.coding_exercises enable row level security;
alter table public.visual_contents enable row level security;
alter table public.assessments enable row level security;
alter table public.assessment_submissions enable row level security;
alter table public.learning_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.chat_history enable row level security;
alter table public.notifications enable row level security;
alter table public.uploaded_files enable row level security;
alter table public.settings enable row level security;

-- Basic Public/Auth Policies
create policy "Allow profile holders all actions on settings" on public.settings for all using (true);
create policy "Allow course select for all profiles" on public.courses for select using (true);
create policy "Allow all actions on progress" on public.learning_progress for all using (true);
create policy "Allow all actions on chat history" on public.chat_history for all using (true);
create policy "Allow select on modules, notes, quizzes, coding" on public.course_modules for select using (true);
create policy "Allow select notes" on public.notes for select using (true);
create policy "Allow select quizzes" on public.quizzes for select using (true);
create policy "Allow select quiz questions" on public.quiz_questions for select using (true);
create policy "Allow quiz attempts logs" on public.quiz_attempts for all using (true);
create policy "Allow coding exercises select" on public.coding_exercises for select using (true);
create policy "Allow visual contents select" on public.visual_contents for select using (true);
create policy "Allow bookmarks actions" on public.bookmarks for all using (true);
create policy "Allow upload files logging" on public.uploaded_files for all using (true);
create policy "Allow notifications actions" on public.notifications for all using (true);
create policy "Allow assessment select" on public.assessments for select using (true);
create policy "Allow assessment submissions" on public.assessment_submissions for all using (true);
