-- Realistic load-test seed for supervisor review.
-- Run after supabase/schema.sql and supabase/supervisor_readiness_schema.sql.
-- Demo password for all generated auth users: careerhub

create extension if not exists pgcrypto;

create or replace function public.seed_uuid(seed text)
returns uuid
language sql
immutable
as $$
  select (
    substr(md5(seed), 1, 8) || '-' ||
    substr(md5(seed), 9, 4) || '-' ||
    substr(md5(seed), 13, 4) || '-' ||
    substr(md5(seed), 17, 4) || '-' ||
    substr(md5(seed), 21, 12)
  )::uuid;
$$;

with seed_users as (
  select
    public.seed_uuid('student-' || index) as id,
    'student' || lpad(index::text, 2, '0') || '@tetisol.test' as email,
    'Tetisol Student ' || lpad(index::text, 2, '0') as name,
    'student' as role
  from generate_series(1, 50) as index
  union all
  select
    public.seed_uuid('lecturer-' || index),
    'lecturer' || index || '@tetisol.test',
    'Tetisol Lecturer ' || index,
    'instructor'
  from generate_series(1, 5) as index
  union all
  select
    public.seed_uuid('admin-' || index),
    'admin' || index || '@tetisol.test',
    'Tetisol Admin ' || index,
    'admin'
  from generate_series(1, 3) as index
)
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
select
  id,
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  email,
  crypt('careerhub', gen_salt('bf')),
  timezone('utc', now()),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('full_name', name, 'role', role),
  timezone('utc', now()),
  timezone('utc', now())
from seed_users
on conflict (id) do update
set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = timezone('utc', now());

with seed_users as (
  select
    public.seed_uuid('student-' || index) as id,
    'student' || lpad(index::text, 2, '0') || '@tetisol.test' as email,
    'Tetisol Student ' || lpad(index::text, 2, '0') as name,
    'student' as role,
    index
  from generate_series(1, 50) as index
  union all
  select
    public.seed_uuid('lecturer-' || index),
    'lecturer' || index || '@tetisol.test',
    'Tetisol Lecturer ' || index,
    'instructor',
    index
  from generate_series(1, 5) as index
  union all
  select
    public.seed_uuid('admin-' || index),
    'admin' || index || '@tetisol.test',
    'Tetisol Admin ' || index,
    'admin',
    index
  from generate_series(1, 3) as index
)
insert into public.profiles (
  id,
  email,
  role,
  name,
  school,
  degree,
  location,
  bio,
  skills,
  interests,
  preferred_roles,
  availability,
  preferred_internship_fields,
  learning_focus,
  career_goals,
  onboarding_completed,
  last_seen_at
)
select
  id,
  email,
  role,
  name,
  case when role = 'student' then 'Tetisol Partner College' else 'Tetisol Hub' end,
  case when role = 'student' then 'Diploma in Applied Technology' else 'Instructor Team' end,
  case
    when index % 3 = 0 then 'Bulawayo, Zimbabwe'
    when index % 3 = 1 then 'Harare, Zimbabwe'
    else 'Remote'
  end,
  'Seed profile for 50-user supervisor testing.',
  case
    when role = 'student' and index % 4 = 0 then array['React', 'TypeScript', 'CV Writing', 'Communication']
    when role = 'student' and index % 4 = 1 then array['Python', 'SQL', 'Data Analysis', 'Dashboards']
    when role = 'student' and index % 4 = 2 then array['Cybersecurity', 'Linux', 'Documentation', 'Networking']
    else array['Prompt Engineering', 'Research', 'AI Tools', 'Problem Solving']
  end,
  array['Technology', 'Internships', 'Career Readiness'],
  array['Intern', 'Junior Developer', 'Analyst'],
  'Part-time internship',
  array['Engineering', 'Data', 'Security', 'AI'],
  array['Web Development', 'Data Analytics', 'Cybersecurity', 'Prompt Engineering'],
  array['Complete courses', 'Earn certificates', 'Apply for internships'],
  true,
  timezone('utc', now()) - (index || ' hours')::interval
