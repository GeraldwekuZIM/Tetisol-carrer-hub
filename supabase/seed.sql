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
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'practical-prompt-engineering',
    'Practical Prompt Engineering',
    'Prompt Engineering',
    'Beginner',
    '4h 25m',
    4,
    'Learn prompt structures, quality evaluation, and repeatable AI workflow design.',
    'A career-focused prompt engineering course that helps learners design dependable prompts, evaluate results, and translate prompting into real product and operations workflows.',
    'Rudo Chikafa',
    'Prompt Systems Lead',
    'Tetisol',
    'Rudo helps student teams build reliable AI workflows that improve communication, productivity, and product quality.',
    array['Prompt Engineering', 'Prompt Evaluation', 'Workflow Design', 'AI Communication'],
    array[
      'Write stronger prompts using reusable structures',
      'Evaluate prompt quality with simple rubrics',
      'Map prompt-driven workflows for real-world tasks'
    ],
    array['Comfort using generative AI tools'],
    true,
    true,
    true,
    true,
    'from-sky-600 via-indigo-500 to-cyan-400',
    array['Prompt Design Intern', 'AI Research Assistant', 'Operations Analyst Intern'],
    '2026-04-21'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'data-analytics-with-python',
    'Data Analytics with Python',
    'Data Analytics',
    'Beginner',
    '4h 30m',
    5,
    'Clean data, choose better metrics, and communicate insights that lead to action.',
    'A beginner-friendly analytics course focused on asking stronger questions, cleaning data with confidence, and turning analysis into dashboards and recommendations.',
    'Nomsa Dube',
    'Data Learning Lead',
    'Tetisol',
    'Nomsa teaches analytics through practical business questions and employability-ready communication habits.',
    array['Python', 'Data Cleaning', 'Metrics', 'Dashboards'],
    array[
      'Frame better analytical questions',
      'Prepare messy datasets for analysis',
      'Build clearer metric stories for stakeholders'
    ],
    array['Comfort with spreadsheets is enough to start'],
    true,
    true,
    false,
    true,
    'from-sky-700 via-cyan-600 to-indigo-500',
    array['Data Analyst Intern', 'Business Intelligence Intern', 'Operations Analyst'],
    '2026-04-21'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'cybersecurity-fundamentals',
    'Cybersecurity Fundamentals',
    'Cybersecurity',
    'Beginner',
    '4h 45m',
    5,
    'Learn security reasoning, operational basics, and documentation habits that teams value.',
    'An entry-level cybersecurity course that covers risk thinking, control basics, incident documentation, and defensive workflows in a way that feels relevant to real internship environments.',
    'Tawanda Ncube',
    'Security Operations Mentor',
    'Tetisol',
    'Tawanda teaches practical security foundations for learners who want to become dependable entry-level defenders.',
    array['Cybersecurity', 'Security Operations', 'Documentation', 'Risk Thinking'],
    array[
      'Explain basic security controls and risks',
      'Triage simple alerts and document findings clearly',
      'Understand the habits that support reliable defensive work'
    ],
    array['Basic comfort with browsers, devices, and online accounts'],
    true,
    true,
    true,
    false,
    'from-slate-900 via-indigo-700 to-sky-500',
    array['Cybersecurity Intern', 'IT Support Intern', 'SOC Trainee'],
    '2026-04-19'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'career-readiness-for-tech-students',
    'Career Readiness for Tech Students',
    'Career Readiness',
    'Beginner',
    '3h 20m',
    3,
    'Turn your skills into stronger applications, clearer stories, and better internship readiness.',
    'A focused employability course covering positioning, evidence of work, application quality, and communication habits that help learners move from studying to earning.',
    'Tetisol Career Studio',
    'Career Readiness Mentors',
    'Tetisol',
    'The career team helps learners package skills into stronger internship and job opportunities.',
    array['CV Writing', 'Interview Preparation', 'Career Storytelling', 'Professional Communication'],
    array[
      'Write stronger evidence-based CV content',
      'Map learning and projects into employability signals',
      'Prepare for applications and interviews more strategically'
    ],
    array['Open to all learners'],
    true,
    true,
    true,
    false,
    'from-indigo-700 via-sky-600 to-cyan-400',
    array['All internship pathways', 'Graduate trainee roles', 'Portfolio-driven applications'],
    '2026-04-21'
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  category = excluded.category,
  level = excluded.level,
  duration_text = excluded.duration_text,
  duration_hours = excluded.duration_hours,
  short_description = excluded.short_description,
  description = excluded.description,
  instructor_name = excluded.instructor_name,
  instructor_role = excluded.instructor_role,
  instructor_company = excluded.instructor_company,
  instructor_bio = excluded.instructor_bio,
  skills = excluded.skills,
  outcomes = excluded.outcomes,
  prerequisites = excluded.prerequisites,
  certificate_available = excluded.certificate_available,
  featured = excluded.featured,
  popular = excluded.popular,
  is_new = excluded.is_new,
  hero_gradient = excluded.hero_gradient,
  internship_focus = excluded.internship_focus,
  updated_at = excluded.updated_at;

