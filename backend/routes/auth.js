const router        = require('express').Router();
const supabase      = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json({ token: data.session.access_token, user: data.user });
});

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username: username || '' } },
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ token: data.session?.access_token || null, user: data.user });
});

router.put('/profile', authMiddleware, async (req, res) => {
  const { username } = req.body;
  if (!username || username.trim().length < 2) return res.status(400).json({ error: 'Username must be at least 2 characters' });
  const { data, error } = await supabase.auth.admin.updateUserById(req.userId, {
    user_metadata: { username: username.trim() },
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ user: data.user });
});

module.exports = router;
