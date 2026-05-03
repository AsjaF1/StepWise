const router  = require('express').Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
  try {
    const { deckId, mode, score, total, seconds } = req.body;
    const { data, error } = await supabase
      .from('study_sessions')
      .insert({ user_id: req.userId, deck_id: deckId, mode, score, total, seconds })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/streak', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('created_at')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    const days = new Set(
      (data || []).map(s => new Date(s.created_at).toISOString().split('T')[0])
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (days.has(dateStr)) { streak++; }
      else if (i > 0) break;
    }

    res.json({ streak });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
