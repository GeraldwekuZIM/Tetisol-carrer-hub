create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum (
      'Interested',
      'Applied',
      'Interview',
      'Offer',
      'Rejected'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'internship_mode') then
    create type public.internship_mode as enum ('Remote', 'Hybrid', 'Onsite');
  end if;

  if not exists (select 1 from pg_type where typname = 'course_level') then
    create type public.course_level as enum ('Beginner', 'Intermediate', 'Advanced');
  end if;

  if not exists (select 1 from pg_type where typname = 'lesson_type') then
    create type public.lesson_type as enum ('Text', 'Video', 'Resource', 'Quiz');
  end if;

  if not exists (select 1 from pg_type where typname = 'reminder_kind') then
    create type public.reminder_kind as enum (
      'Learning',
      'Quiz',
      'Application',
      'Deadline',
      'Certificate'
    );
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text default '',
  school text default '',
  degree text default '',
  location text default '',
  bio text default '',
  skills text[] default '{}',
  interests text[] default '{}',
  preferred_roles text[] default '{}',
  availability text default '',
  preferred_internship_fields text[] default '{}',
  learning_focus text[] default '{}',
  career_goals text[] default '{}',
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  preferred_locations text[] default '{}',
  preferred_internship_fields text[] default '{}',
  preferred_learning_categories text[] default '{}',
  weekly_learning_goal_hours integer not null default 4,
  internship_priority text not null default 'Balanced',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  level public.course_level not null default 'Beginner',
  duration_text text not null default '',
  duration_hours integer not null default 1,
  short_description text not null default '',
  description text not null default '',
  instructor_name text not null default 'Tetisol Team',
  instructor_role text not null default '',
  instructor_company text not null default 'Tetisol',
  instructor_bio text not null default '',
  skills text[] default '{}',
  outcomes text[] default '{}',
  prerequisites text[] default '{}',
  certificate_available boolean not null default true,
  featured boolean not null default false,
  popular boolean not null default false,
  is_new boolean not null default false,
  hero_gradient text not null default 'from-indigo-600 via-indigo-500 to-sky-400',
  internship_focus text[] default '{}',
  updated_at date not null default current_date,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.course_collaborators (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  name text not null default '',
  email text not null,
  role text not null default 'Lecturer',
  can_edit_content boolean not null default true,
  can_manage_assessments boolean not null default false,
  can_publish boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (course_id, email)
);

