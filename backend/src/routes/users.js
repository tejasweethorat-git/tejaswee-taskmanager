const router = require('express').Router();
const db = require('../db/init');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/users — all users (admin only)
router.get('/', auth, adminOnly, (req, res) => {
  const users = db.prepare('SELECT id,name,email,role,avatar,bio,joined FROM users').all();
  res.json(users);
});

// PUT /api/users/:id/role — change role (admin only)
router.put('/:id/role', auth, adminOnly, (req, res) => {
  const { role } = req.body;
  if (!['Admin','Member'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  db.prepare('UPDATE users SET role=? WHERE id=?').run(role, req.params.id);
  res.json({ message: 'Role updated' });
});

// DELETE /api/users/:id — remove member (admin only)
router.delete('/:id', auth, adminOnly, (req, res) => {
  if (req.params.id === req.user.id) return res.status(400).json({ error: 'Cannot remove yourself' });
  db.prepare('DELETE FROM users WHERE id=?').run(req.params.id);
  res.json({ message: 'User removed' });
});

module.exports = router;
