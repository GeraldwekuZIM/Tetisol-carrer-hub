-- Supervisor readiness migration for the 50-student Tetisol Hub test.
-- Run after supabase/schema.sql.

create extension if not exists pgcrypto;

alter table public.profiles
  add column if not exists role text not null default 'student'
    check (role in ('student', 'instructor', 'admin')),
  add column if not exists email text,
  add column if not exists last_seen_at timestamptz;

alter table public.courses
  add column if not exists instructor_id uuid references public.profiles (id) on delete set null,
  add column if not exists status text not null default 'Published'
    check (status in ('Draft', 'Published', 'Archived')),
  add column if not exists max_enrollments integer;

alter table public.course_enrollments
  add column if not exists last_activity_at timestamptz not null default timezone('utc', now());

create table if not exists public.participation_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid references public.course_lessons (id) on delete set null,
  participation_type text not null default 'lesson_view'
    check (participation_type in ('login', 'course_view', 'lesson_view', 'quiz_attempt', 'progress_update', 'attendance')),
  participated_at timestamptz not null default timezone('utc', now()),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid references public.course_lessons (id) on delete set null,
  title text not null,
  description text not null default '',
  due_at timestamptz,
  max_score integer not null default 100,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  content text not null default '',
  attachment_url text,
  score integer,
  feedback text not null default '',
  submitted_at timestamptz not null default timezone('utc', now()),
  graded_at timestamptz,
  graded_by uuid references public.profiles (id) on delete set null,
  unique (assignment_id, user_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses (id) on delete cascade,
  title text not null,
  body text not null,
  audience text not null default 'all'
    check (audience in ('all', 'students', 'instructors', 'admins')),
  created_by uuid references public.profiles (id) on delete set null,
  published_at timestamptz not null default timezone('utc', now()),
  expires_at timestamptz
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null default '',
  href text not null default '/',
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_courses_instructor on public.courses (instructor_id);
create index if not exists idx_courses_status on public.courses (status);
create index if not exists idx_course_enrollments_student_id on public.course_enrollments (user_id);
create index if not exists idx_course_enrollments_course_id on public.course_enrollments (course_id);
create index if not exists idx_lesson_progress_student_lesson
  on public.lesson_progress (lesson_id, enrollment_id);
create index if not exists idx_lesson_progress_completed_at on public.lesson_progress (completed_at);
create index if not exists idx_participation_user on public.participation_records (user_id, participated_at desc);
create index if not exists idx_participation_course on public.participation_records (course_id, participated_at desc);
create index if not exists idx_assignments_course on public.assignments (course_id, due_at);
create index if not exists idx_assignment_submissions_user on public.assignment_submissions (user_id);
create index if not exists idx_assignment_submissions_assignment on public.assignment_submissions (assignment_id);
create index if not exists idx_notifications_user on public.notifications (user_id, read_at, created_at desc);

drop trigger if exists set_assignments_updated_at on public.assignments;
create trigger set_assignments_updated_at
before update on public.assignments
for each row execute function public.set_updated_at();

create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role from public.profiles where id = auth.uid()),
    'anonymous'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_profile_role() = 'admin';
$$;

create or replace function public.is_instructor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_profile_role() in ('instructor', 'admin');
$$;

create or replace function public.manages_course(target_course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.courses
      where courses.id = target_course_id
        and courses.instructor_id = auth.uid()
    )
    or exists (
      select 1
      from public.course_collaborators
      where course_collaborators.course_id = target_course_id
        and lower(course_collaborators.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        and course_collaborators.can_edit_content = true
    );
$$;

alter table public.participation_records enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.announcements enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_internal" on public.profiles;
create policy "profiles_select_internal"
on public.profiles for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.course_enrollments
    join public.courses on courses.id = course_enrollments.course_id
    where course_enrollments.user_id = profiles.id
      and public.manages_course(courses.id)
  )
);

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "courses_internal_insert" on public.courses;
create policy "courses_internal_insert"
on public.courses for insert
with check (public.is_admin() or instructor_id = auth.uid());

drop policy if exists "courses_internal_update" on public.courses;
create policy "courses_internal_update"
on public.courses for update
using (public.manages_course(id))
with check (public.manages_course(id));