insert into public.course_modules (id, course_id, position, title, summary, estimated_time)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 1, 'Prompting Fundamentals', 'Learn the anatomy of strong prompts and how to reduce vague outputs.', '2h 05m'),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000101', 2, 'Prompt Operations', 'Test, refine, and operationalize prompts for consistent team use.', '2h 20m'),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000102', 1, 'Data Wrangling Fundamentals', 'Organize messy data and prepare it for useful analysis.', '2h 12m'),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000102', 2, 'Insight Communication', 'Turn analysis into dashboards and recommendations that others can use.', '2h 18m'),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000103', 1, 'Security Mindset', 'Understand common attack surfaces, risk thinking, and daily security habits.', '2h 15m'),
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000103', 2, 'Defensive Operations', 'Work with logs, alerts, and response habits that support real operational security.', '2h 30m'),
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000104', 1, 'Career Positioning', 'Clarify your direction, evidence, and professional story.', '1h 35m'),
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000104', 2, 'Application Strategy', 'Translate learning into stronger CVs, applications, and interviews.', '1h 45m')
on conflict (id) do update
set
  course_id = excluded.course_id,
  position = excluded.position,
  title = excluded.title,
  summary = excluded.summary,
  estimated_time = excluded.estimated_time;

insert into public.course_lessons (
  id,
  module_id,
  position,
  slug,
  title,
  type,
  duration,
  objective,
  summary,
  content,
  resources
)
values
  (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000201',
    1,
    'why-good-prompts-are-systems',
    'Why Good Prompts Are Systems',
    'Text',
    '17 min',
    'See prompting as workflow design, not clever phrasing.',
    'Break prompting into instruction, context, examples, and evaluation.',
    '["Prompt engineering is rarely about one perfect sentence. Strong prompts define the task, add the right context, and make success measurable.", "This lesson compares weak prompts with improved versions and explains what changes actually increase reliability."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000201',
    2,
    'prompt-patterns-that-scale',
    'Prompt Patterns That Scale',
    'Resource',
    '24 min',
    'Practice reusable prompt structures for summarization, extraction, and planning.',
    'Work through formats that teams can reuse across support, operations, and product work.',
    '["Review role prompting, structured output, examples, and constraints. The aim is to make prompting repeatable for real tasks, not just demos."]'::jsonb,
    '[{"label":"Reusable prompt library","kind":"Template"}]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    '00000000-0000-0000-0000-000000000202',
    1,
    'evaluating-output-quality',
    'Evaluating Output Quality',
    'Text',
    '18 min',
    'Use rubrics and failure analysis to improve prompts.',
    'Learn how teams score outputs and decide what to fix next.',
    '["Quality evaluation matters because prompts that look good once can still fail in real use. A simple rubric can expose where format, depth, or accuracy breaks down."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000304',
    '00000000-0000-0000-0000-000000000202',
    2,
    'prompt-ops-checkpoint',
    'Prompt Ops Checkpoint',
    'Quiz',
    '12 min',
    'Assess prompt evaluation and workflow integration skills.',
    'Final course quiz with scenario-based questions.',
    '["This assessment focuses on prompt quality, evaluation, and workflow reliability."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000305',
    '00000000-0000-0000-0000-000000000203',
    1,
    'asking-better-questions-with-data',
    'Asking Better Questions with Data',
    'Text',
    '16 min',
    'Start analysis with clear questions and decision context.',
    'The best analysis begins before code or charts.',
    '["Many weak analyses fail because the question is vague. Strong analysts define the audience, decision, and evidence needed before touching the dataset."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000306',
    '00000000-0000-0000-0000-000000000203',
    2,
    'cleaning-data-with-python',
    'Cleaning Data with Python',
    'Resource',
    '27 min',
    'Use Python-friendly habits for cleaning and preparing tabular data.',
    'Review common issues such as missing values, inconsistent fields, and duplicate records.',
    '["Data cleaning is where trust is built. This lesson walks through a simple workflow for inspecting data, fixing basic issues, and documenting assumptions."]'::jsonb,
    '[{"label":"Pandas cleaning checklist","kind":"Guide"}]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000307',
    '00000000-0000-0000-0000-000000000204',
    1,
    'choosing-the-right-metric',
    'Choosing the Right Metric',
    'Text',
    '18 min',
    'Pick metrics that genuinely help decisions.',
    'Move away from vanity charts and toward meaningful evidence.',
    '["Strong analysts know that the wrong metric can create false confidence. This lesson helps you connect metrics to behavior, outcomes, and next actions."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000308',
    '00000000-0000-0000-0000-000000000204',
    2,
    'analytics-storytelling-checkpoint',
    'Analytics Storytelling Checkpoint',
    'Quiz',
    '11 min',
    'Measure your understanding of metrics and communication.',
    'Final checkpoint for the course.',
    '["This assessment focuses on metrics, dashboards, and practical recommendations."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000309',
    '00000000-0000-0000-0000-000000000205',
    1,
    'thinking-like-a-defender',
    'Thinking Like a Defender',
    'Text',
    '19 min',
    'Learn how defenders reason about risk and exposure.',
    'Build the habits that make security work less abstract.',
    '["Security is about identifying what matters, where it can fail, and how to reduce harm. This lesson introduces assets, threats, controls, and tradeoffs in clear product language."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000310',
    '00000000-0000-0000-0000-000000000205',
    2,
    'account-device-and-network-basics',
    'Account, Device, and Network Basics',
    'Resource',
    '26 min',
    'Review the foundations of identity, endpoints, and network hygiene.',
    'See how everyday controls reduce real-world vulnerability.',
    '["The biggest security improvements often come from consistent fundamentals: strong identity controls, patching, device hygiene, and visibility."]'::jsonb,
    '[{"label":"Security hygiene checklist","kind":"Guide"}]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000311',
    '00000000-0000-0000-0000-000000000206',
    1,
    'logs-alerts-and-triage',
    'Logs, Alerts, and Triage',
    'Text',
    '21 min',
    'Understand what operational teams look for when suspicious activity appears.',
    'Move from theory into practical defensive workflow thinking.',
    '["Alerts without context can overwhelm a team. Triage helps analysts decide what matters, what can wait, and what needs escalation."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000312',
    '00000000-0000-0000-0000-000000000206',
    2,
    'defensive-operations-checkpoint',
    'Defensive Operations Checkpoint',
    'Quiz',
    '12 min',
    'Test your understanding of triage and incident communication.',
    'Final checkpoint for the course.',
    '["This assessment focuses on security operations, triage, and communicating findings clearly."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000313',
    '00000000-0000-0000-0000-000000000207',
    1,
    'clarifying-your-career-story',
    'Clarifying Your Career Story',
    'Text',
    '15 min',
    'Connect what you are learning to the kind of work you want next.',
    'Build a sharper professional narrative before you write or apply.',
    '["Strong early-career positioning starts with clarity about strengths, evidence, and direction. This lesson helps you explain what you are building toward in simple, credible language."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000314',
    '00000000-0000-0000-0000-000000000207',
    2,
    'evidence-that-strengthens-your-profile',
    'Evidence That Strengthens Your Profile',
    'Resource',
    '18 min',
    'Identify the projects, achievements, and certificates that improve your application story.',
    'Move from vague claims to stronger proof of readiness.',
    '["This lesson helps learners pull out real evidence from courses, projects, and collaboration so their applications feel more grounded."]'::jsonb,
    '[{"label":"Career story worksheet","kind":"Template"}]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000315',
    '00000000-0000-0000-0000-000000000208',
    1,
    'writing-better-cv-bullets',
    'Writing Better CV Bullets',
    'Text',
    '17 min',
    'Write evidence-based bullets with context, action, and outcome.',
    'Turn your learning into stronger application language.',
    '["A stronger CV bullet usually combines what you did, why it mattered, and what changed because of the work."]'::jsonb,
    '[]'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000316',
    '00000000-0000-0000-0000-000000000208',
    2,
    'application-strategy-checkpoint',
    'Application Strategy Checkpoint',
    'Quiz',
    '10 min',
    'Assess your understanding of better application strategy.',
    'Final quiz for the course.',
    '["This assessment focuses on targeted applications, stronger CV writing, and professional communication."]'::jsonb,
    '[]'::jsonb
  )
