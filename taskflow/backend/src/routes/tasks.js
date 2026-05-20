const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');
const { auth, adminOnly } = require('../middleware/auth');

const getTaskWithComments = (id) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(id);
  if (!task) return null;
  const comments = db.prepare('SELECT * FROM comments WHERE task_id=? ORDER BY time ASC').all(id);
  return { ...task, comments };
};

// GET /api/tasks
router.get('/', auth, (req, res) => {
  let tasks;
  if (req.user.role === 'Admin') {
    tasks = db.prepare('SELECT * FROM tasks').all();
  } else {
    tasks = db.prepare('SELECT * FROM tasks WHERE assigned_to=?').all(req.user.id);
  }
  const result = tasks.map(t => {
    const comments = db.prepare('SELECT * FROM comments WHERE task_id=? ORDER BY time ASC').all(t.id);
    return { ...t, comments };
  });
  res.json(result);
});

// POST /api/tasks (admin only)
router.post('/', auth, adminOnly, (req, res) => {
  const { title, description='', project_id, assigned_to='', status='To Do', priority='Medium', deadline='' } = req.body;
  if (!title || !project_id) return res.status(400).json({ error: 'Title and project required' });
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare('INSERT INTO tasks (id,title,description,project_id,assigned_to,status,priority,deadline,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
    .run(id, title, description, project_id, assigned_to||null, status, priority, deadline, req.user.id, now);
  db.prepare('INSERT INTO activity_logs (id,user_id,action,time) VALUES (?,?,?,?)').run(uuidv4(), req.user.id, `Created task '${title}'`, now);
  res.json(getTaskWithComments(id));
});

// PUT /api/tasks/:id
router.put('/:id', auth, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const isAdmin = req.user.role === 'Admin';
  const isAssignee = task.assigned_to === req.user.id;
  if (!isAdmin && !isAssignee) return res.status(403).json({ error: 'Not authorized' });

  if (isAdmin) {
    const { title, description, project_id, assigned_to, status, priority, deadline } = req.body;
    db.prepare('UPDATE tasks SET title=?,description=?,project_id=?,assigned_to=?,status=?,priority=?,deadline=? WHERE id=?')
      .run(title, description, project_id, assigned_to||null, status, priority, deadline, req.params.id);
  } else {
    // Members can only update status
    const { status } = req.body;
    if (!['To Do','In Progress','Completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    db.prepare('UPDATE tasks SET status=? WHERE id=?').run(status, req.params.id);
  }
  db.prepare('INSERT INTO activity_logs (id,user_id,action,time) VALUES (?,?,?,?)').run(uuidv4(), req.user.id, `Updated task '${task.title}'`, new Date().toISOString());
  res.json(getTaskWithComments(req.params.id));
});

// DELETE /api/tasks/:id (admin only)
router.delete('/:id', auth, adminOnly, (req, res) => {
  const t = db.prepare('SELECT title FROM tasks WHERE id=?').get(req.params.id);
  db.prepare('DELETE FROM tasks WHERE id=?').run(req.params.id);
  db.prepare('INSERT INTO activity_logs (id,user_id,action,time) VALUES (?,?,?,?)').run(uuidv4(), req.user.id, `Deleted task '${t?.title}'`, new Date().toISOString());
  res.json({ message: 'Task deleted' });
});

// POST /api/tasks/:id/comments
router.post('/:id/comments', auth, (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'Comment text required' });
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare('INSERT INTO comments (id,task_id,user_id,text,time) VALUES (?,?,?,?,?)').run(id, req.params.id, req.user.id, text, now);
  res.json({ id, task_id: req.params.id, user_id: req.user.id, text, time: now });
});

// GET /api/tasks/logs — activity logs
router.get('/logs', auth, (req, res) => {
  const logs = db.prepare('SELECT * FROM activity_logs ORDER BY time DESC LIMIT 50').all();
  res.json(logs);
});

module.exports = router;