from seed_users
on conflict (id) do update
set
  email = excluded.email,
  role = excluded.role,
  name = excluded.name,
  school = excluded.school,
  degree = excluded.degree,
  location = excluded.location,
  bio = excluded.bio,
  skills = excluded.skills,
  interests = excluded.interests,
  preferred_roles = excluded.preferred_roles,
  availability = excluded.availability,
  preferred_internship_fields = excluded.preferred_internship_fields,
  learning_focus = excluded.learning_focus,
  career_goals = excluded.career_goals,
  onboarding_completed = excluded.onboarding_completed,
  last_seen_at = excluded.last_seen_at;

with course_seed as (
  select
    index,
    public.seed_uuid('load-course-' || index) as id,
    public.seed_uuid('lecturer-' || (((index - 1) % 5) + 1)) as instructor_id,
    (array[
      'AI Productivity Foundations',
      'Frontend Engineering Studio',
      'Data Analytics Portfolio Lab',
      'Cybersecurity Operations Basics',
      'Cloud Deployment Fundamentals',
      'Professional CV And Interview Studio',
      'Product Design Sprint',
      'Database Design For Apps',
      'IT Support Service Desk',
      'Digital Marketing Analytics',
      'Python Automation Essentials',
      'Workplace Communication For Tech'
    ])[index] as title,
    (array[
      'Artificial Intelligence',
      'Web Development',
      'Data Analytics',
      'Cybersecurity',
      'Cloud Computing',
      'Career Readiness',
      'UI/UX Design',
      'Software Engineering',
      'IT Support',
      'Digital Marketing',
      'Software Engineering',
      'Career Readiness'
    ])[index] as category
  from generate_series(1, 12) as index
)
insert into public.courses (
  id,
  slug,
  title,
  category,
  level,
  duration_text,
  duration_hours,
  short_description,
  description,
  instructor_id,
  instructor_name,
  instructor_role,
  instructor_company,
  instructor_bio,
  skills,
  outcomes,
  prerequisites,
  certificate_available,
  featured,
  popular,
  is_new,
  hero_gradient,
  internship_focus,
  updated_at,
  status,
  max_enrollments
)
select
  id,
  lower(replace(title, ' ', '-')),
  title,
  category,
  case when index % 3 = 0 then 'Intermediate'::public.course_level else 'Beginner'::public.course_level end,
  (3 + (index % 5)) || 'h ' || (10 + index) || 'm',
  3 + (index % 5),
  'Supervisor load-test course for realistic student browsing and progress updates.',
  'A realistic Tetisol Hub course used to prove database structure, enrollments, lessons, progress, and lecturer visibility for a 50-student presentation test.',
  instructor_id,
  'Tetisol Lecturer ' || (((index - 1) % 5) + 1),
  'Lecturer',
  'Tetisol',
  'Supports practical student learning and employability preparation.',
  array['Portfolio', 'Practice', 'Assessment', 'Employability'],
  array['Complete practical lessons', 'Record learning progress', 'Prepare evidence for opportunities'],
  array['Basic computer literacy'],
  true,
  index <= 4,
  index <= 6,
  index >= 9,
  'from-sky-700 via-indigo-600 to-cyan-500',
  array['Internship readiness', 'Portfolio development'],
  current_date,
  'Published',
  80
from course_seed
on conflict (id) do update
set
  title = excluded.title,
  instructor_id = excluded.instructor_id,
  status = excluded.status,
  max_enrollments = excluded.max_enrollments;

insert into public.course_modules (id, course_id, position, title, summary, estimated_time)
select
  public.seed_uuid('load-module-' || course_index || '-' || module_index),
  public.seed_uuid('load-course-' || course_index),
  module_index,
  'Module ' || module_index || ': Practical Sprint',
  'Structured activities for realistic lesson progress and participation testing.',
  '45 min'
from generate_series(1, 12) as course_index
cross join generate_series(1, 3) as module_index
on conflict (id) do update
set title = excluded.title, summary = excluded.summary, estimated_time = excluded.estimated_time;

