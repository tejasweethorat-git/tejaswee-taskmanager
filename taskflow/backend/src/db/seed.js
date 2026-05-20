const db = require('./init');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const now = () => new Date().toISOString();

function seed() {
  const existing = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existing.count > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  console.log('Seeding database...');

  const adminId = uuidv4(), m1 = uuidv4(), m2 = uuidv4(), m3 = uuidv4();
  const p1 = uuidv4(), p2 = uuidv4(), p3 = uuidv4();
  const t1 = uuidv4(), t2 = uuidv4(), t3 = uuidv4(), t4 = uuidv4(), t5 = uuidv4(), t6 = uuidv4();

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar, bio, joined)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    [adminId, 'Arjun Sharma',    'arjun@taskflow.com',    bcrypt.hashSync('arjun@123', 10), 'Admin',  'AS', 'Project lead & system admin',         now()],
    [m1,      'Tejaswee Thorat', 'tejaswee@taskflow.com', bcrypt.hashSync('tejas@123', 10), 'Member', 'TT', 'Frontend developer & UI designer',    now()],
    [m2,      'Rohan Kulkarni',  'rohan@taskflow.com',    bcrypt.hashSync('rohan@123', 10), 'Member', 'RK', 'Backend developer & DevOps engineer', now()],
    [m3,      'Priya Desai',     'priya@taskflow.com',    bcrypt.hashSync('priya@123', 10), 'Member', 'PD', 'QA engineer & test automation lead',  now()],
  ];
  users.forEach(u => insertUser.run(...u));

  const insertProject = db.prepare(`
    INSERT INTO projects (id, name, description, deadline, priority, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPM = db.prepare(`INSERT INTO project_members (project_id, user_id) VALUES (?, ?)`);

  const projects = [
    [p1, 'Website Redesign',    'Complete overhaul of company website with new brand identity',   '2026-07-01', 'High',     adminId, now()],
    [p2, 'Mobile App MVP',      'Build iOS and Android MVP for product launch',                   '2026-06-15', 'Critical', adminId, now()],
    [p3, 'QA Automation Suite', 'Build end-to-end automated test suite covering all core flows',  '2026-08-01', 'Medium',   adminId, now()],
  ];
  projects.forEach(p => {
    insertProject.run(...p);
  });

  [[p1,adminId],[p1,m1],[p1,m2],[p1,m3],
   [p2,adminId],[p2,m2],[p2,m3],
   [p3,adminId],[p3,m3],[p3,m1]
  ].forEach(([pid,uid]) => insertPM.run(pid,uid));

  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, description, project_id, assigned_to, status, priority, deadline, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const tasks = [
    [t1,'Design new homepage mockup',     'Create Figma wireframes and high-fidelity mockups.',               p1, m1, 'In Progress','High',    '2026-05-30', adminId, now()],
    [t2,'Set up CI/CD pipeline',          'Configure GitHub Actions for automated testing and deployment.',    p1, m2, 'Completed',  'Critical','2026-05-20', adminId, now()],
    [t3,'API endpoint documentation',     'Document all REST endpoints using Swagger/OpenAPI spec.',           p2, m2, 'To Do',      'Medium',  '2026-06-05', adminId, now()],
    [t4,'User authentication flow',       'Implement JWT-based auth with refresh tokens for the mobile app.', p2, m2, 'In Progress','Critical','2026-05-28', adminId, now()],
    [t5,'Write login & signup test cases','Create automated Selenium tests for login, signup flow.',           p3, m3, 'In Progress','High',    '2026-06-10', adminId, now()],
    [t6,'Cross-browser compatibility QA', 'Run full regression suite across Chrome, Firefox, Safari, Edge.',   p3, m3, 'To Do',      'Medium',  '2026-06-20', adminId, now()],
  ];
  tasks.forEach(t => insertTask.run(...t));

  const insertComment = db.prepare(`INSERT INTO comments (id, task_id, user_id, text, time) VALUES (?,?,?,?,?)`);
  insertComment.run(uuidv4(), t1, m1, 'Wireframes done, working on high-fidelity now.', now());
  insertComment.run(uuidv4(), t5, m3, 'Login tests done. Working on signup tests now.', now());

  const insertLog = db.prepare(`INSERT INTO activity_logs (id, user_id, action, time) VALUES (?,?,?,?)`);
  [
    [adminId, "Created project 'Website Redesign'"],
    [adminId, "Created project 'Mobile App MVP'"],
    [adminId, "Created project 'QA Automation Suite'"],
    [adminId, "Assigned tasks to Tejaswee, Rohan & Priya"],
    [m2,      "Completed 'Set up CI/CD pipeline'"],
    [m3,      "Started 'Write login & signup test cases'"],
  ].forEach(([uid, action]) => insertLog.run(uuidv4(), uid, action, now()));

  console.log('✅ Database seeded successfully!');
}

seed();
module.exports = seed;