create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  position integer not null,
  title text not null,
  summary text not null default '',
  estimated_time text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  unique (course_id, position)
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules (id) on delete cascade,
  position integer not null,
  slug text not null,
  title text not null,
  type public.lesson_type not null default 'Text',
  duration text not null default '',
  objective text not null default '',
  summary text not null default '',
  content jsonb not null default '[]'::jsonb,
  resources jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (module_id, position)
);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  enrolled_at timestamptz not null default timezone('utc', now()),
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  last_lesson_id uuid references public.course_lessons (id) on delete set null,
  unique (user_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.course_enrollments (id) on delete cascade,
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  note text not null default '',
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (enrollment_id, lesson_id)
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  module_id uuid not null references public.course_modules (id) on delete cascade,
  lesson_id uuid not null unique references public.course_lessons (id) on delete cascade,
  title text not null,
  description text not null default '',
  passing_score integer not null default 70
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  position integer not null,
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  explanation text not null default '',
  unique (quiz_id, position)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  quiz_id uuid not null references public.quizzes (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid not null references public.course_lessons (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  score integer not null default 0,
  passed boolean not null default false,
  submitted_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  issued_at date not null default current_date,
  certificate_number text not null unique,
  share_url text,
  download_url text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, course_id)
);

create table if not exists public.internships (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  company text not null,
  location text not null,
  mode public.internship_mode not null,
  category text not null,
  level public.course_level not null default 'Beginner',
  stipend text not null default '',
  duration text not null default '',
  deadline date,
  posted_at date not null default current_date,
  description text not null default '',
  skills text[] default '{}',
  interests text[] default '{}',
  responsibilities text[] default '{}',
  requirements text[] default '{}'
);

create table if not exists public.saved_internships (
  user_id uuid not null references public.profiles (id) on delete cascade,
  internship_id uuid not null references public.internships (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, internship_id)
);

create table if not exists public.tracked_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  internship_id uuid not null references public.internships (id) on delete cascade,
  status public.application_status not null default 'Interested',
  notes text not null default '',
  deadline date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cvs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  headline text not null default '',
  summary text not null default '',
  education text not null default '',
  skills text[] default '{}',
  experience jsonb not null default '[]'::jsonb,
  score integer not null default 0,
  suggestions text[] default '{}',
  last_updated timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.cv_sections (
  id uuid primary key default gen_random_uuid(),
  cv_id uuid not null references public.cvs (id) on delete cascade,
  section_type text not null,
  position integer not null default 1,
  title text not null default '',
  content jsonb not null default '{}'::jsonb
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.reminder_kind not null default 'Learning',
  title text not null,
  description text not null default '',
  due_at date not null,
  href text not null default '/',
  completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_courses_category on public.courses (category);
create index if not exists idx_courses_featured on public.courses (featured, popular, is_new);
create index if not exists idx_course_collaborators_course on public.course_collaborators (course_id);
create index if not exists idx_course_collaborators_email on public.course_collaborators (email);
create index if not exists idx_course_modules_course on public.course_modules (course_id, position);
create index if not exists idx_course_lessons_module on public.course_lessons (module_id, position);
create index if not exists idx_course_enrollments_user on public.course_enrollments (user_id, course_id);
create index if not exists idx_lesson_progress_enrollment on public.lesson_progress (enrollment_id);
create index if not exists idx_quiz_attempts_user on public.quiz_attempts (user_id, submitted_at desc);
create index if not exists idx_certificates_user on public.certificates (user_id, issued_at desc);
create index if not exists idx_internships_category on public.internships (category, deadline);
create index if not exists idx_saved_internships_user on public.saved_internships (user_id);
create index if not exists idx_tracked_applications_user on public.tracked_applications (user_id, status);
create index if not exists idx_reminders_user on public.reminders (user_id, due_at);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_preferences_updated_at on public.user_preferences;
create trigger set_preferences_updated_at
before update on public.user_preferences
for each row execute function public.set_updated_at();

drop trigger if exists set_tracked_applications_updated_at on public.tracked_applications;
create trigger set_tracked_applications_updated_at
before update on public.tracked_applications
for each row execute function public.set_updated_at();

drop trigger if exists set_cvs_updated_at on public.cvs;
create trigger set_cvs_updated_at
before update on public.cvs
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.courses enable row level security;
alter table public.course_collaborators enable row level security;
alter table public.course_modules enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.internships enable row level security;
alter table public.saved_internships enable row level security;
alter table public.tracked_applications enable row level security;
alter table public.cvs enable row level security;
alter table public.cv_sections enable row level security;
alter table public.reminders enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "preferences_select_own" on public.user_preferences;
create policy "preferences_select_own"
on public.user_preferences for select
using (auth.uid() = user_id);

drop policy if exists "preferences_insert_own" on public.user_preferences;
create policy "preferences_insert_own"
on public.user_preferences for insert
with check (auth.uid() = user_id);

drop policy if exists "preferences_update_own" on public.user_preferences;
create policy "preferences_update_own"
on public.user_preferences for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "courses_read_all" on public.courses;
create policy "courses_read_all"
on public.courses for select
using (true);

drop policy if exists "course_collaborators_read_all" on public.course_collaborators;
create policy "course_collaborators_read_all"
on public.course_collaborators for select
using (true);

drop policy if exists "course_modules_read_all" on public.course_modules;
create policy "course_modules_read_all"
on public.course_modules for select
using (true);

drop policy if exists "course_lessons_read_all" on public.course_lessons;
create policy "course_lessons_read_all"
on public.course_lessons for select
using (true);

drop policy if exists "quizzes_read_all" on public.quizzes;
create policy "quizzes_read_all"
on public.quizzes for select
using (true);

drop policy if exists "quiz_questions_read_all" on public.quiz_questions;
create policy "quiz_questions_read_all"
on public.quiz_questions for select
using (true);

drop policy if exists "internships_read_all" on public.internships;
create policy "internships_read_all"
on public.internships for select
using (true);

drop policy if exists "course_enrollments_own_all" on public.course_enrollments;
create policy "course_enrollments_own_all"
on public.course_enrollments for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "lesson_progress_own_all" on public.lesson_progress;
create policy "lesson_progress_own_all"
on public.lesson_progress for all
using (
  exists (
    select 1
    from public.course_enrollments
    where public.course_enrollments.id = lesson_progress.enrollment_id
      and public.course_enrollments.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.course_enrollments
    where public.course_enrollments.id = lesson_progress.enrollment_id
      and public.course_enrollments.user_id = auth.uid()
  )
);

drop policy if exists "quiz_attempts_own_all" on public.quiz_attempts;
create policy "quiz_attempts_own_all"
on public.quiz_attempts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "certificates_own_read" on public.certificates;
create policy "certificates_own_read"
on public.certificates for select
using (auth.uid() = user_id);

drop policy if exists "saved_internships_own_all" on public.saved_internships;
create policy "saved_internships_own_all"
on public.saved_internships for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "tracked_applications_own_all" on public.tracked_applications;
create policy "tracked_applications_own_all"
on public.tracked_applications for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "cvs_own_all" on public.cvs;
create policy "cvs_own_all"
on public.cvs for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "cv_sections_own_all" on public.cv_sections;
create policy "cv_sections_own_all"
on public.cv_sections for all
using (
  exists (
    select 1
    from public.cvs
    where public.cvs.id = cv_sections.cv_id
      and public.cvs.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.cvs
    where public.cvs.id = cv_sections.cv_id
      and public.cvs.user_id = auth.uid()
  )
);

drop policy if exists "reminders_own_all" on public.reminders;
create policy "reminders_own_all"
on public.reminders for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values
  ('cv-assets', 'cv-assets', false),
  ('certificate-assets', 'certificate-assets', false)
on conflict (id) do nothing;
