const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');
const { auth, adminOnly } = require('../middleware/auth');

const getProjectWithMembers = (id) => {
  const project = db.prepare('SELECT * FROM projects WHERE id=?').get(id);
  if (!project) return null;
  const members = db.prepare('SELECT user_id FROM project_members WHERE project_id=?').all(id).map(r => r.user_id);
  return { ...project, members };
};

// GET /api/projects
router.get('/', auth, (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = db.prepare('SELECT * FROM projects').all();
  } else {
    projects = db.prepare(
      'SELECT p.* FROM projects p JOIN project_members pm ON p.id=pm.project_id WHERE pm.user_id=?'
    ).all(req.user.id);
  }
  const result = projects.map(p => {
    const members = db.prepare('SELECT user_id FROM project_members WHERE project_id=?').all(p.id).map(r => r.user_id);
    return { ...p, members };
  });
  res.json(result);
});

// POST /api/projects (admin only)
router.post('/', auth, adminOnly, (req, res) => {
  const { name, description='', deadline='', priority='Medium', members=[] } = req.body;
  if (!name) return res.status(400).json({ error: 'Project name required' });
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare('INSERT INTO projects (id,name,description,deadline,priority,created_by,created_at) VALUES (?,?,?,?,?,?,?)')
    .run(id, name, description, deadline, priority, req.user.id, now);
  const allMembers = [...new Set([req.user.id, ...members])];
  allMembers.forEach(uid => db.prepare('INSERT OR IGNORE INTO project_members (project_id,user_id) VALUES (?,?)').run(id,uid));
  db.prepare('INSERT INTO activity_logs (id,user_id,action,time) VALUES (?,?,?,?)').run(uuidv4(), req.user.id, `Created project '${name}'`, now);
  res.json(getProjectWithMembers(id));
});

// PUT /api/projects/:id (admin only)
router.put('/:id', auth, adminOnly, (req, res) => {
  const { name, description, deadline, priority, members=[] } = req.body;
  db.prepare('UPDATE projects SET name=?,description=?,deadline=?,priority=? WHERE id=?')
    .run(name, description, deadline, priority, req.params.id);
  db.prepare('DELETE FROM project_members WHERE project_id=?').run(req.params.id);
  const allMembers = [...new Set([req.user.id, ...members])];
  allMembers.forEach(uid => db.prepare('INSERT OR IGNORE INTO project_members (project_id,user_id) VALUES (?,?)').run(req.params.id,uid));
  res.json(getProjectWithMembers(req.params.id));
});

// DELETE /api/projects/:id (admin only)
router.delete('/:id', auth, adminOnly, (req, res) => {
  const p = db.prepare('SELECT name FROM projects WHERE id=?').get(req.params.id);
  db.prepare('DELETE FROM projects WHERE id=?').run(req.params.id);
  db.prepare('INSERT INTO activity_logs (id,user_id,action,time) VALUES (?,?,?,?)').run(uuidv4(), req.user.id, `Deleted project '${p?.name}'`, new Date().toISOString());
  res.json({ message: 'Project deleted' });
});

module.exports = router;
