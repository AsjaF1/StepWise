const router   = require('express').Router();
const supabase  = require('../config/supabase');

const toClient = r => r ? { ...r, _id: r.id, cardCount: r.card_count ?? 0 } : null;

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json((data || []).map(toClient));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, theme, emoji, cards } = req.body;

    const { data: deck, error: deckErr } = await supabase
      .from('decks')
      .insert({ user_id: req.userId, name, theme: theme || 'amber', emoji: emoji || '📖', card_count: 0 })
      .select()
      .single();
    if (deckErr) throw deckErr;

    if (Array.isArray(cards) && cards.length) {
      const cardRows = cards.map((c, i) => ({
        deck_id:    deck.id,
        user_id:    req.userId,
        type:       c.type || 'word',
        term:       c.term || '',
        definition: c.definition || '',
        emojis:     c.emojis || [],
        parts:      c.parts  || [],
        position:   i,
      }));
      const { error: cardErr } = await supabase.from('cards').insert(cardRows);
      if (cardErr) throw cardErr;
      await supabase.from('decks').update({ card_count: cards.length }).eq('id', deck.id);
      deck.card_count = cards.length;
    }

    res.status(201).json(toClient(deck));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .single();
    if (error) return res.status(404).json({ error: 'Deck not found' });
    res.json(toClient(data));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, theme, emoji } = req.body;
    const { data, error } = await supabase
      .from('decks')
      .update({ name, theme, emoji })
      .eq('id', req.params.id)
      .eq('user_id', req.userId)
      .select()
      .single();
    if (error) return res.status(404).json({ error: 'Deck not found' });
    res.json(toClient(data));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('decks')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.userId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