drop policy if exists "course_collaborators_manage" on public.course_collaborators;
create policy "course_collaborators_manage"
on public.course_collaborators for all
using (public.manages_course(course_id))
with check (public.manages_course(course_id));

drop policy if exists "course_modules_manage" on public.course_modules;
create policy "course_modules_manage"
on public.course_modules for all
using (public.manages_course(course_id))
with check (public.manages_course(course_id));

drop policy if exists "course_lessons_manage" on public.course_lessons;
create policy "course_lessons_manage"
on public.course_lessons for all
using (
  exists (
    select 1 from public.course_modules
    where course_modules.id = course_lessons.module_id
      and public.manages_course(course_modules.course_id)
  )
)
with check (
  exists (
    select 1 from public.course_modules
    where course_modules.id = course_lessons.module_id
      and public.manages_course(course_modules.course_id)
  )
);

drop policy if exists "enrollments_internal_read" on public.course_enrollments;
create policy "enrollments_internal_read"
on public.course_enrollments for select
using (public.manages_course(course_id));

drop policy if exists "lesson_progress_internal_read" on public.lesson_progress;
create policy "lesson_progress_internal_read"
on public.lesson_progress for select
using (
  exists (
    select 1
    from public.course_enrollments
    where course_enrollments.id = lesson_progress.enrollment_id
      and public.manages_course(course_enrollments.course_id)
  )
);

drop policy if exists "participation_own_insert" on public.participation_records;
create policy "participation_own_insert"
on public.participation_records for insert
with check (auth.uid() = user_id);

drop policy if exists "participation_own_or_internal_read" on public.participation_records;
create policy "participation_own_or_internal_read"
on public.participation_records for select
using (auth.uid() = user_id or public.manages_course(course_id));

drop policy if exists "assignments_read_enrolled" on public.assignments;
create policy "assignments_read_enrolled"
on public.assignments for select
using (
  public.manages_course(course_id)
  or exists (
    select 1
    from public.course_enrollments
    where course_enrollments.course_id = assignments.course_id
      and course_enrollments.user_id = auth.uid()
  )
);

drop policy if exists "assignments_manage_internal" on public.assignments;
create policy "assignments_manage_internal"
on public.assignments for all
using (public.manages_course(course_id))
with check (public.manages_course(course_id));

drop policy if exists "assignment_submissions_own_or_internal_read" on public.assignment_submissions;
create policy "assignment_submissions_own_or_internal_read"
on public.assignment_submissions for select
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.assignments
    where assignments.id = assignment_submissions.assignment_id
      and public.manages_course(assignments.course_id)
  )
);

drop policy if exists "assignment_submissions_own_insert_update" on public.assignment_submissions;
create policy "assignment_submissions_own_insert_update"
on public.assignment_submissions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "announcements_read_relevant" on public.announcements;
create policy "announcements_read_relevant"
on public.announcements for select
using (
  course_id is null
  or public.manages_course(course_id)
  or exists (
    select 1
    from public.course_enrollments
    where course_enrollments.course_id = announcements.course_id
      and course_enrollments.user_id = auth.uid()
  )
);

drop policy if exists "announcements_manage_internal" on public.announcements;
create policy "announcements_manage_internal"
on public.announcements for all
using (course_id is null and public.is_admin() or public.manages_course(course_id))
with check (course_id is null and public.is_admin() or public.manages_course(course_id));

drop policy if exists "notifications_own_all" on public.notifications;
create policy "notifications_own_all"
on public.notifications for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace view public.platform_activity_summary as
select
  (select count(*) from public.profiles where role = 'student') as student_count,
  (select count(*) from public.profiles where role = 'instructor') as instructor_count,
  (select count(*) from public.profiles where role = 'admin') as admin_count,
  (select count(*) from public.courses where status = 'Published') as published_course_count,
  (select count(*) from public.course_enrollments) as enrollment_count,
  (select count(*) from public.lesson_progress where completed_at is not null) as completed_lesson_count,
  (select count(*) from public.participation_records where participated_at > now() - interval '7 days') as weekly_participation_count,
  (select count(*) from public.internships) as opportunity_count;
