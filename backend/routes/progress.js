const router  = require('express').Router();
const supabase = require('../config/supabase');

router.put('/', async (req, res) => {
  try {
    const { cardId, status } = req.body;
    const { data, error } = await supabase
      .from('card_progress')
      .upsert(
        { user_id: req.userId, card_id: cardId, status, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,card_id' }
      )
      .select()
      .single();
    if (error) throw error;
    res.json({ cardId, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/deck/:deckId', async (req, res) => {
  try {
    const { data: cards, error: cardErr } = await supabase
      .from('cards')
      .select('id')
      .eq('deck_id', req.params.deckId)
      .eq('user_id', req.userId);
    if (cardErr) throw cardErr;

    const cardIds = (cards || []).map(c => c.id);
    if (!cardIds.length) return res.json([]);

    const { data: rows, error: progErr } = await supabase
      .from('card_progress')
      .select('card_id, status')
      .eq('user_id', req.userId)
      .in('card_id', cardIds);
    if (progErr) throw progErr;

    res.json((rows || []).map(r => ({ cardId: r.card_id, status: r.status })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