on conflict (id) do update
set
  module_id = excluded.module_id,
  position = excluded.position,
  slug = excluded.slug,
  title = excluded.title,
  type = excluded.type,
  duration = excluded.duration,
  objective = excluded.objective,
  summary = excluded.summary,
  content = excluded.content,
  resources = excluded.resources;

insert into public.quizzes (
  id,
  course_id,
  module_id,
  lesson_id,
  title,
  description,
  passing_score
)
values
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000304',
    'Prompt Ops Checkpoint',
    'Assess prompt evaluation and workflow integration skills.',
    70
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000308',
    'Analytics Storytelling Checkpoint',
    'Assess your understanding of metrics and communication.',
    70
  ),
  (
    '00000000-0000-0000-0000-000000000403',
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000312',
    'Defensive Operations Checkpoint',
    'Assess your understanding of triage and incident communication.',
    70
  ),
  (
    '00000000-0000-0000-0000-000000000404',
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000208',
    '00000000-0000-0000-0000-000000000316',
    'Application Strategy Checkpoint',
    'Assess your understanding of targeted applications and stronger CV writing.',
    70
  )
on conflict (id) do update
set
  course_id = excluded.course_id,
  module_id = excluded.module_id,
  lesson_id = excluded.lesson_id,
  title = excluded.title,
  description = excluded.description,
  passing_score = excluded.passing_score;

