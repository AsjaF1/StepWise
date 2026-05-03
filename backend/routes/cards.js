const router  = require('express').Router();
const supabase = require('../config/supabase');

const toClient = r => r ? { ...r, _id: r.id } : null;

router.get('/deck/:deckId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', req.params.deckId)
      .eq('user_id', req.userId)
      .order('position', { ascending: true });
    if (error) throw error;
    res.json((data || []).map(toClient));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/deck/:deckId', async (req, res) => {
  try {
    const { term, definition, example, phonetic, emojis, parts, type } = req.body;

    const { count } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })
      .eq('deck_id', req.params.deckId);

    const { data: card, error: cardErr } = await supabase
      .from('cards')
      .insert({
        deck_id:    req.params.deckId,
        user_id:    req.userId,
        type:       type       || 'word',
        term:       term       || '',
        definition: definition || '',
        example:    example    || '',
        phonetic:   phonetic   || '',
        emojis:     emojis     || [],
        parts:      parts      || [],
        position:   count      || 0,
      })
      .select()
      .single();
    if (cardErr) throw cardErr;

    try { await supabase.rpc('increment_card_count', { deck_id_input: req.params.deckId }); } catch (_) {}

    res.status(201).json(toClient(card));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const allowed = ['term','definition','example','phonetic','emojis','parts','type','position'];
    const update  = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const { data, error } = await supabase
      .from('cards')
      .update(update)
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();
    if (error) return res.status(404).json({ error: 'Card not found' });
    res.json(toClient(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { data: card, error: findErr } = await supabase
      .from('cards')
      .select('deck_id')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();
    if (findErr) return res.status(404).json({ error: 'Card not found' });

    const { error: delErr } = await supabase
      .from('cards')
      .delete()
      .eq('id', req.params.id);
    if (delErr) throw delErr;

    try { await supabase.rpc('decrement_card_count', { deck_id_input: card.deck_id }); } catch (_) {}

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
