-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Profile Table (synced from auth/Firebase via client creation)
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    firebase_uid text unique not null,
    email text unique not null,
    display_name text,
    photo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Learning Sessions Table
create table if not exists public.learning_sessions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    prompt text not null,
    topic text not null,
    difficulty_level text not null, -- Beginner, Intermediate, Advanced
    duration_days integer not null,
    language text default 'English' not null,
    status text default 'pending' not null, -- pending, processing, completed, failed
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Agent Execution Log Table (for the frontend execution timeline)
create table if not exists public.agent_executions (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid references public.learning_sessions(id) on delete cascade not null,
    agent_name text not null, -- Research, Curriculum, Teacher, Coding, Quiz, Revision, Aggregator
    status text not null, -- idle, running, completed, failed
    output_summary text,
    started_at timestamp with time zone,
    completed_at timestamp with time zone
);

-- 4. Roadmaps Table
create table if not exists public.roadmaps (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid references public.learning_sessions(id) on delete cascade unique not null,
    title text not null,
    description text,
    duration_days integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Roadmap Days/Chapters Table
create table if not exists public.roadmap_days (
    id uuid primary key default uuid_generate_v4(),
    roadmap_id uuid references public.roadmaps(id) on delete cascade not null,
    day_number integer not null,
    title text not null,
    description text,
    estimated_minutes integer default 60 not null,
    completed boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(roadmap_id, day_number)
);

-- 6. Study Notes Table
create table if not exists public.study_notes (
    id uuid primary key default uuid_generate_v4(),
    day_id uuid references public.roadmap_days(id) on delete cascade unique not null,
    content text not null, -- Markdown note contents
    key_takeaways text[] not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Coding Exercises Table
create table if not exists public.coding_exercises (
    id uuid primary key default uuid_generate_v4(),
    day_id uuid references public.roadmap_days(id) on delete cascade not null,
    title text not null,
    problem_statement text not null,
    initial_code text not null,
    solution_code text not null,
    test_cases jsonb not null, -- Array of input/expected output pairs
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Quizzes Table
create table if not exists public.quizzes (
    id uuid primary key default uuid_generate_v4(),
    day_id uuid references public.roadmap_days(id) on delete cascade not null,
    question text not null,
    options text[] not null, -- Array of 4 options
    correct_option_index integer not null,
    explanation text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Flashcards Table
create table if not exists public.flashcards (
    id uuid primary key default uuid_generate_v4(),
    session_id uuid references public.learning_sessions(id) on delete cascade not null,
    day_id uuid references public.roadmap_days(id) on delete cascade,
    front text not null, -- Question or concept
    back text not null,  -- Answer or explanation
    box_level integer default 1 not null, -- Leitner System Leitner box (1 to 5)
    next_review_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. User Progress Tracker Table
create table if not exists public.user_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    session_id uuid references public.learning_sessions(id) on delete cascade not null,
    day_id uuid references public.roadmap_days(id) on delete cascade not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    quiz_score integer, -- Score out of 100 if quiz completed
    code_solved boolean default false not null,
    unique(user_id, session_id, day_id)
);

-- Create RLS policies for profile tables
alter table public.profiles enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.agent_executions enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_days enable row level security;
alter table public.study_notes enable row level security;
alter table public.coding_exercises enable row level security;
alter table public.quizzes enable row level security;
alter table public.flashcards enable row level security;
alter table public.user_progress enable row level security;

-- Setup basic public read permissions
create policy "Enable select profiles for authenticated users" on public.profiles for select using (true);
create policy "Enable insert profiles for auth client connection" on public.profiles for insert with check (true);
create policy "Enable all actions for sessions owners" on public.learning_sessions for all using (true);
create policy "Enable read all roadmaps" on public.roadmaps for select using (true);
create policy "Enable read all roadmap days" on public.roadmap_days for select using (true);
create policy "Enable read all study notes" on public.study_notes for select using (true);
create policy "Enable read all coding exercises" on public.coding_exercises for select using (true);
create policy "Enable read all quizzes" on public.quizzes for select using (true);
create policy "Enable all actions for progress trackers" on public.user_progress for all using (true);
create policy "Enable all actions for flashcard decks" on public.flashcards for all using (true);