insert into public.course_lessons (id, module_id, position, slug, title, type, duration, objective, summary, content, resources)
select
  public.seed_uuid('load-lesson-' || course_index || '-' || module_index || '-' || lesson_index),
  public.seed_uuid('load-module-' || course_index || '-' || module_index),
  lesson_index,
  'lesson-' || lesson_index,
  'Lesson ' || lesson_index || ': Applied Practice',
  case when lesson_index = 3 then 'Quiz'::public.lesson_type when lesson_index = 2 then 'Resource'::public.lesson_type else 'Text'::public.lesson_type end,
  (12 + lesson_index) || ' min',
  'Practice and record progress for supervisor testing.',
  'A realistic lesson used by the load-test data set.',
  jsonb_build_array('Read the concept.', 'Apply it to a small scenario.', 'Record evidence of progress.'),
  '[]'::jsonb
from generate_series(1, 12) as course_index
cross join generate_series(1, 3) as module_index
cross join generate_series(1, 3) as lesson_index
on conflict (id) do update
set title = excluded.title, type = excluded.type, content = excluded.content;

insert into public.course_enrollments (id, user_id, course_id, enrolled_at, started_at, completed_at, last_lesson_id, last_activity_at)
select
  public.seed_uuid('load-enrollment-' || student_index || '-' || course_index),
  public.seed_uuid('student-' || student_index),
  public.seed_uuid('load-course-' || course_index),
  timezone('utc', now()) - ((student_index + course_index) || ' days')::interval,
  timezone('utc', now()) - ((student_index + course_index - 1) || ' days')::interval,
  case when (student_index + course_index) % 7 = 0 then timezone('utc', now()) - '1 day'::interval else null end,
  public.seed_uuid('load-lesson-' || course_index || '-1-1'),
  timezone('utc', now()) - ((student_index % 24) || ' hours')::interval
from generate_series(1, 50) as student_index
cross join lateral (
  select (((student_index + offset_index - 2) % 12) + 1) as course_index
  from generate_series(1, 4) as offset_index
) courses
on conflict (user_id, course_id) do update
set last_lesson_id = excluded.last_lesson_id, last_activity_at = excluded.last_activity_at;

insert into public.lesson_progress (id, enrollment_id, lesson_id, note, completed_at)
select
  public.seed_uuid('load-progress-' || student_index || '-' || course_index || '-' || lesson_index),
  public.seed_uuid('load-enrollment-' || student_index || '-' || course_index),
  public.seed_uuid('load-lesson-' || course_index || '-1-' || lesson_index),
  'Progress note from realistic seed data.',
  case when lesson_index <= ((student_index + course_index) % 3) + 1 then timezone('utc', now()) - (lesson_index || ' hours')::interval else null end
from generate_series(1, 50) as student_index
cross join lateral (
  select (((student_index + offset_index - 2) % 12) + 1) as course_index
  from generate_series(1, 4) as offset_index
) courses
cross join generate_series(1, 3) as lesson_index
on conflict (enrollment_id, lesson_id) do update
set note = excluded.note, completed_at = excluded.completed_at;

insert into public.participation_records (id, user_id, course_id, lesson_id, participation_type, participated_at, metadata)
select
  public.seed_uuid('load-participation-' || student_index || '-' || event_index),
  public.seed_uuid('student-' || student_index),
  public.seed_uuid('load-course-' || (((student_index + event_index - 2) % 12) + 1)),
  public.seed_uuid('load-lesson-' || (((student_index + event_index - 2) % 12) + 1) || '-1-' || (((event_index - 1) % 3) + 1)),
  (array['login', 'course_view', 'lesson_view', 'progress_update'])[((event_index - 1) % 4) + 1],
  timezone('utc', now()) - ((student_index + event_index) || ' hours')::interval,
  jsonb_build_object('source', 'seed_load_test')
from generate_series(1, 50) as student_index
cross join generate_series(1, 6) as event_index
on conflict (id) do nothing;

