-- Tetisol Hub official Supabase schema.
-- Run this in a fresh Supabase project before seeding.

create extension if not exists pgcrypto;

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
  full_name text not null default '',
  email text not null unique,
  role text not null default 'student' check (role in ('student', 'lecturer', 'admin')),
  avatar_url text,
  department text,
  student_number text,
  lecturer_number text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'General',
  level text not null default 'Beginner',
  instructor_id uuid references public.profiles (id) on delete set null,
  thumbnail_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  content text not null default '',
  video_url text,
  lesson_order int not null default 1,
  duration_minutes int not null default 10,
  created_at timestamptz not null default timezone('utc', now()),
  unique (course_id, lesson_order)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  status text not null default 'active',
  enrolled_at timestamptz not null default timezone('utc', now()),
  unique (student_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed boolean not null default false,
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (student_id, lesson_id)
);

create table if not exists public.attendance_records (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  lecturer_id uuid references public.profiles (id) on delete set null,
  session_title text not null,
  attended boolean not null default false,
  attended_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  lecturer_id uuid references public.profiles (id) on delete set null,
  title text not null,
  description text not null default '',
  due_date timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (course_id, title)
);

create table if not exists public.assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  submission_text text not null default '',
  file_url text,
  grade numeric,
  feedback text,
  submitted_at timestamptz not null default timezone('utc', now()),
  unique (assignment_id, student_id)
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  description text not null default '',
  location text not null default '',
  type text not null default 'internship',
  deadline date,
  posted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (title, company, deadline)
);

create table if not exists public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  saved_at timestamptz not null default timezone('utc', now()),
  unique (student_id, opportunity_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  target_role text check (target_role in ('student', 'lecturer', 'admin')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (title, target_role)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  message text not null default '',
  read boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, title)
);

create table if not exists public.cv_profiles (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.profiles (id) on delete cascade,
  summary text not null default '',
  skills text[] not null default '{}',
  education jsonb not null default '[]'::jsonb,
  experience jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_courses_instructor_id on public.courses (instructor_id);
create index if not exists idx_courses_status on public.courses (status);
create index if not exists idx_lessons_course_id on public.lessons (course_id);
create index if not exists idx_enrollments_student_id on public.enrollments (student_id);
create index if not exists idx_enrollments_course_id on public.enrollments (course_id);
create index if not exists idx_lesson_progress_student_id on public.lesson_progress (student_id);
create index if not exists idx_lesson_progress_course_id on public.lesson_progress (course_id);
create index if not exists idx_lesson_progress_lesson_id on public.lesson_progress (lesson_id);
create index if not exists idx_attendance_records_student_id on public.attendance_records (student_id);
create index if not exists idx_attendance_records_course_id on public.attendance_records (course_id);
create index if not exists idx_opportunities_deadline on public.opportunities (deadline);
create index if not exists idx_saved_opportunities_student_id on public.saved_opportunities (student_id);
create index if not exists idx_notifications_user_id on public.notifications (user_id);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

drop trigger if exists cv_profiles_set_updated_at on public.cv_profiles;
create trigger cv_profiles_set_updated_at
before update on public.cv_profiles
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'anonymous');
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

create or replace function public.is_lecturer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() in ('lecturer', 'admin');
$$;

create or replace function public.is_student()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'student';
$$;

create or replace function public.manages_course(course_uuid uuid)
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
      where courses.id = course_uuid
        and courses.instructor_id = auth.uid()
    );
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.attendance_records enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_submissions enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.announcements enable row level security;
alter table public.notifications enable row level security;
alter table public.cv_profiles enable row level security;

drop policy if exists "profiles_select_own_internal_or_enrolled" on public.profiles;
create policy "profiles_select_own_internal_or_enrolled"
on public.profiles for select
using (
  id = auth.uid()
  or public.is_admin()
  or exists (
    select 1
    from public.enrollments
    where enrollments.student_id = profiles.id
      and public.manages_course(enrollments.course_id)
  )
);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check ((id = auth.uid() and role = 'student') or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid() and role = public.current_user_role());

drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin"
on public.profiles for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "courses_select_published_or_managed" on public.courses;
create policy "courses_select_published_or_managed"
on public.courses for select
using (status = 'published' or public.manages_course(id));

drop policy if exists "courses_manage_lecturer_admin" on public.courses;
create policy "courses_manage_lecturer_admin"
on public.courses for all
using (public.manages_course(id))
with check (public.is_admin() or instructor_id = auth.uid());

drop policy if exists "lessons_select_published_or_managed" on public.lessons;
create policy "lessons_select_published_or_managed"
on public.lessons for select
using (
  exists (
    select 1
    from public.courses
    where courses.id = lessons.course_id
      and (courses.status = 'published' or public.manages_course(courses.id))
  )
);

