const router = require('express').Router();
const OpenAI = require('openai');

const MNEMONIC_PROMPT = `Create VERY SHORT mnemonic flashcards.

FORMAT (one blank line between cards):
Word
Meaning: brief definition (under 6 words)
1–2 sound chunks → associations
"Memory hook (<8 words)"
1-2 emojis

RULES:
- Extremely short
- Use 1 or 2 chunks (split word if helpful)
- Prefer natural splits (real words/sounds)
- No explanations or stories
- Easy to scan
- Plain text only

EXAMPLE:
Mundane
Meaning: boring, routine
MUN → moon, DAY → day
"same boring cycle daily"
🌙😐

Now do:
`;

function parseMnemonicResponse(text) {
  const blocks = text.trim().split(/\n[ \t]*\n+/).filter(b => b.trim());
  return blocks.map(block => {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return null;

    const term = lines[0];

    let meaning = '';
    let offset  = 1;
    if (lines[1] && /^meaning:/i.test(lines[1])) {
      meaning = lines[1].replace(/^meaning:\s*/i, '').trim();
      offset  = 2;
    }

    // Parse multiple chunks: "MUN → moon, DAY → day"
    const parts     = [];
    const soundLine = lines[offset] || '';
    soundLine.split(',').forEach(seg => {
      seg = seg.trim();
      const arrowIdx = seg.indexOf('→') !== -1 ? seg.indexOf('→')
                     : seg.indexOf('->') !== -1 ? seg.indexOf('->')
                     : -1;
      if (arrowIdx !== -1) {
        const chunk        = seg.slice(0, arrowIdx).trim();
        const soundMeaning = seg.slice(arrowIdx + 1).trim().replace(/^>\s*/, '');
        if (chunk) parts.push({ chunk, meaning: soundMeaning });
      }
    });

    const hook = (lines[offset + 1] || '')
      .replace(/^["„«"']/, '').replace(/["»"']$/, '').trim();

    const emojiLine = lines[offset + 2] || '';
    const emojis    = Array.from(emojiLine.matchAll(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu))
                        .map(m => m[0]);

    return term ? { term, meaning, parts, definition: hook, emojis: emojis.length ? emojis : ['📖'] } : null;
  }).filter(Boolean);
}

router.post('/generate', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'Text is required' });
    if (text.length > 4000)    return res.status(400).json({ error: 'Text too long (max 4000 chars)' });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      messages:    [
        { role: 'system', content: MNEMONIC_PROMPT },
        { role: 'user',   content: text.trim() },
      ],
      temperature: 0.7,
      max_tokens:  1024,
    });

    const generated = completion.choices[0].message.content.trim();
    console.log('ChatGPT raw response:\n', generated);

    const cards = parseMnemonicResponse(generated);
    if (!cards.length) throw new Error('Could not parse any cards. Raw: ' + generated.slice(0, 200));

    res.json({ cards });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