insert into public.internships (
  id, slug, title, company, location, mode, category, level, stipend, duration,
  deadline, posted_at, description, skills, interests, responsibilities, requirements
)
select
  public.seed_uuid('load-opportunity-' || index),
  'load-opportunity-' || index,
  (array['Frontend Intern', 'Data Analyst Intern', 'Security Trainee', 'Cloud Operations Intern', 'AI Research Assistant', 'IT Support Intern', 'Product Design Intern', 'Digital Marketing Intern'])[((index - 1) % 8) + 1],
  (array['BlueOrbit Labs', 'Nexa Insights', 'ShieldStack', 'Nimbus Transit', 'ModelWorks Africa', 'ServiceDesk Pro', 'PixelForge', 'GrowthBridge'])[((index - 1) % 8) + 1],
  case when index % 3 = 0 then 'Remote' when index % 3 = 1 then 'Harare, Zimbabwe' else 'Bulawayo, Zimbabwe' end,
  case when index % 3 = 0 then 'Remote'::public.internship_mode when index % 3 = 1 then 'Hybrid'::public.internship_mode else 'Onsite'::public.internship_mode end,
  (array['Engineering', 'Data', 'Security', 'Cloud', 'AI', 'IT Support', 'Design', 'Marketing'])[((index - 1) % 8) + 1],
  'Beginner',
  'USD ' || (180 + index * 15) || '/month',
  '12 weeks',
  current_date + (index + 14),
  current_date - index,
  'Realistic opportunity seeded for internship browsing, saving, and application testing.',
  array['Communication', 'Portfolio', 'Problem Solving'],
  array['Internships', 'Career Readiness'],
  array['Complete weekly tasks', 'Collaborate with mentors', 'Document outcomes'],
  array['Student or recent graduate', 'Evidence of learning progress']
from generate_series(1, 16) as index
on conflict (id) do update
set title = excluded.title, company = excluded.company, deadline = excluded.deadline;

insert into public.saved_internships (user_id, internship_id)
select
  public.seed_uuid('student-' || student_index),
  public.seed_uuid('load-opportunity-' || (((student_index + saved_index - 2) % 16) + 1))
from generate_series(1, 50) as student_index
cross join generate_series(1, 2) as saved_index
on conflict (user_id, internship_id) do nothing;

insert into public.tracked_applications (id, user_id, internship_id, status, notes, deadline)
select
  public.seed_uuid('load-application-' || student_index),
  public.seed_uuid('student-' || student_index),
  public.seed_uuid('load-opportunity-' || (((student_index - 1) % 16) + 1)),
  (array['Interested', 'Applied', 'Interview', 'Offer', 'Rejected'])[((student_index - 1) % 5) + 1]::public.application_status,
  'Seed application for supervisor presentation testing.',
  current_date + ((student_index % 20) + 5)
from generate_series(1, 50) as student_index
on conflict (id) do update
set status = excluded.status, notes = excluded.notes, deadline = excluded.deadline;

insert into public.cvs (id, user_id, headline, summary, education, skills, experience, score, suggestions, last_updated)
select
  public.seed_uuid('load-cv-' || student_index),
  public.seed_uuid('student-' || student_index),
  'Aspiring Technology Intern',
  'Student preparing for internships through Tetisol Hub courses, practical projects, and employability workflows.',
  'Diploma in Applied Technology, Tetisol Partner College',
  array['Communication', 'Portfolio', 'Problem Solving', 'Digital Skills'],
  jsonb_build_array('Completed course activities and prepared a practical portfolio.'),
  72 + (student_index % 20),
  array['Add more quantified project outcomes', 'Tailor the CV to each opportunity'],
  timezone('utc', now())
from generate_series(1, 50) as student_index
on conflict (user_id) do update
set headline = excluded.headline, summary = excluded.summary, score = excluded.score, last_updated = excluded.last_updated;

insert into public.announcements (id, course_id, title, body, audience, created_by)
select
  public.seed_uuid('load-announcement-' || course_index),
  public.seed_uuid('load-course-' || course_index),
  'Week ' || course_index || ' participation reminder',
  'Please complete your current lesson and update your progress before the next lecturer review.',
  'students',
  public.seed_uuid('lecturer-' || (((course_index - 1) % 5) + 1))
from generate_series(1, 12) as course_index
on conflict (id) do nothing;

insert into public.notifications (id, user_id, title, body, href)
select
  public.seed_uuid('load-notification-' || student_index),
  public.seed_uuid('student-' || student_index),
  'Your Tetisol learning plan is ready',
  'Continue your course and review matched internship opportunities.',
  '/dashboard'
from generate_series(1, 50) as student_index
on conflict (id) do nothing;