drop policy if exists "lessons_manage_course_lecturer" on public.lessons;
create policy "lessons_manage_course_lecturer"
on public.lessons for all
using (public.manages_course(course_id))
with check (public.manages_course(course_id));

drop policy if exists "enrollments_student_or_course_lecturer_read" on public.enrollments;
create policy "enrollments_student_or_course_lecturer_read"
on public.enrollments for select
using (student_id = auth.uid() or public.manages_course(course_id));

drop policy if exists "enrollments_student_insert" on public.enrollments;
create policy "enrollments_student_insert"
on public.enrollments for insert
with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "enrollments_student_update" on public.enrollments;
create policy "enrollments_student_update"
on public.enrollments for update
using (student_id = auth.uid() or public.is_admin())
with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "lesson_progress_student_or_lecturer_read" on public.lesson_progress;
create policy "lesson_progress_student_or_lecturer_read"
on public.lesson_progress for select
using (student_id = auth.uid() or public.manages_course(course_id));

drop policy if exists "lesson_progress_student_all" on public.lesson_progress;
create policy "lesson_progress_student_all"
on public.lesson_progress for all
using (student_id = auth.uid() or public.is_admin())
with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "attendance_student_or_course_lecturer_read" on public.attendance_records;
create policy "attendance_student_or_course_lecturer_read"
on public.attendance_records for select
using (student_id = auth.uid() or lecturer_id = auth.uid() or public.manages_course(course_id));

drop policy if exists "attendance_lecturer_manage" on public.attendance_records;
create policy "attendance_lecturer_manage"
on public.attendance_records for all
using (public.manages_course(course_id))
with check (public.manages_course(course_id));

drop policy if exists "assignments_read_enrolled_or_managed" on public.assignments;
create policy "assignments_read_enrolled_or_managed"
on public.assignments for select
using (
  public.manages_course(course_id)
  or exists (
    select 1 from public.enrollments
    where enrollments.course_id = assignments.course_id
      and enrollments.student_id = auth.uid()
  )
);

drop policy if exists "assignments_manage_course_lecturer" on public.assignments;
create policy "assignments_manage_course_lecturer"
on public.assignments for all
using (public.manages_course(course_id))
with check (public.manages_course(course_id));

drop policy if exists "assignment_submissions_student_or_lecturer_read" on public.assignment_submissions;
create policy "assignment_submissions_student_or_lecturer_read"
on public.assignment_submissions for select
using (
  student_id = auth.uid()
  or exists (
    select 1 from public.assignments
    where assignments.id = assignment_submissions.assignment_id
      and public.manages_course(assignments.course_id)
  )
);

drop policy if exists "assignment_submissions_student_insert_update" on public.assignment_submissions;
create policy "assignment_submissions_student_insert_update"
on public.assignment_submissions for all
using (student_id = auth.uid() or public.is_admin())
with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "opportunities_read_all_authenticated" on public.opportunities;
create policy "opportunities_read_all_authenticated"
on public.opportunities for select
using (auth.uid() is not null);

drop policy if exists "opportunities_manage_admin_lecturer" on public.opportunities;
create policy "opportunities_manage_admin_lecturer"
on public.opportunities for all
using (public.is_lecturer())
with check (public.is_lecturer());

drop policy if exists "saved_opportunities_student_all" on public.saved_opportunities;
create policy "saved_opportunities_student_all"
on public.saved_opportunities for all
using (student_id = auth.uid() or public.is_admin())
with check (student_id = auth.uid() or public.is_admin());

drop policy if exists "announcements_read_targeted" on public.announcements;
create policy "announcements_read_targeted"
on public.announcements for select
using (
  auth.uid() is not null
  and (target_role is null or target_role = public.current_user_role() or public.is_admin())
);

drop policy if exists "announcements_manage_admin_lecturer" on public.announcements;
create policy "announcements_manage_admin_lecturer"
on public.announcements for all
using (public.is_lecturer())
with check (public.is_lecturer());

drop policy if exists "notifications_user_all" on public.notifications;
create policy "notifications_user_all"
on public.notifications for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "cv_profiles_student_all" on public.cv_profiles;
create policy "cv_profiles_student_all"
on public.cv_profiles for all
using (student_id = auth.uid() or public.is_admin())
with check (student_id = auth.uid() or public.is_admin());

create or replace view public.admin_platform_summary as
select
  (select count(*) from public.profiles where role = 'student') as student_count,
  (select count(*) from public.profiles where role = 'lecturer') as lecturer_count,
  (select count(*) from public.profiles where role = 'admin') as admin_count,
  (select count(*) from public.courses where status = 'published') as published_course_count,
  (select count(*) from public.enrollments) as enrollment_count,
  (select count(*) from public.lesson_progress where completed = true) as completed_lesson_count,
  (select count(*) from public.opportunities) as opportunity_count,
  (select count(*) from public.assignment_submissions) as assignment_submission_count;