insert into public.quiz_questions (
  id,
  quiz_id,
  position,
  prompt,
  options,
  correct_answer,
  explanation
)
values
  (
    '00000000-0000-0000-0000-000000000451',
    '00000000-0000-0000-0000-000000000401',
    1,
    'What is the main purpose of a prompt quality rubric?',
    '["To compare outputs against consistent criteria", "To make prompts longer", "To avoid human review entirely", "To reduce the need for product decisions"]'::jsonb,
    'To compare outputs against consistent criteria',
    'Rubrics turn vague impressions into usable feedback.'
  ),
  (
    '00000000-0000-0000-0000-000000000452',
    '00000000-0000-0000-0000-000000000401',
    2,
    'When does prompt work become most valuable?',
    '["When it fits a workflow with handoff and review steps", "When it exists as a random note", "When no one documents it", "When it changes every hour"]'::jsonb,
    'When it fits a workflow with handoff and review steps',
    'Prompting creates value when it becomes reusable and dependable.'
  ),
  (
    '00000000-0000-0000-0000-000000000453',
    '00000000-0000-0000-0000-000000000401',
    3,
    'Which habit best supports prompt improvement?',
    '["Logging failure patterns and iteration notes", "Changing everything at once", "Ignoring bad outputs", "Only testing once"]'::jsonb,
    'Logging failure patterns and iteration notes',
    'Improvement depends on visible evidence and deliberate iteration.'
  ),
  (
    '00000000-0000-0000-0000-000000000454',
    '00000000-0000-0000-0000-000000000402',
    1,
    'What makes a metric useful?',
    '["It supports a real decision or behavior insight", "It is easy to screenshot", "It always goes up", "It looks impressive in isolation"]'::jsonb,
    'It supports a real decision or behavior insight',
    'Useful metrics connect evidence to action.'
  ),
  (
    '00000000-0000-0000-0000-000000000455',
    '00000000-0000-0000-0000-000000000402',
    2,
    'A strong dashboard should help people:',
    '["See what changed, why it matters, and what to do next", "Look at as many charts as possible", "Ignore caveats", "Avoid taking action"]'::jsonb,
    'See what changed, why it matters, and what to do next',
    'Great dashboards guide action, not just observation.'
  ),
  (
    '00000000-0000-0000-0000-000000000456',
    '00000000-0000-0000-0000-000000000402',
    3,
    'What strengthens analytical storytelling?',
    '["Clear narrative, caveats, and recommendation", "Only listing raw numbers", "Hiding uncertainty", "Removing context from the audience"]'::jsonb,
    'Clear narrative, caveats, and recommendation',
    'Decision-makers need both evidence and context.'
  ),
  (
    '00000000-0000-0000-0000-000000000457',
    '00000000-0000-0000-0000-000000000403',
    1,
    'What is triage in security operations?',
    '["Prioritizing alerts and deciding next actions", "Deleting all alerts immediately", "A type of firewall only", "Writing marketing copy"]'::jsonb,
    'Prioritizing alerts and deciding next actions',
    'Triage helps teams focus effort where risk is highest.'
  ),
  (
    '00000000-0000-0000-0000-000000000458',
    '00000000-0000-0000-0000-000000000403',
    2,
    'Why is incident documentation important?',
    '["It supports clearer handoffs and remediation follow-up", "It slows teams down for no reason", "It replaces technical investigation", "It matters only after an audit"]'::jsonb,
    'It supports clearer handoffs and remediation follow-up',
    'Good documentation makes security work useful to others.'
  ),
  (
    '00000000-0000-0000-0000-000000000459',
    '00000000-0000-0000-0000-000000000403',
    3,
    'Which habit helps an entry-level defender most?',
    '["Clear notes, consistent process, and calm escalation", "Guessing without evidence", "Ignoring context", "Escalating everything immediately"]'::jsonb,
    'Clear notes, consistent process, and calm escalation',
    'Reliable operations depend on disciplined communication and process.'
  ),
  (
    '00000000-0000-0000-0000-000000000460',
    '00000000-0000-0000-0000-000000000404',
    1,
    'What makes a CV bullet stronger?',
    '["Clear action, context, and outcome", "Only listing tools", "Keeping it vague", "Avoiding evidence"]'::jsonb,
    'Clear action, context, and outcome',
    'Evidence and specificity create stronger employability signals.'
  ),
  (
    '00000000-0000-0000-0000-000000000461',
    '00000000-0000-0000-0000-000000000404',
    2,
    'Why should learning history appear in applications?',
    '["It shows skill growth and initiative", "It is unrelated to hiring", "It replaces all project work", "It only matters after graduation"]'::jsonb,
    'It shows skill growth and initiative',
    'Courses, certificates, and projects help tell a fuller readiness story.'
  ),
  (
    '00000000-0000-0000-0000-000000000462',
    '00000000-0000-0000-0000-000000000404',
    3,
    'The best application strategy is usually:',
    '["Targeted and evidence-based", "Apply everywhere with the same CV", "Wait for perfect confidence", "Hide your projects"]'::jsonb,
    'Targeted and evidence-based',
    'Focused applications tend to be stronger and easier to improve.'
  )
