const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/init');
const { auth } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { name, email, password, role = 'Member' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  const id = uuidv4();
  const avatar = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const hashed = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id,name,email,password,role,avatar,bio,joined) VALUES (?,?,?,?,?,?,?,?)').run(
    id, name, email, hashed, role, avatar, '', new Date().toISOString()
  );
  db.prepare('INSERT INTO activity_logs (id,user_id,action,time) VALUES (?,?,?,?)').run(
    uuidv4(), id, 'Signed up', new Date().toISOString()
  );
  const user = db.prepare('SELECT id,name,email,role,avatar,bio,joined FROM users WHERE id=?').get(id);
  res.json({ token: signToken(id), user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid email or password' });
  db.prepare('INSERT INTO activity_logs (id,user_id,action,time) VALUES (?,?,?,?)').run(
    uuidv4(), user.id, 'Logged in', new Date().toISOString()
  );
  const { password: _, ...safe } = user;
  res.json({ token: signToken(user.id), user: safe });
});

// GET /api/auth/me
router.get('/me', auth, (req, res) => {
  const { password: _, ...safe } = req.user;
  res.json(safe);
});

// PUT /api/auth/profile
router.put('/profile', auth, (req, res) => {
  const { name, email, bio } = req.body;
  db.prepare('UPDATE users SET name=?,email=?,bio=? WHERE id=?').run(name, email, bio, req.user.id);
  const updated = db.prepare('SELECT id,name,email,role,avatar,bio,joined FROM users WHERE id=?').get(req.user.id);
  res.json(updated);
});

// PUT /api/auth/password
router.put('/password', auth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!bcrypt.compareSync(oldPassword, req.user.password))
    return res.status(400).json({ error: 'Incorrect current password' });
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  db.prepare('UPDATE users SET password=? WHERE id=?').run(bcrypt.hashSync(newPassword, 10), req.user.id);
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;
