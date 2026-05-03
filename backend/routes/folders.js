const router  = require('express').Router();
const supabase = require('../config/supabase');

const toClient = r => r ? { ...r, _id: r.id, deckIds: r.deck_ids || [] } : null;

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json((data || []).map(toClient));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .insert({ user_id: req.userId, name: req.body.name, deck_ids: [] })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(toClient(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('folders')
      .update({ name: req.body.name })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();
    if (error) return res.status(404).json({ error: 'Folder not found' });
    res.json(toClient(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/decks', async (req, res) => {
  try {
    const { data: folder, error: findErr } = await supabase
      .from('folders')
      .select('deck_ids')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();
    if (findErr) return res.status(404).json({ error: 'Folder not found' });

    const ids = folder.deck_ids || [];
    if (!ids.includes(req.body.deckId)) ids.push(req.body.deckId);

    const { data, error } = await supabase
      .from('folders')
      .update({ deck_ids: ids })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(toClient(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id/decks/:deckId', async (req, res) => {
  try {
    const { data: folder, error: findErr } = await supabase
      .from('folders')
      .select('deck_ids')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();
    if (findErr) return res.status(404).json({ error: 'Folder not found' });

    const ids = (folder.deck_ids || []).filter(id => id !== req.params.deckId);

    const { data, error } = await supabase
      .from('folders')
      .update({ deck_ids: ids })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json(toClient(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