on conflict (id) do update
set
  quiz_id = excluded.quiz_id,
  position = excluded.position,
  prompt = excluded.prompt,
  options = excluded.options,
  correct_answer = excluded.correct_answer,
  explanation = excluded.explanation;

insert into public.internships (
  id,
  slug,
  title,
  company,
  location,
  mode,
  category,
  level,
  stipend,
  duration,
  deadline,
  posted_at,
  description,
  skills,
  interests,
  responsibilities,
  requirements
)
values
  (
    '00000000-0000-0000-0000-000000000501',
    'software-dev-intern',
    'Software Dev Intern',
    'BlueOrbit Labs',
    'Harare, Zimbabwe',
    'Hybrid',
    'Engineering',
    'Beginner',
    'USD 250/month',
    '12 weeks',
    '2026-05-18',
    '2026-04-18',
    'Build student-facing product features, collaborate with product and design, and learn how production web apps are shipped with care.',
    array['React', 'TypeScript', 'APIs', 'Problem Solving'],
    array['Web Development', 'Software Engineering'],
    array[
      'Build polished product surfaces in React and Next.js',
      'Help connect features to APIs and databases',
      'Write clean, tested code with senior mentorship'
    ],
    array[
      'Comfortable with JavaScript fundamentals',
      'Strong curiosity for shipping real products',
      'Portfolio or school project work is a plus'
    ]
  ),
  (
    '00000000-0000-0000-0000-000000000502',
    'data-analyst-intern',
    'Data Analyst Intern',
    'Nexa Insights',
    'Remote',
    'Remote',
    'Data',
    'Beginner',
    'USD 220/month',
    '10 weeks',
    '2026-05-08',
    '2026-04-19',
    'Turn raw business data into clear dashboards and recommendations for product, growth, and learner success teams.',
    array['Python', 'SQL', 'Excel', 'Dashboards'],
    array['Analytics', 'Business Intelligence'],
    array[
      'Build weekly learner performance dashboards',
      'Clean and segment data for reporting',
      'Present clear insights to stakeholders'
    ],
    array[
      'Confidence with spreadsheets or SQL basics',
      'Ability to explain numbers clearly',
      'Attention to detail and structured thinking'
    ]
  ),
  (
    '00000000-0000-0000-0000-000000000503',
    'cybersecurity-intern',
    'Cybersecurity Intern',
    'ShieldStack',
    'Bulawayo, Zimbabwe',
    'Onsite',
    'Security',
    'Intermediate',
    'USD 300/month',
    '16 weeks',
    '2026-05-25',
    '2026-04-17',
    'Support vulnerability reviews, improve team security hygiene, and learn how product companies protect their systems and users.',
    array['Networking', 'Linux', 'Security Basics', 'Documentation'],
    array['Cybersecurity', 'Risk Management'],
    array[
      'Assist with vulnerability scans and remediation tracking',
      'Document security findings and operational playbooks',
      'Support awareness and compliance activities'
    ],
    array[
      'Basic understanding of networks and operating systems',
      'Strong documentation habits',
      'Willingness to learn security tooling fast'
    ]
  ),
  (
    '00000000-0000-0000-0000-000000000504',
    'ai-research-assistant-intern',
    'AI Research Assistant Intern',
    'ModelWorks Africa',
    'Remote',
    'Remote',
    'AI',
    'Intermediate',
    'USD 320/month',
    '12 weeks',
    '2026-05-22',
    '2026-04-20',
    'Support prompt testing, dataset review, and experiment documentation for AI education and productivity tools.',
    array['Prompt Engineering', 'Research', 'Python', 'Communication'],
    array['Artificial Intelligence', 'Prompt Engineering'],
    array[
      'Evaluate prompt quality and document patterns',
      'Support small-scale model experiments and benchmarking',
      'Write concise notes that help the product team iterate quickly'
    ],
    array[
      'Comfortable writing clearly and testing hypotheses',
      'Exposure to AI tools or Python is helpful',
      'Strong attention to detail'
    ]
  ),
  (
    '00000000-0000-0000-0000-000000000505',
    'cloud-operations-intern',
    'Cloud Operations Intern',
    'Nimbus Transit',
    'Johannesburg, South Africa',
    'Hybrid',
    'Cloud',
    'Beginner',
    'USD 260/month',
    '12 weeks',
    '2026-05-27',
    '2026-04-21',
    'Work with engineers to monitor cloud services, improve deployment visibility, and support reliable product delivery.',
    array['Cloud Basics', 'Monitoring', 'Linux', 'Documentation'],
    array['Cloud Computing', 'DevOps'],
    array[
      'Update dashboards and deployment notes',
      'Support release readiness checklists',
      'Investigate simple incidents with senior guidance'
    ],
    array[
      'Strong curiosity about cloud systems',
      'Comfort with terminal basics is a plus',
      'Organized written communication'
    ]
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  company = excluded.company,
  location = excluded.location,
  mode = excluded.mode,
  category = excluded.category,
  level = excluded.level,
  stipend = excluded.stipend,
  duration = excluded.duration,
  deadline = excluded.deadline,
  posted_at = excluded.posted_at,
  description = excluded.description,
  skills = excluded.skills,
  interests = excluded.interests,
  responsibilities = excluded.responsibilities,
  requirements = excluded.requirements;

-- User-scoped records such as profiles, enrollments, quiz attempts, certificates,
-- saved internships, tracked applications, CVs, CV sections, and reminders should be
-- inserted after real auth users exist in your Supabase project.
