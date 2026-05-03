/* ═══════════════════════════════════════════════════
   StepWise — app.js  (full-stack version)
   Data comes from Express + MongoDB; auth via Supabase
════════════════════════════════════════════════════ */

/* ── 1. STATIC CONFIG ────────────────────────────── */

const DECK_CONFIGS = {
  amber:      { bg: '#FFD166', accent: '#FFD166', ink: '#3A2B0A' },
  terracotta: { bg: '#FF6675', accent: '#FF6675', ink: '#3A1018' },
  honey:      { bg: '#F4A7B9', accent: '#F4A7B9', ink: '#462232' },
  clay:       { bg: '#7DD9A8', accent: '#7DD9A8', ink: '#153A2B' },
  rust:       { bg: '#578DDC', accent: '#578DDC', ink: '#142F56' },
  rose:       { bg: '#74B7E8', accent: '#74B7E8', ink: '#1F3B57' },
  /* legacy — kept so old saved decks still render */
  sage:       { bg: 'linear-gradient(135deg, #B8D4BA 0%, #89B08C 100%)', accent: '#3D6040', ink: '#0A1F0C' },
  lavender:   { bg: 'linear-gradient(135deg, #C8C2E4 0%, #A89CCE 100%)', accent: '#5A4A8A', ink: '#1A1530' },
  navy:       { bg: 'linear-gradient(135deg, #8ABDE0 0%, #4A8CB8 100%)', accent: '#2A7ABA', ink: '#0A1F2A' },
};

const EXPLORE_DECKS = [
  {
    _id: 'explore-en',
    name: 'English (B1/B2)',
    theme: 'amber',
    emoji: '☀️',
    category: 'vocabulary',
    tagLabel: 'Vocabulary', tagBg: '#FFF4DC', tagColor: '#9A6800',
    cards: [
      { _id: 'en-1', term: 'Mundane',        definition: 'Lacking interest or excitement',    type: 'mnemonic', parts: [{chunk:'MUN',meaning:'moon'},{chunk:'DAY',meaning:'day'}],                           example: 'same boring moon-day routine',          emojis: ['🌙','😐'] },
      { _id: 'en-2', term: 'Vicarious',      definition: 'Experienced through someone else',  type: 'mnemonic', parts: [{chunk:'VIC',meaning:'vicar'},{chunk:'AR',meaning:'are'}],                           example: 'living life through another person',    emojis: ['👤','✨'] },
      { _id: 'en-3', term: 'Ephemeral',      definition: 'Lasting a very short time',         type: 'mnemonic', parts: [{chunk:'EPH',meaning:'effect'},{chunk:'EMERAL',meaning:'emerald (shines briefly)'}], example: 'beautiful but gone in a moment',        emojis: ['💨','⏳'] },
      { _id: 'en-4', term: 'Sycophant',      definition: 'Insincere flatterer',               type: 'mnemonic', parts: [{chunk:'SYCO',meaning:'psycho'},{chunk:'PHANT',meaning:'fan'}],                      example: 'fake praise for attention',             emojis: ['🙄','🎭'] },
      { _id: 'en-5', term: 'Quintessential', definition: 'Perfect example of something',      type: 'mnemonic', parts: [{chunk:'QUINT',meaning:'five'},{chunk:'ESSENT',meaning:'essence'}],                  example: 'five-star perfect example',             emojis: ['⭐','🌟'] },
      { _id: 'en-6', term: 'Lethargy',       definition: 'Lack of energy or motivation',      type: 'mnemonic', parts: [{chunk:'LETH',meaning:'let'},{chunk:'ARGY',meaning:'energy'}],                       example: 'no energy, just "let it be"',           emojis: ['😴','⚡'] },
      { _id: 'en-7', term: 'Cacophony',      definition: 'Harsh mixture of sounds',           type: 'mnemonic', parts: [{chunk:'CACO',meaning:'chaotic'},{chunk:'PHONY',meaning:'phone/noise'}],             example: 'chaotic noise everywhere',             emojis: ['🔊','😖'] },
      { _id: 'en-8', term: 'Serendipity',    definition: 'Lucky accidental discovery',        type: 'mnemonic', parts: [{chunk:'SER',meaning:'serene'},{chunk:'DIPITY',meaning:'dip (fall into luck)'}],     example: 'happy surprise falling into luck',     emojis: ['🍀','🎉'] },
    ],
  },
  {
    _id: 'explore-med',
    name: 'Medicine',
    theme: 'rust',
    emoji: '🧠',
    category: 'medicine',
    tagLabel: 'Medicine', tagBg: '#EAF0FB', tagColor: '#1A3A6A',
    cards: [
      { _id: 'med-1', term: 'Diagnosis',      definition: 'Identification of a disease',              type: 'mnemonic', parts: [{chunk:'DIA',meaning:'diagram'},{chunk:'GNOSIS',meaning:'knowing'}],              example: "figuring out what's wrong",        emojis: ['🩺','📋'] },
      { _id: 'med-2', term: 'Symptom',        definition: 'Sign of a medical condition',              type: 'mnemonic', parts: [{chunk:'SYM',meaning:'sign'},{chunk:'PTOM',meaning:'problem'}],                    example: "body's warning signal",             emojis: ['🚨','🤒'] },
      { _id: 'med-3', term: 'Inflammation',   definition: "Body's response to injury or infection",   type: 'mnemonic', parts: [{chunk:'INFLAM',meaning:'flame inside'}],                                          example: 'body "on fire" response',           emojis: ['🔥','🩹'] },
      { _id: 'med-4', term: 'Antibiotic',     definition: 'Medicine that kills bacteria',             type: 'mnemonic', parts: [{chunk:'ANTI',meaning:'against'},{chunk:'BIO',meaning:'life'}],                    example: 'kills bad life inside',             emojis: ['🦠','💊'] },
      { _id: 'med-5', term: 'Immunity',       definition: "Body's ability to resist disease",         type: 'mnemonic', parts: [{chunk:'IM',meaning:'not'},{chunk:'MUNITY',meaning:'disease protection'}],         example: "body's shield system",             emojis: ['🛡️','🧬'] },
      { _id: 'med-6', term: 'Pathogen',       definition: 'Microorganism that causes disease',        type: 'mnemonic', parts: [{chunk:'PATHO',meaning:'path'},{chunk:'GEN',meaning:'generator'}],                 example: 'path of disease starter',           emojis: ['🦠','⚠️'] },
      { _id: 'med-7', term: 'Prescription',   definition: 'Written order for medicine',               type: 'mnemonic', parts: [{chunk:'PRE',meaning:'before'},{chunk:'SCRIPT',meaning:'written'}],               example: "doctor's written instruction",      emojis: ['📄','💊'] },
      { _id: 'med-8', term: 'Rehabilitation', definition: 'Recovery process after illness or injury', type: 'mnemonic', parts: [{chunk:'RE',meaning:'again'},{chunk:'HAB',meaning:'habit'}],                       example: 'getting body back again',           emojis: ['🏥','💪'] },
    ],
  },
  {
    _id: 'explore-art',
    name: 'Art',
    theme: 'honey',
    emoji: '🎨',
    category: 'arts',
    tagLabel: 'Arts', tagBg: '#FCF0F4', tagColor: '#6A1A30',
    cards: [
      { _id: 'art-1', term: 'Composition', definition: 'Arrangement of visual elements',        type: 'mnemonic', parts: [{chunk:'COM',meaning:'together'},{chunk:'POSITION',meaning:'placement'}],          example: 'how everything is placed',      emojis: ['🎨','🖼️'] },
      { _id: 'art-2', term: 'Contrast',    definition: 'Difference between light, color, or tone', type: 'mnemonic', parts: [{chunk:'CONTRA',meaning:'against'},{chunk:'AST',meaning:'sharp difference'}],  example: 'light vs dark effect',          emojis: ['⚫','⚪'] },
      { _id: 'art-3', term: 'Perspective', definition: 'Technique for creating depth',          type: 'mnemonic', parts: [{chunk:'PER',meaning:'through'},{chunk:'SPECTIVE',meaning:'seeing'}],              example: 'seeing depth in art',           emojis: ['👁️','📐'] },
      { _id: 'art-4', term: 'Proportion',  definition: 'Size relationship between parts',       type: 'mnemonic', parts: [{chunk:'PRO',meaning:'for'},{chunk:'PORTION',meaning:'part'}],                     example: 'right sizes together',          emojis: ['📏','🎨'] },
      { _id: 'art-5', term: 'Texture',     definition: 'Surface quality of an artwork',         type: 'mnemonic', parts: [{chunk:'TEX',meaning:'touch'},{chunk:'TURE',meaning:'surface'}],                   example: 'how it feels or looks',         emojis: ['👆','🖌️'] },
      { _id: 'art-6', term: 'Hue',         definition: 'Pure color in the spectrum',            type: 'mnemonic', parts: [{chunk:'HUE',meaning:'who/what color'}],                                           example: 'basic color identity',          emojis: ['🌈'] },
      { _id: 'art-7', term: 'Saturation',  definition: 'Intensity of a color',                  type: 'mnemonic', parts: [{chunk:'SAT',meaning:'full'},{chunk:'URATION',meaning:'color strength'}],          example: 'how strong the color is',       emojis: ['🎨','🔥'] },
      { _id: 'art-8', term: 'Balance',     definition: 'Visual stability in a composition',     type: 'mnemonic', parts: [{chunk:'BAL',meaning:'equal'},{chunk:'ANCE',meaning:'stability'}],                  example: 'everything feels stable',       emojis: ['⚖️','🖼️'] },
    ],
  },
  {
    _id: 'explore-tech',
    name: 'Technology',
    theme: 'clay',
    emoji: '💻',
    category: 'tech',
    tagLabel: 'Technology', tagBg: '#E8F5F0', tagColor: '#1A4A3A',
    cards: [
      { _id: 'tech-1', term: 'Algorithm',   definition: 'Step-by-step problem-solving method',   type: 'mnemonic', parts: [{chunk:'ALGO',meaning:'logic'},{chunk:'RITHM',meaning:'rhythm'}],                    example: 'logic steps in perfect rhythm',          emojis: ['🤖','🔁'] },
      { _id: 'tech-2', term: 'Database',    definition: 'Organized collection of data',           type: 'mnemonic', parts: [{chunk:'DATA',meaning:'data'},{chunk:'BASE',meaning:'base'}],                        example: 'base where data lives',                  emojis: ['💾','📊'] },
      { _id: 'tech-3', term: 'Encryption',  definition: 'Process of securing data',               type: 'mnemonic', parts: [{chunk:'EN',meaning:'in'},{chunk:'CRYPT',meaning:'hidden'}],                         example: 'data hidden inside code',                emojis: ['🔐','💻'] },
      { _id: 'tech-4', term: 'Interface',   definition: 'Point of user interaction',              type: 'mnemonic', parts: [{chunk:'INTER',meaning:'between'},{chunk:'FACE',meaning:'surface'}],                 example: 'where user meets system',                emojis: ['🖥️','👤'] },
      { _id: 'tech-5', term: 'Network',     definition: 'Connected system of devices',            type: 'mnemonic', parts: [{chunk:'NET',meaning:'net'},{chunk:'WORK',meaning:'work'}],                          example: 'devices working in a net',               emojis: ['🌐','🔗'] },
      { _id: 'tech-6', term: 'Compiler',    definition: 'Translates code into machine language',  type: 'mnemonic', parts: [{chunk:'COM',meaning:'together'},{chunk:'PILE',meaning:'stack'}],                    example: 'stacking code into machine form',        emojis: ['🧠','💻'] },
      { _id: 'tech-7', term: 'Cloud',       definition: 'Internet-based data storage',            type: 'mnemonic', parts: [{chunk:'CLOUD',meaning:'sky storage'}],                                             example: 'data floating in the sky',               emojis: ['☁️','💾'] },
      { _id: 'tech-8', term: 'Firewall',    definition: 'System that blocks unauthorized access', type: 'mnemonic', parts: [{chunk:'FIRE',meaning:'fire'},{chunk:'WALL',meaning:'wall'}],                        example: 'wall protecting from attacks',           emojis: ['🔥','🧱'] },
    ],
  },
  {
    _id: 'explore-psy',
    name: 'Psychology',
    theme: 'terracotta',
    emoji: '🧠',
    category: 'psychology',
    tagLabel: 'Psychology', tagBg: '#FAEEE9', tagColor: '#7A2E14',
    cards: [
      { _id: 'psy-1', term: 'Cognition',    definition: 'Mental process of understanding',  type: 'mnemonic', parts: [{chunk:'COG',meaning:'think'},{chunk:'NITION',meaning:'knowing'}],                    example: 'thinking and knowing mind',      emojis: ['🧠','💡'] },
      { _id: 'psy-2', term: 'Perception',   definition: 'How we interpret information',     type: 'mnemonic', parts: [{chunk:'PER',meaning:'through'},{chunk:'CEPTION',meaning:'seeing'}],                  example: 'seeing the world your way',      emojis: ['👁️','🌍'] },
      { _id: 'psy-3', term: 'Emotion',      definition: 'Feeling response',                 type: 'mnemonic', parts: [{chunk:'E',meaning:'energy'},{chunk:'MOTION',meaning:'movement'}],                    example: 'energy moving inside',           emojis: ['❤️','⚡'] },
      { _id: 'psy-4', term: 'Behavior',     definition: 'Way a person acts',                type: 'mnemonic', parts: [{chunk:'BE',meaning:'be'},{chunk:'HAVIOR',meaning:'acting'}],                          example: 'how you act daily',              emojis: ['🚶‍♂️','🎭'] },
      { _id: 'psy-5', term: 'Memory',       definition: 'Ability to store information',     type: 'mnemonic', parts: [{chunk:'MEM',meaning:'mind'},{chunk:'ORY',meaning:'store'}],                           example: "mind's storage system",          emojis: ['🧠','📦'] },
      { _id: 'psy-6', term: 'Motivation',   definition: 'Reason for doing something',       type: 'mnemonic', parts: [{chunk:'MOTIVE',meaning:'reason'},{chunk:'ACTION',meaning:'act'}],                    example: 'reason that drives action',      emojis: ['🚀','🔥'] },
      { _id: 'psy-7', term: 'Anxiety',      definition: 'Feeling of worry or fear',         type: 'mnemonic', parts: [{chunk:'ANX',meaning:'anxious'},{chunk:'IETY',meaning:'state'}],                       example: 'constant worry feeling',         emojis: ['😰','💭'] },
      { _id: 'psy-8', term: 'Personality',  definition: 'Character traits of a person',     type: 'mnemonic', parts: [{chunk:'PERSON',meaning:'person'},{chunk:'ALITY',meaning:'traits'}],                   example: 'what makes you you',             emojis: ['🧍‍♂️','✨'] },
    ],
  },
  {
    _id: 'explore-geo',
    name: 'Geography',
    theme: 'rose',
    emoji: '🌍',
    category: 'geography',
    tagLabel: 'Geography', tagBg: '#EAF4FB', tagColor: '#1A3A5A',
    cards: [
      { _id: 'geo-1', term: 'Continent',   definition: 'Large landmass',                      type: 'mnemonic', parts: [{chunk:'CONTI',meaning:'continuous'},{chunk:'NENT',meaning:'land'}],                  example: 'huge continuous land',           emojis: ['🌍','🗺️'] },
      { _id: 'geo-2', term: 'Climate',     definition: 'Weather conditions over time',         type: 'mnemonic', parts: [{chunk:'CLI',meaning:'clear'},{chunk:'MATE',meaning:'condition'}],                   example: 'long-term weather pattern',      emojis: ['🌦️','📅'] },
      { _id: 'geo-3', term: 'Ecosystem',   definition: 'Community of living organisms',        type: 'mnemonic', parts: [{chunk:'ECO',meaning:'environment'},{chunk:'SYSTEM',meaning:'system'}],              example: 'nature working together',        emojis: ['🌱','🦋'] },
      { _id: 'geo-4', term: 'Latitude',    definition: 'Distance north or south',              type: 'mnemonic', parts: [{chunk:'LAT',meaning:'flat'},{chunk:'ITUDE',meaning:'position'}],                    example: 'lines across the earth',         emojis: ['🌍','📏'] },
      { _id: 'geo-5', term: 'Longitude',   definition: 'Distance east or west',                type: 'mnemonic', parts: [{chunk:'LONG',meaning:'long'},{chunk:'ITUDE',meaning:'position'}],                   example: 'long lines around earth',        emojis: ['🌍','🧭'] },
      { _id: 'geo-6', term: 'Population',  definition: 'Number of people in area',             type: 'mnemonic', parts: [{chunk:'POP',meaning:'people'},{chunk:'ULATION',meaning:'group'}],                   example: 'group of people count',          emojis: ['👥','📊'] },
      { _id: 'geo-7', term: 'Urban',       definition: 'Related to a city',                    type: 'mnemonic', parts: [{chunk:'URB',meaning:'city'}],                                                        example: 'city life fast pace',            emojis: ['🏙️','⚡'] },
      { _id: 'geo-8', term: 'Rural',       definition: 'Countryside area',                     type: 'mnemonic', parts: [{chunk:'RUR',meaning:'roots'},{chunk:'AL',meaning:'area'}],                          example: 'quiet life in nature',           emojis: ['🌾','🌄'] },
    ],
  },
];

const EMOJI_DATA = {
  study:   ['📖','📚','📝','✏️','🖊️','📓','📒','📔','📕','📗','📘','📙','🗒️','📐','📏','🔖','📌','🗂️','📊','📈','📉','🧮','🎓','🏫','💡','🔍','🔎'],
  nature:  ['🌿','🌱','🌳','🌲','🍀','🌸','🌺','🌻','🌹','🌷','🍃','🍂','🍁','🌾','🌵','🎋','🎍','🌊','🌈','☀️','🌙','⭐','🌍','🌎','🌏','🐾','🦋','🐝','🌿'],
  work:    ['💼','📋','🗃️','📁','📂','🗄️','💻','🖥️','⌨️','🖱️','📱','☎️','📞','📟','📠','🔧','🔨','⚙️','🔩','🏗️','🏢','🤝','📊','💰','💳','🏦','📈'],
  science: ['🔬','🔭','🧪','🧫','🧬','⚗️','🧲','💊','🩺','🏥','🧠','⚡','🔋','💡','☢️','⚛️','🌡️','🧊','🔥','💧','🌊','🌪️','🧯','🦠','🔵','🟢','🔴'],
  art:     ['🎨','🖌️','🖼️','🎭','🎬','🎤','🎵','🎶','🎸','🎹','🥁','🎺','🎻','🎷','🎮','🕹️','🎲','🃏','🎯','🎪','🎠','🎡','🎢','🏆','🥇','🥈','🥉'],
  travel:  ['✈️','🚀','🛸','🚁','⛵','🚢','🚂','🚃','🚄','🚅','🚇','🚌','🚎','🏎️','🚓','🚑','🚒','🛻','🏍️','🛵','🚲','🛴','🛺','🗺️','🧭','🏔️','🗽','🗼','🏰','🏯','⛩️','🌁'],
  food:    ['🍎','🍊','🍋','🍇','🍓','🫐','🍑','🍒','🍌','🍉','🥭','🍍','🥥','🫒','🍅','🥑','🌽','🌶️','🥕','🧅','🧄','🥔','🍞','🧀','🥚','🍳','🥞','🧇','🍕','🍔','🌮','🍜'],
  symbols: ['⭐','🌟','💫','✨','❤️','🧡','💛','💚','💙','💜','🖤','🤍','💯','✅','❌','⚡','🔥','💧','🌊','🎯','🔑','🗝️','🔐','🔒','💎','👑','🏅','🎖️','🎗️'],
  faces:   ['😊','😄','😃','😀','🥰','😍','🤩','😎','🧐','🤓','😏','😌','🥳','🤗','😇','🙃','😶','🤔','🤫','🤭','🧏','👏','🙌','👍','✌️','🤞','🫶','❤️'],
};

/* ── 2. APP STATE ────────────────────────────────── */

let _allDecks        = [];
let _allFolders      = [];
let _currentDeckId   = null;
let _currentDeckCards = [];
let _cardProgressMap  = {};      // { cardId: { cardId, status } }
let _mcQuestions     = [];
let _memoryPairs     = [];
let _currentFolderId  = null;
let _currentFolderName = '';
let _pendingFolderId  = null;    // set when "create deck inside folder" flow
let _pendingDelete    = null;
let _currentDeckColor = 'amber';
let _ctxTarget        = null;
let _isExploreDeck    = false;

/* ── 3. UTILITIES ────────────────────────────────── */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

let _toastTimer = null;
function showToast(msg, duration) {
  duration = duration || 2200;
  const t = document.getElementById('stepwise-toast');
  t.textContent = msg;
  t.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), duration);
}

function _closeCtxMenu() {
  const m = document.getElementById('ctx-menu');
  if (m) m.classList.remove('open');
  _ctxTarget = null;
}

function _escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── 4. DATA BUILDERS ────────────────────────────── */

function _buildMCQuestions(cards) {
  const withDef = cards.filter(c => c.definition);
  if (withDef.length < 4) return [];
  const defs = withDef.map(c => c.definition);
  return withDef.slice(0, Math.min(withDef.length, 8)).map(c => {
    const wrong = defs.filter(d => d !== c.definition).sort(() => Math.random() - 0.5).slice(0, 3);
    if (wrong.length < 3) return null;
    return {
      word:    c.term,
      parts:   (c.parts || []).map(p => [p.chunk || '', p.meaning || '']),
      correct: c.definition,
      wrong,
    };
  }).filter(Boolean);
}

function _buildMemoryPairs(cards) {
  return cards.slice(0, 8).map(c => ({
    id:      String(c._id),
    term:    c.term,
    emoji:   (c.emojis && c.emojis[0]) || '📖',
    meaning: c.definition || c.term,
  }));
}

/* ── 5. RENDER HELPERS ───────────────────────────── */

function _renderDeckGrid() {
  const grid = document.getElementById('md-sets-grid');
  if (!grid) return;
  grid.innerHTML = '';

  _allDecks.forEach((deck, i) => {
    const cfg = DECK_CONFIGS[deck.theme] || DECK_CONFIGS.amber;
    const card = document.createElement('div');
    card.className = 'md-set-card';
    card.dataset.action = 'showDeck';
    card.dataset.arg1   = deck._id;
    card.dataset.arg2   = deck.name;
    card.dataset.name   = deck.name;
    card.dataset.order  = i;
    card.innerHTML = `
      <div class="md-set-banner" style="background:${cfg.bg}">
        <div class="md-set-emoji">${_escHtml(deck.emoji || '📖')}</div>
      </div>
      <div class="md-set-body">
        <div class="md-set-name">${_escHtml(deck.name)}</div>
        <div class="md-set-meta">${deck.cardCount || 0} card${deck.cardCount !== 1 ? 's' : ''}</div>
        <div class="md-set-prog-row">
          <div class="md-set-prog-bg">
            <div class="md-set-prog-fill" style="width:0%;background:${cfg.accent}"></div>
          </div>
          <div class="md-set-prog-pct">0%</div>
        </div>
        <div class="md-set-tags">
          <span class="md-set-tag" style="background:#EAF3EB;color:#2E5430;">Active</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'md-add-card';
  addBtn.dataset.action = 'showCreateDeck';
  addBtn.innerHTML = '<div class="md-add-icon">＋</div><div class="md-add-label">New Deck</div>';
  grid.appendChild(addBtn);
}

function _renderFolderList() {
  const list = document.getElementById('folder-list');
  if (!list) return;
  const addBtn = list.querySelector('.md-folder-add');
  list.innerHTML = '';

  _allFolders.forEach(folder => {
    const count = (folder.deckIds || []).length;
    const chip = document.createElement('div');
    chip.className = 'md-folder';
    chip.dataset.action   = 'openFolder';
    chip.dataset.folderId = folder._id;
    chip.innerHTML = `
      <span class="folder-icon">📁</span>
      <span class="folder-name">${_escHtml(folder.name)}</span>
      <span class="folder-count">${count} set${count !== 1 ? 's' : ''}</span>
    `;
    list.appendChild(chip);
  });

  if (addBtn) {
    list.appendChild(addBtn);
  } else {
    const newBtn = document.createElement('div');
    newBtn.className = 'md-folder md-folder-add';
    newBtn.dataset.action = 'showNewFolderInput';
    newBtn.innerHTML = '<span class="folder-icon">＋</span><span class="folder-name">New Folder</span>';
    list.appendChild(newBtn);
  }
}

function _renderWordList() {
  const list = document.getElementById('word-list');
  if (!list) return;
  list.innerHTML = '';

  _currentDeckCards.forEach(c => {
    const status     = _cardProgressMap[String(c._id)]?.status || 'new';
    const emojiStr   = (c.emojis && c.emojis.length) ? c.emojis[0] : '✦';
    const partsHtml  = c.parts && c.parts.length
      ? `<div class="wr-parts">${c.parts.map(p => `<span class="wr-part-pill"><strong>${_escHtml(p.chunk)}</strong> → ${_escHtml(p.meaning)}</span>`).join('')}</div>`
      : '';
    const badgeLabel = status === 'new' ? 'New' : status === 'review' ? 'Learning' : '';

    const row = document.createElement('div');
    row.className = 'word-row';
    row.id = 'wr-' + c._id;
    row.dataset.action = 'toggleWord';
    row.dataset.arg1   = c._id;
    row.innerHTML = `
      <span class="wr-emoji">${emojiStr}</span>
      <div class="wr-main">
        <div class="wr-top">
          <span class="wr-word">${_escHtml(c.term)}</span>
          ${c.phonetic ? `<span class="wr-phonetic">${_escHtml(c.phonetic)}</span>` : ''}
        </div>
        ${partsHtml}
      </div>
      ${badgeLabel ? `<span class="wr-status badge-${status}">${badgeLabel}</span>` : ''}
      ${_isExploreDeck ? '' : `<button class="wr-delete" data-action="deleteCard" data-arg1="${c._id}" title="Delete">✕</button>`}
    `;

    const isMnemonic  = c.type === 'mnemonic';
    const emojiDisplay = (c.emojis && c.emojis.length > 1) ? c.emojis.join('') : emojiStr;
    const contextHtml  = c.example
      ? `<div class="wd-context">
           <div class="wd-section-label">${isMnemonic ? 'Memory hook' : 'In context'}</div>
           <p class="wd-example">${_escHtml(c.example)}${isMnemonic ? ' ' + emojiDisplay : ''}</p>
         </div>`
      : '';

    const detail = document.createElement('div');
    detail.className = 'word-detail';
    detail.id = 'wd-' + c._id;
    detail.innerHTML = `
      <div class="wd-meaning">
        <div class="wd-accent-bar"></div>
        <div>
          <div class="wd-section-label">Meaning</div>
          <p class="wd-definition">${_escHtml(c.definition || '—')}</p>
        </div>
      </div>
      ${contextHtml}
      <div class="wd-actions">
        ${_isExploreDeck ? '' : `<button class="wd-btn" data-action="editCard" data-arg1="${c._id}">✏️ Edit</button>`}
        <button class="wd-btn" data-action="markCard" data-arg1="${c._id}" data-arg2="mastered">✓ Know it</button>
        <button class="wd-btn" data-action="markCard" data-arg1="${c._id}" data-arg2="review">Still learning</button>
      </div>
    `;

    list.appendChild(row);
    list.appendChild(detail);
  });

  if (!_isExploreDeck) {
    const addBtn = document.createElement('div');
    addBtn.className = 'md-add-card';
    addBtn.dataset.action = 'addInlineCard';
    addBtn.style.cssText = 'margin:10px 0;min-height:80px;width:100%;max-width:none;';
    addBtn.innerHTML = '<div class="md-add-icon" style="width:32px;height:32px;font-size:18px;">＋</div><div class="md-add-label" style="font-size:12px;">Add Card</div>';
    list.appendChild(addBtn);
  }
}

/* ── 6. ROUTER ───────────────────────────────────── */

const STANDARD_VIEWS = ['app-home','deck-view','my-decks-view','goal-view','create-deck-view','create-cards-view','folder-view'];
const FULL_VIEWS     = ['explore-view','account-view'];
const OVERLAY_VIEWS  = ['study-view','memory-view','mc-view'];

function hideAll() {
  [...STANDARD_VIEWS, ...FULL_VIEWS, ...OVERLAY_VIEWS].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

function _setLayout(mode) {
  const shell = document.getElementById('content-shell');
  const rp    = document.getElementById('right-panel');
  if (mode === 'full') {
    shell.classList.add('is-hidden');
  } else {
    shell.classList.remove('is-hidden');
    shell.dataset.layout = (mode === 'three-col') ? 'three-col' : 'two-col';
    rp.classList.toggle('is-hidden', mode !== 'three-col');
  }
}

function _setRightPanel(section) {
  const home = document.getElementById('rp-home');
  const goal = document.getElementById('rp-goal');
  if (home) home.classList.toggle('active', section === 'home');
  if (goal) goal.classList.toggle('active', section === 'goal');
}

function _showView(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function _setNavActive(label) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === label);
  });
}

async function showHome() {
  await showMyDecks();
  _setNavActive('home');
}

async function showMyDecks() {
  hideAll();
  _setLayout('two-col');
  _showView('my-decks-view');
  _setNavActive('decks');
  setTimeout(_resetSidebar, 0);

  try {
    const [decks, folders] = await Promise.all([
      window.Api.decks.list(),
      window.Api.folders.list(),
    ]);
    _allDecks   = decks;
    _allFolders = folders;
    _renderDeckGrid();
    _renderFolderList();
  } catch (err) {
    showToast('Failed to load decks');
  }
}

function showGoal() {
  hideAll();
  _setLayout('three-col');
  _setRightPanel('goal');
  _showView('goal-view');
}

function showCreateDeck() {
  hideAll();
  _setLayout('two-col');
  _showView('create-deck-view');
  setTimeout(initEmojiKeyboard, 50);

  const card      = document.getElementById('cdv-preview-card');
  const drawer    = document.getElementById('cdv-name-drawer');
  const nameEl    = document.getElementById('preview-name');
  const tapBadge  = document.getElementById('cdv-tap-badge');
  const doneBtn   = document.getElementById('cdv-name-done');
  const nameInput = document.getElementById('cdv-name-input');
  if (card)      { card.style.background = 'linear-gradient(135deg,#FFF1B8,#FFD166)'; card.classList.remove('name-open','named'); }
  if (drawer)    drawer.classList.remove('open');
  if (nameEl)    { nameEl.textContent = 'Tap to name your deck'; nameEl.classList.remove('has-value'); }
  if (tapBadge)  tapBadge.style.display = '';
  if (doneBtn)   doneBtn.style.display = 'none';
  if (nameInput) nameInput.value = '';

  document.querySelectorAll('.color-swatch').forEach((s, i) => s.classList.toggle('selected', i === 0));
  document.querySelectorAll('.cdv-settings-panel .emoji-quick').forEach((b, i) => b.classList.toggle('selected', i === 0));
  const iconEl = document.getElementById('preview-icon');
  if (iconEl) iconEl.textContent = '📖';

  document.querySelectorAll('.imb-opt').forEach(o => o.classList.remove('selected','selected-sage','selected-lav'));
  const notesOpt = document.querySelector('.imb-opt[data-arg1="notes"]');
  if (notesOpt) notesOpt.classList.add('selected');
  document.querySelectorAll('.method-panel').forEach(p => p.classList.remove('active'));
  const notesPanel = document.getElementById('panel-notes');
  if (notesPanel) notesPanel.classList.add('active');

  const textarea = document.querySelector('.notes-paste-area');
  if (textarea) textarea.value = '';
  document.querySelectorAll('.sep-btn').forEach((b, i) => b.classList.toggle('selected', i === 0));
  _currentSep = '-';
  const customForm = document.getElementById('custom-sep-form');
  if (customForm) customForm.style.display = 'none';

  const list = document.getElementById('card-editor-list');
  if (list) { list.innerHTML = ''; _appendBlankCardRow(list, true); }
}

function showCreateCards() {
  hideAll();
  _setLayout('two-col');
  _showView('create-cards-view');
}


function _renderExploreGrid() {
  const grid = document.getElementById('ex-sets-grid');
  if (!grid) return;
  grid.innerHTML = '';
  EXPLORE_DECKS.forEach((deck, i) => {
    const cfg  = DECK_CONFIGS[deck.theme] || DECK_CONFIGS.amber;
    const card = document.createElement('div');
    card.className        = 'explore-card';
    card.dataset.action   = 'showExploreDeck';
    card.dataset.arg1     = deck._id;
    card.dataset.name     = deck.name;
    card.dataset.order    = i;
    card.dataset.category = deck.category || 'all';
    card.innerHTML = `
      <div class="explore-card-banner" style="background:${cfg.bg}">
        <div class="explore-card-emoji">${deck.emoji || '📖'}</div>
      </div>
      <div class="explore-card-body">
        <div class="explore-card-name">${_escHtml(deck.name)}</div>
        <div class="explore-card-meta">by StepWise</div>
        <div class="explore-card-tags">
          <span class="explore-card-tag" style="background:${deck.tagBg};color:${deck.tagColor};">${deck.tagLabel}</span>
          <span class="explore-card-count">📇 ${deck.cards.length} cards</span>
          <span class="explore-card-tag" style="background:#EAF3EB;color:#2E5430;">✦ Official</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterExplore(cat) {
  document.querySelectorAll('#explore-filters .explore-filter').forEach(b => {
    b.classList.toggle('active', b.dataset.arg1 === cat);
  });
  document.querySelectorAll('#ex-sets-grid .explore-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.category === cat) ? '' : 'none';
  });
}

let _exploreSortDir = null;
function sortExploreSets(dir) {
  _exploreSortDir = (_exploreSortDir === dir) ? null : dir;
  document.querySelectorAll('[data-action="sortExploreSets"]').forEach(b => {
    b.classList.toggle('active', b.dataset.arg1 === _exploreSortDir);
  });
  const grid  = document.getElementById('ex-sets-grid');
  const cards = [...grid.querySelectorAll('.explore-card')];
  if (_exploreSortDir) {
    cards.sort((a, b) => { const cmp = a.dataset.name.localeCompare(b.dataset.name, undefined, {sensitivity:'base'}); return _exploreSortDir === 'asc' ? cmp : -cmp; });
  } else {
    cards.sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));
  }
  cards.forEach(c => grid.appendChild(c));
}

function showExplore() {
  hideAll();
  _setLayout('full');
  _showView('explore-view');
  _setNavActive('explore');
  _renderExploreGrid();
}

function showExploreDeck(deckId) {
  const deck = EXPLORE_DECKS.find(d => d._id === deckId);
  if (!deck) return;

  _isExploreDeck    = true;
  _currentDeckId    = deckId;
  _currentDeckColor = deck.theme || 'amber';
  _currentDeckCards = deck.cards;
  _cardProgressMap  = {};

  const cfg  = DECK_CONFIGS[_currentDeckColor] || DECK_CONFIGS.amber;
  const hero = document.getElementById('deck-hero-bg');
  if (hero) {
    hero.style.background = cfg.bg;
    hero.style.color = cfg.ink;
    hero.querySelectorAll('.dv-label, .dv-desc, .dhs-label, .dv-stat-sep').forEach(el => el.style.color = cfg.ink);
  }

  const titleEl   = document.getElementById('deck-hero-title');
  const bcInner   = document.getElementById('deck-breadcrumb-inner');
  const deleteBtn = document.getElementById('deck-delete-btn');
  const renameBtn = document.querySelector('[data-action="renameDeck"]');
  const backBtn   = document.querySelector('#deck-view .back-btn');

  if (titleEl)   titleEl.textContent = deck.name;
  if (bcInner)   bcInner.textContent = 'Explore · ' + deck.name;
  if (deleteBtn) deleteBtn.style.display = 'none';
  if (renameBtn) renameBtn.style.display = 'none';
  if (backBtn)   { backBtn.textContent = '← Explore'; backBtn.dataset.action = 'showExplore'; }

  hideAll();
  _setLayout('two-col');
  _showView('deck-view');
  _renderWordList();
}

function showAccount() {
  hideAll();
  _setLayout('full');
  _showView('account-view');

  /* Reset profile section to active, reset nav */
  const accView = document.getElementById('account-view');
  accView.querySelectorAll('.acc-section').forEach(s => s.classList.remove('active'));
  document.getElementById('acc-profile')?.classList.add('active');
  accView.querySelectorAll('.acc-nav-item').forEach(n => n.classList.remove('active'));
  accView.querySelector('.acc-nav-item[data-arg1="profile"]')?.classList.add('active');

  /* Load streak into stats section */
  window.Api.sessions.streak().then(({ streak }) => {
    const badge = document.querySelector('.streak-badge');
    if (badge) badge.textContent = streak > 0 ? `🔥 ${streak}-day streak` : '🔥 Start your streak!';
    const statEl = document.getElementById('acc-stat-streak');
    if (statEl) statEl.textContent = streak > 0 ? `🔥 ${streak}` : '🔥 0';
  }).catch(() => {});
}

function saveProfile() {
  const input = document.getElementById('acc-input-username');
  if (!input) return;
  const newUsername = input.value.trim();
  if (!newUsername) { showToast('Username cannot be empty'); return; }
  const el = id => document.getElementById(id);
  const initials = _getInitials(newUsername);
  if (el('acc-avatar-large'))   el('acc-avatar-large').textContent   = initials;
  if (el('acc-avatar-edit'))    el('acc-avatar-edit').textContent    = initials;
  if (el('acc-name-display'))   el('acc-name-display').textContent   = newUsername;
  if (el('acc-display-name'))   el('acc-display-name').textContent   = newUsername;
  if (el('acc-handle-display')) el('acc-handle-display').textContent = '@' + newUsername.toLowerCase().replace(/\s+/g,'') + ' · Free plan';
  if (el('nav-avatar'))         el('nav-avatar').textContent         = initials;
  if (el('md-welcome-name'))    el('md-welcome-name').textContent    = newUsername;
  showToast('✓ Username saved');
}

async function showDeck(deckId, deckName) {
  _isExploreDeck = false;
  const deck = _allDecks.find(d => String(d._id) === String(deckId));
  _currentDeckId    = deckId;
  _currentDeckColor = deck?.theme || 'amber';
  const deleteBtn = document.getElementById('deck-delete-btn');
  const renameBtn = document.querySelector('[data-action="renameDeck"]');
  const backBtn   = document.querySelector('#deck-view .back-btn');
  if (deleteBtn) deleteBtn.style.display = '';
  if (renameBtn) renameBtn.style.display = '';
  if (backBtn)   { backBtn.textContent = '← My Decks'; backBtn.dataset.action = 'showMyDecks'; }

  const cfg  = DECK_CONFIGS[_currentDeckColor] || DECK_CONFIGS.amber;
  const hero = document.getElementById('deck-hero-bg');
  if (hero) {
    hero.style.background = cfg.bg;
    hero.style.color = cfg.ink;
    hero.querySelectorAll('.dv-label, .dv-desc, .dhs-label, .dv-stat-sep').forEach(el => el.style.color = cfg.ink);
  }

  const name    = deckName || deck?.name || 'Deck';
  const titleEl = document.getElementById('deck-hero-title');
  const bcInner = document.getElementById('deck-breadcrumb-inner');
  const deckDeleteBtn = document.getElementById('deck-delete-btn');
  if (deckDeleteBtn) {
    deckDeleteBtn.dataset.arg1 = deckId;
    deckDeleteBtn.dataset.arg2 = 'deck';
  }
  if (titleEl) titleEl.textContent = name;
  if (bcInner) bcInner.textContent = 'My Decks · ' + name;

  hideAll();
  _setLayout('two-col');
  _showView('deck-view');

  try {
    const [cards, progressList] = await Promise.all([
      window.Api.cards.list(deckId),
      window.Api.progress.forDeck(deckId),
    ]);
    _currentDeckCards = cards;
    _cardProgressMap  = {};
    progressList.forEach(p => { _cardProgressMap[String(p.cardId)] = p; });
  } catch (err) {
    showToast('Failed to load cards');
    _currentDeckCards = [];
    _cardProgressMap  = {};
  }
  _renderWordList();
}

function showStudy() {
  if (!_currentDeckCards.length) {
    showToast('Open a deck first to study');
    return;
  }
  const wasActive = STANDARD_VIEWS.find(id => document.getElementById(id)?.classList.contains('active'));
  window._prevView = wasActive || null;
  hideAll();
  _showView('study-view');
  currentCard  = 0;
  isFlipped    = false;
  _studyKnew   = 0;
  _studyForgot = 0;
  const congrats = document.getElementById('study-congrats');
  if (congrats) congrats.style.display = 'none';
  const wrap = document.getElementById('fc-wrap');
  if (wrap) { wrap.style.transition = 'none'; wrap.style.transform = ''; wrap.style.opacity = '1'; wrap.style.display = ''; }
  const hint = document.getElementById('fc-hint');
  if (hint) hint.style.display = '';
  const dots = document.getElementById('fc-dots');
  if (dots) dots.style.display = 'flex';
  const actionRow = document.getElementById('fc-action-row');
  if (actionRow) { actionRow.style.display = 'flex'; actionRow.style.opacity = '0'; actionRow.style.pointerEvents = 'none'; }
  loadCard(currentCard);
}

function exitStudy() {
  document.getElementById('study-view').classList.remove('active');
  isFlipped = false;
  if (window._prevView) {
    _setLayout('two-col');
    document.getElementById(window._prevView).classList.add('active');
  } else {
    showMyDecks();
  }
}

function showMemory() {
  if (!_currentDeckCards.length) { showToast('Open a deck first'); return; }
  const wasActive = STANDARD_VIEWS.find(id => document.getElementById(id)?.classList.contains('active'));
  window._prevView = wasActive || null;
  hideAll();
  _showView('memory-view');
  initMemory();
}

function exitMemory() {
  document.getElementById('memory-view').classList.remove('active');
  if (window._prevView) {
    _setLayout('two-col');
    document.getElementById(window._prevView).classList.add('active');
  } else {
    showMyDecks();
  }
}

function showMultipleChoice() {
  if (!_currentDeckCards.length) { showToast('Open a deck first'); return; }
  const wasActive = STANDARD_VIEWS.find(id => document.getElementById(id)?.classList.contains('active'));
  window._prevView = wasActive || null;
  hideAll();
  _showView('mc-view');
  initMC();
}

function exitMC() {
  clearInterval(mcTimerInterval);
  document.getElementById('mc-view').classList.remove('active');
  if (window._prevView) {
    _setLayout('two-col');
    document.getElementById(window._prevView).classList.add('active');
  } else {
    showMyDecks();
  }
}

/* ── 7. FLASHCARD STUDY MODE ─────────────────────── */

let currentCard  = 0;
let isFlipped    = false;
let _studyKnew   = 0;
let _studyForgot = 0;

function loadCard(idx) {
  const raw = _currentDeckCards[idx];
  if (!raw) return;
  // normalise to the shape the template expects
  const c = {
    ...raw,
    emoji:        raw.emojis && raw.emojis.length ? raw.emojis : ['📖'],
    word:         raw.term,
    parts:        (raw.parts || []).map(p => [p.chunk || '', p.meaning || '']),
    status:       _cardProgressMap[String(raw._id)]?.status || 'new',
    mnemonicItems: raw.mnemonicItems || [],
  };

  isFlipped = false;
  const inner = document.getElementById('fc-inner');
  inner.style.transition = 'none';
  inner.style.transform  = 'rotateY(0deg)';

  document.getElementById('fc-front-emoji').textContent = c.emoji.join(' ');
  document.getElementById('fc-front-word').textContent  = c.word;
  document.getElementById('fc-front-phonetic').textContent = c.phonetic || '';
  document.getElementById('fc-front-phonetic').style.display = c.phonetic ? 'block' : 'none';
  document.getElementById('fc-front-divider').style.display = c.parts.length ? 'block' : 'none';

  const partsEl = document.getElementById('fc-front-parts');
  if (c.parts.length) {
    partsEl.style.display = 'flex';
    partsEl.innerHTML = c.parts.map(([k, v]) =>
      `<div class="fc-part-row"><span class="fc-part-key">${k}</span><span class="fc-part-val">→ ${v}</span></div>`
    ).join('');
  } else {
    partsEl.style.display = 'none';
  }

  const typeLabel = document.getElementById('fc-type-label');
  if (c.type === 'mnemonic') {
    typeLabel.textContent = 'Mnemonic';
    typeLabel.style.display = 'inline-block';
  } else {
    typeLabel.style.display = 'none';
  }

  document.getElementById('fc-back-emoji').textContent   = c.emoji.join(' ');
  document.getElementById('fc-back-word').textContent    = c.word;
  document.getElementById('fc-back-def').textContent     = c.definition || '';
  document.getElementById('fc-back-example').textContent = c.example    || '';

  const mnemonicBack = document.getElementById('fc-back-mnemonic');
  const standardBack = document.getElementById('fc-back-standard');
  if (c.type === 'mnemonic' && c.mnemonicItems.length) {
    standardBack.style.display = 'none';
    mnemonicBack.style.display = 'flex';
    mnemonicBack.innerHTML = c.mnemonicItems.map((item, i) => `
      <div class="fc-mnemonic-row" style="animation-delay:${i * 0.07}s">
        <div class="fc-mnemonic-letter" style="color:${item.color}">${item.letter}</div>
        <div class="fc-mnemonic-rest">
          <span class="fc-mnemonic-word"><span style="color:${item.color};font-weight:800">${item.letter}</span>${item.rest}</span>
        </div>
        <div class="fc-mnemonic-emoji">${item.emoji}</div>
      </div>
    `).join('');
  } else {
    mnemonicBack.style.display = 'none';
    standardBack.style.display = 'block';
  }

  const badge = document.getElementById('fc-status');
  if (badge) {
    badge.textContent = c.status.charAt(0).toUpperCase() + c.status.slice(1);
    badge.className   = 'fc-status badge-' + c.status;
  }

  const total = _currentDeckCards.length;
  document.getElementById('fc-count').textContent = (idx + 1) + ' / ' + total;
  document.getElementById('fc-prog-fill').style.width = ((idx + 1) / total * 100) + '%';

  const dotsEl = document.getElementById('fc-dots');
  if (dotsEl) {
    dotsEl.innerHTML = _currentDeckCards.map((_, i) => {
      let cls = 'fc-dot';
      if (i < idx) cls += ' done';
      if (i === idx) cls += ' active';
      return `<div class="${cls}"></div>`;
    }).join('');
  }

  document.getElementById('fc-hint').style.opacity = '1';
  document.getElementById('fc-action-row').style.opacity = '0';
  document.getElementById('fc-action-row').style.pointerEvents = 'none';

  setTimeout(() => { inner.style.transition = 'transform 0.55s cubic-bezier(0.4,0.2,0.2,1)'; }, 50);
}

function flipCard() {
  const inner = document.getElementById('fc-inner');
  if (!isFlipped) {
    inner.style.transform = 'rotateY(180deg)';
    document.getElementById('fc-hint').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('fc-action-row').style.opacity      = '1';
      document.getElementById('fc-action-row').style.pointerEvents = 'auto';
    }, 300);
  } else {
    inner.style.transform = 'rotateY(0deg)';
    document.getElementById('fc-hint').style.opacity = '1';
    document.getElementById('fc-action-row').style.opacity      = '0';
    document.getElementById('fc-action-row').style.pointerEvents = 'none';
  }
  isFlipped = !isFlipped;
}

function nextCard(knew) {
  const card = _currentDeckCards[currentCard];
  if (card) {
    const status = knew ? 'mastered' : 'review';
    if (knew) _studyKnew++; else _studyForgot++;
    window.Api.progress.update(String(card._id), status).then(() => {
      _cardProgressMap[String(card._id)] = { cardId: String(card._id), status };
      _updateCardRowBadge(String(card._id), status);
    }).catch(() => {});
  }

  const wrap = document.getElementById('fc-wrap');
  wrap.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
  wrap.style.transform  = knew ? 'translateX(60px)' : 'translateX(-60px)';
  wrap.style.opacity    = '0';
  setTimeout(() => {
    if (currentCard + 1 >= _currentDeckCards.length) {
      _showStudyCongrats();
      return;
    }
    currentCard++;
    loadCard(currentCard);
    wrap.style.transition = 'none';
    wrap.style.transform  = knew ? 'translateX(-40px)' : 'translateX(40px)';
    wrap.style.opacity    = '0';
    requestAnimationFrame(() => {
      wrap.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      wrap.style.transform  = 'translateX(0)';
      wrap.style.opacity    = '1';
    });
  }, 220);
}

function _showStudyCongrats() {
  document.getElementById('fc-wrap').style.display       = 'none';
  document.getElementById('fc-hint').style.display       = 'none';
  document.getElementById('fc-action-row').style.display = 'none';
  document.getElementById('fc-dots').style.display       = 'none';

  const total    = _currentDeckCards.length;
  const sub      = document.getElementById('sc-sub');
  const stats    = document.getElementById('sc-stats');
  const congrats = document.getElementById('study-congrats');
  if (sub)   sub.textContent = `You went through all ${total} card${total !== 1 ? 's' : ''}`;
  if (stats) stats.innerHTML = `
    <div style="background:#EAF3EB;color:#2E5430;border-radius:12px;padding:12px 22px;font-weight:700;font-size:15px;">✓ ${_studyKnew} got it</div>
    <div style="background:#FAEEE9;color:#7A2E14;border-radius:12px;padding:12px 22px;font-weight:700;font-size:15px;">✕ ${_studyForgot} learning</div>
  `;
  if (congrats) congrats.style.display = 'flex';

  if (_currentDeckId) {
    window.Api.sessions.record({ deckId: _currentDeckId, mode: 'flashcards', score: _studyKnew, total, seconds: 0 }).catch(() => {});
  }
}

function restartStudy() {
  currentCard  = 0;
  isFlipped    = false;
  _studyKnew   = 0;
  _studyForgot = 0;
  document.getElementById('study-congrats').style.display  = 'none';
  const wrap = document.getElementById('fc-wrap');
  wrap.style.display = ''; wrap.style.opacity = '1'; wrap.style.transform = '';
  document.getElementById('fc-hint').style.display       = '';
  document.getElementById('fc-dots').style.display       = 'flex';
  const ar = document.getElementById('fc-action-row');
  ar.style.display = 'flex'; ar.style.opacity = '0'; ar.style.pointerEvents = 'none';
  loadCard(0);
}

function nextCardNav() {
  const wrap = document.getElementById('fc-wrap');
  wrap.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
  wrap.style.transform  = 'translateX(-60px)';
  wrap.style.opacity    = '0';
  setTimeout(() => {
    if (currentCard + 1 >= _currentDeckCards.length) {
      _showStudyCongrats();
      return;
    }
    currentCard++;
    loadCard(currentCard);
    wrap.style.transition = 'none';
    wrap.style.transform  = 'translateX(60px)';
    wrap.style.opacity    = '0';
    requestAnimationFrame(() => {
      wrap.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      wrap.style.transform  = 'translateX(0)';
      wrap.style.opacity    = '1';
    });
  }, 220);
}

function prevCard() {
  const wrap = document.getElementById('fc-wrap');
  wrap.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
  wrap.style.transform  = 'translateX(60px)';
  wrap.style.opacity    = '0';
  setTimeout(() => {
    currentCard = (currentCard - 1 + _currentDeckCards.length) % _currentDeckCards.length;
    loadCard(currentCard);
    wrap.style.transition = 'none';
    wrap.style.transform  = 'translateX(-60px)';
    wrap.style.opacity    = '0';
    requestAnimationFrame(() => {
      wrap.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      wrap.style.transform  = 'translateX(0)';
      wrap.style.opacity    = '1';
    });
  }, 220);
}

/* ── 8. MEMORY GAME ──────────────────────────────── */

let memSelected = null, memLocked = false;
let memAttempts = 0, memMatchCount = 0;
let memTimerInterval = null, memSeconds = 0, memStarted = false;

function initMemory() {
  _memoryPairs = _buildMemoryPairs(_currentDeckCards);
  if (_memoryPairs.length < 2) {
    showToast('Need at least 2 cards to play Memory');
    exitMemory();
    return;
  }

  const modal = document.getElementById('memory-win-modal');
  if (modal) modal.classList.remove('show');
  clearInterval(memTimerInterval);
  memSeconds = 0; memAttempts = 0; memMatchCount = 0;
  memSelected = null; memLocked = false; memStarted = false;
  document.getElementById('mem-matches').textContent  = '0';
  document.getElementById('mem-attempts').textContent = '0';
  document.getElementById('mem-timer').textContent    = '0:00';

  const terms    = _memoryPairs.map(p => ({ pairId: p.id, type: 'term',    term: p.term }));
  const meanings = _memoryPairs.map(p => ({ pairId: p.id, type: 'meaning', emoji: p.emoji, meaning: p.meaning }));
  shuffle(terms); shuffle(meanings);

  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  const half = Math.ceil(_memoryPairs.length / 2);
  for (let row = 0; row < half; row++) {
    if (terms[row])            grid.appendChild(makeMem(terms[row],            'term'));
    if (terms[row + half])     grid.appendChild(makeMem(terms[row + half],     'term'));
    if (meanings[row])         grid.appendChild(makeMem(meanings[row],         'meaning'));
    if (meanings[row + half])  grid.appendChild(makeMem(meanings[row + half],  'meaning'));
  }
}

function makeMem(card, type) {
  const el = document.createElement('div');
  if (type === 'term') {
    el.className = 'mem-card term-card';
    el.dataset.pairId = card.pairId;
    el.dataset.type   = 'term';
    el.innerHTML = `<div class="mem-term-tag">Term</div><div class="mem-term-word">${_escHtml(card.term)}</div>`;
  } else {
    el.className = 'mem-card meaning-card';
    el.dataset.pairId = card.pairId;
    el.dataset.type   = 'meaning';
    el.innerHTML = `<div class="mem-meaning-emoji">${card.emoji}</div><div class="mem-meaning-text">${_escHtml(card.meaning)}</div>`;
  }
  el.addEventListener('click', () => selectMemCard(el));
  return el;
}

function selectMemCard(el) {
  if (memLocked || el.classList.contains('matched')) return;

  if (!memStarted) {
    memStarted = true;
    memTimerInterval = setInterval(() => {
      memSeconds++;
      const m = Math.floor(memSeconds / 60), s = memSeconds % 60;
      document.getElementById('mem-timer').textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  }

  if (memSelected === el) { el.classList.remove('selected'); memSelected = null; return; }
  if (!memSelected) { el.classList.add('selected'); memSelected = el; return; }
  if (memSelected.dataset.type === el.dataset.type) {
    memSelected.classList.remove('selected');
    el.classList.add('selected');
    memSelected = el;
    return;
  }

  memAttempts++;
  document.getElementById('mem-attempts').textContent = memAttempts;
  memLocked = true;

  const prev = memSelected;
  el.classList.add('selected');
  memSelected = null;

  if (prev.dataset.pairId === el.dataset.pairId) {
    setTimeout(() => {
      prev.classList.remove('selected'); el.classList.remove('selected');
      prev.classList.add('matched');     el.classList.add('matched');
      prev.style.animation = 'matchPop 0.4s ease'; el.style.animation = 'matchPop 0.4s ease';
      setTimeout(() => { prev.style.animation = ''; el.style.animation = ''; }, 400);
      memMatchCount++;
      document.getElementById('mem-matches').textContent = memMatchCount;
      memLocked = false;
      if (memMatchCount === _memoryPairs.length) endMemory();
    }, 200);
  } else {
    setTimeout(() => {
      prev.classList.add('wrong'); el.classList.add('wrong');
      setTimeout(() => {
        prev.classList.remove('selected', 'wrong');
        el.classList.remove('selected', 'wrong');
        memLocked = false;
      }, 500);
    }, 300);
  }
}

function endMemory() {
  clearInterval(memTimerInterval);
  const m = Math.floor(memSeconds / 60), s = memSeconds % 60;
  const timeStr = m + ':' + (s < 10 ? '0' : '') + s;
  const acc = memAttempts > 0 ? Math.round((_memoryPairs.length / memAttempts) * 100) : 100;

  document.getElementById('mw-matched').textContent  = _memoryPairs.length + '/' + _memoryPairs.length;
  document.getElementById('mw-attempts').textContent = memAttempts;
  document.getElementById('mw-time').textContent     = timeStr;
  document.getElementById('mw-acc').textContent      = acc + '%';
  document.getElementById('mw-sub').textContent      = _memoryPairs.length + ' pairs matched in ' + timeStr;

  if (_currentDeckId) {
    window.Api.sessions.record({ deckId: _currentDeckId, mode: 'memory', score: memMatchCount, total: _memoryPairs.length, seconds: memSeconds }).catch(() => {});
  }

  _launchConfetti();
  setTimeout(() => document.getElementById('memory-win-modal').classList.add('show'), 400);
}

function _launchConfetti() {
  const colors = ['#FFD166','#FF6675','#F4A7B9','#7DD9A8','#578DDC','#74B7E8'];
  const view   = document.getElementById('memory-view');
  for (let i = 0; i < 72; i++) {
    const p    = document.createElement('div');
    p.className = 'confetti-piece';
    const size  = 7 + Math.random() * 8;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.45 ? '50%' : '3px'};
      animation-duration:${1.4 + Math.random() * 1.8}s;
      animation-delay:${Math.random() * 0.7}s;
    `;
    view.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

/* ── 9. MULTIPLE CHOICE QUIZ ─────────────────────── */

let mcIndex = 0, mcCorrectCount = 0, mcAnswered = false;
let mcSeconds = 0, mcTimerInterval = null, mcStarted = false;

function initMC() {
  _mcQuestions = _buildMCQuestions(_currentDeckCards);
  if (!_mcQuestions.length) {
    showToast('Need at least 4 cards with definitions to play Quiz');
    exitMC();
    return;
  }

  clearInterval(mcTimerInterval);
  mcIndex = 0; mcCorrectCount = 0; mcAnswered = false;
  mcSeconds = 0; mcStarted = false;
  document.getElementById('mc-correct').textContent = '0';
  document.getElementById('mc-timer').textContent   = '0:00';
  document.getElementById('mc-result').classList.remove('show');
  document.getElementById('mc-q-num-label').style.display = 'block';
  document.querySelector('.mc-question-card').style.display = '';
  renderMCQuestion();
}

function renderMCQuestion() {
  if (mcIndex >= _mcQuestions.length) { endMC(); return; }
  const q = _mcQuestions[mcIndex];
  mcAnswered = false;

  const pct = (mcIndex / _mcQuestions.length) * 100;
  document.getElementById('mc-prog-fill').style.width = pct + '%';
  document.getElementById('mc-qnum').textContent      = (mcIndex + 1) + '/' + _mcQuestions.length;
  document.getElementById('mc-q-num-label').textContent = 'Question ' + (mcIndex + 1) + ' of ' + _mcQuestions.length;

  document.getElementById('mc-q-word').textContent = q.word;
  const partsEl = document.getElementById('mc-q-parts');
  partsEl.innerHTML = q.parts.map(([chunk, meaning]) =>
    `<span class="mc-q-pill"><strong>${chunk}</strong> → ${meaning}</span>`
  ).join('');
  partsEl.style.visibility = 'hidden';
  partsEl.style.opacity    = '0';
  partsEl.style.position   = 'absolute';

  const hintBtn = document.getElementById('mc-hint-btn');
  if (hintBtn) {
    hintBtn.style.visibility = 'visible';
    hintBtn.style.position   = 'relative';
    hintBtn.textContent      = '💡 Reveal hint';
  }

  const options = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
  const letters = ['A','B','C','D'];
  const optEl   = document.getElementById('mc-options');
  optEl.innerHTML = options.map((opt, i) => `
    <button class="mc-option" data-option="${_escHtml(opt)}" data-correct="${_escHtml(q.correct)}">
      <span class="mc-option-letter">${letters[i]}</span>
      ${_escHtml(opt)}
    </button>`).join('');

  const fb = document.getElementById('mc-feedback');
  fb.className    = 'mc-feedback';
  fb.style.display = 'none';
  document.getElementById('mc-next-btn').classList.remove('show');
  document.getElementById('mc-result').classList.remove('show');
  document.querySelector('.mc-question-card').style.display = '';
  document.getElementById('mc-q-num-label').style.display   = '';
}

function revealMCHint() {
  const parts = document.getElementById('mc-q-parts');
  const btn   = document.getElementById('mc-hint-btn');
  if (parts) { parts.style.visibility = 'visible'; parts.style.opacity = '1'; parts.style.position = 'relative'; }
  if (btn)   { btn.style.visibility = 'hidden'; btn.style.position = 'absolute'; }
}

function answerMC(el, chosen, correct) {
  if (mcAnswered) return;
  mcAnswered = true;

  if (!mcStarted) {
    mcStarted = true;
    mcTimerInterval = setInterval(() => {
      mcSeconds++;
      const m = Math.floor(mcSeconds / 60), s = mcSeconds % 60;
      document.getElementById('mc-timer').textContent = m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  }

  document.querySelectorAll('.mc-option').forEach(o => o.classList.add('answered'));

  const isCorrect = chosen === correct;
  if (isCorrect) {
    el.classList.add('correct');
    mcCorrectCount++;
    document.getElementById('mc-correct').textContent = mcCorrectCount;
  } else {
    el.classList.add('wrong');
    document.querySelectorAll('.mc-option').forEach(o => {
      if (o.dataset.option === correct) o.classList.add('correct');
    });
  }

  const fb      = document.getElementById('mc-feedback');
  fb.className  = 'mc-feedback ' + (isCorrect ? 'correct' : 'wrong');
  fb.textContent = isCorrect ? '✓ Correct! Well remembered.' : '✗ Not quite — the right answer is highlighted above.';

  const nextBtn    = document.getElementById('mc-next-btn');
  nextBtn.textContent = mcIndex + 1 < _mcQuestions.length ? 'Next Question →' : 'See Results →';
  nextBtn.classList.add('show');
}

function nextMCQuestion() { mcIndex++; renderMCQuestion(); }

function endMC() {
  clearInterval(mcTimerInterval);
  const pct = Math.round((mcCorrectCount / _mcQuestions.length) * 100);
  const m   = Math.floor(mcSeconds / 60), s = mcSeconds % 60;
  const timeStr = m + ':' + (s < 10 ? '0' : '') + s;

  document.querySelector('.mc-question-card').style.display = 'none';
  document.getElementById('mc-q-num-label').style.display   = 'none';
  document.getElementById('mc-options').innerHTML           = '';
  document.getElementById('mc-feedback').style.display      = 'none';
  document.getElementById('mc-next-btn').classList.remove('show');
  document.getElementById('mc-prog-fill').style.width       = '100%';

  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';
  const title = pct >= 80 ? 'Excellent work!' : pct >= 50 ? 'Good effort!' : 'Keep practicing!';
  document.getElementById('mcr-emoji').textContent         = emoji;
  document.getElementById('mcr-title').textContent         = title;
  document.getElementById('mcr-sub').textContent           = mcCorrectCount + ' out of ' + _mcQuestions.length + ' correct';
  document.getElementById('mcr-correct-val').textContent   = mcCorrectCount + '/' + _mcQuestions.length;
  document.getElementById('mcr-pct-val').textContent       = pct + '%';
  document.getElementById('mcr-time-val').textContent      = timeStr;
  document.getElementById('mc-result').classList.add('show');

  if (_currentDeckId) {
    window.Api.sessions.record({ deckId: _currentDeckId, mode: 'mc', score: mcCorrectCount, total: _mcQuestions.length, seconds: mcSeconds }).catch(() => {});
  }
}

/* ── 10. CREATE DECK ─────────────────────────────── */

function selectColor(el, accent) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  const card = document.getElementById('cdv-preview-card');
  if (card) card.style.background = el.style.background;
}

function selectEmoji(el, emoji) {
  document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  const previewIcon = document.getElementById('preview-icon');
  if (previewIcon) previewIcon.textContent = emoji;
}

function pickQuickEmoji(el, emoji) {
  document.querySelectorAll('.cdv-settings-panel .emoji-quick').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  const previewIcon = document.getElementById('preview-icon');
  if (previewIcon) previewIcon.textContent = emoji;
}

function toggleNamePanel() {
  const drawer = document.getElementById('cdv-name-drawer');
  const card   = document.getElementById('cdv-preview-card');
  if (!drawer || !card) return;
  const opening = !drawer.classList.contains('open');
  drawer.classList.toggle('open', opening);
  card.classList.toggle('name-open', opening);
  if (opening) setTimeout(() => document.getElementById('cdv-name-input')?.focus(), 60);
}

function confirmDeckName() {
  const drawer = document.getElementById('cdv-name-drawer');
  const card   = document.getElementById('cdv-preview-card');
  if (drawer) drawer.classList.remove('open');
  if (card)   card.classList.remove('name-open');
}

function updateDeckNamePreview(val) {
  const previewName = document.getElementById('preview-name');
  const tapBadge    = document.getElementById('cdv-tap-badge');
  const doneBtn     = document.getElementById('cdv-name-done');
  const card        = document.getElementById('cdv-preview-card');
  if (!previewName) return;
  previewName.textContent = val || 'Tap to name your deck';
  previewName.classList.toggle('has-value', !!val);
  if (card)     card.classList.toggle('named', !!val);
  if (tapBadge) tapBadge.style.display = val ? 'none' : '';
  if (doneBtn)  doneBtn.style.display  = val ? 'inline-block' : 'none';
}

function selectMethod(el, method) {
  document.querySelectorAll('.imb-opt').forEach(o => {
    o.classList.remove('selected','selected-sage','selected-lav');
  });
  if (method === 'notes')       el.classList.add('selected');
  else if (method === 'manual') el.classList.add('selected-sage');
  else                          el.classList.add('selected-lav');

  document.querySelectorAll('.method-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + method).classList.add('active');
}

function _appendBlankCardRow(list, isPlaceholder) {
  const row = document.createElement('div');
  row.className = 'card-editor-row';
  if (isPlaceholder) row.style.opacity = '0.5';
  row.innerHTML = `
    <input class="cer-input" placeholder="Word or term…" autocomplete="off" spellcheck="false">
    <span class="cer-arrow">→</span>
    <input class="cer-input" placeholder="Definition or hint…" autocomplete="off" spellcheck="false">
    <button class="cer-delete">✕</button>
  `;
  row.querySelector('.cer-delete').addEventListener('click', () => row.remove());
  if (isPlaceholder) {
    row.querySelectorAll('.cer-input').forEach(inp => {
      inp.addEventListener('input', () => { row.style.opacity = '1'; }, { once: true });
    });
  }
  list.appendChild(row);
  return row;
}

function addCardRow() {
  const list = document.getElementById('card-editor-list');
  if (!list) return;
  const row = _appendBlankCardRow(list, false);
  row.querySelector('.cer-input').focus();
}

const _ACCENT_TO_THEME = {
  '#FFD166': 'amber',  '#FF6675': 'terracotta',
  '#F4A7B9': 'honey',  '#7DD9A8': 'clay',
  '#578DDC': 'rust',   '#74B7E8': 'rose',
};

async function createDeck() {
  const nameEl = document.getElementById('preview-name');
  const name   = nameEl?.textContent?.trim();
  if (!name || name === 'Tap to name your deck') {
    showToast('Give your deck a name first');
    if (!document.getElementById('cdv-name-drawer')?.classList.contains('open')) toggleNamePanel();
    return;
  }

  const rows  = document.querySelectorAll('#card-editor-list .card-editor-row');
  const cards = [];
  rows.forEach(row => {
    const inputs = row.querySelectorAll('.cer-input');
    const word   = inputs[0]?.value.trim();
    const def    = inputs[1]?.value.trim();
    if (word) cards.push({ term: word, definition: def || '' });
  });

  if (!cards.length) {
    showToast('Add at least one card first');
    const manualBtn = document.querySelector('.imb-opt[data-arg1="manual"]');
    if (manualBtn) selectMethod(manualBtn, 'manual');
    return;
  }

  const selectedSwatch = document.querySelector('.cdv-settings-panel .color-swatch.selected');
  const accentVal = selectedSwatch?.dataset?.arg1 || '#FFD166';
  const theme     = _ACCENT_TO_THEME[accentVal] || 'amber';
  const emoji     = document.getElementById('preview-icon')?.textContent || '📖';

  const btn = document.querySelector('[data-action="createDeck"]');
  if (btn) { btn.disabled = true; btn.textContent = '✨ Generating mnemonics…'; }

  let enrichedCards = cards.map(c => ({ ...c, type: 'word' }));
  try {
    const terms  = cards.map(c => c.term).join('\n');
    const result = await window.Api.ai.generate(terms);
    const aiCards = result.cards || [];
    enrichedCards = cards.map((c, i) => {
      const ai = aiCards[i];
      if (!ai) return { ...c, type: 'word' };
      return {
        term:       c.term,
        definition: c.definition || ai.meaning || '',
        example:    ai.definition || '',
        parts:      ai.parts  || [],
        emojis:     ai.emojis || [],
        type:       'mnemonic',
      };
    });
  } catch (err) { showToast('AI unavailable — saving plain cards'); console.warn('AI enrichment failed:', err.message); }

  if (btn) btn.textContent = 'Saving…';

  try {
    const newDeck = await window.Api.decks.create({ name, theme, emoji });
    await Promise.all(enrichedCards.map(c => window.Api.cards.create(newDeck._id, c)));

    if (_pendingFolderId) {
      await window.Api.folders.addDeck(_pendingFolderId, newDeck._id);
      const pendingId = _pendingFolderId;
      _pendingFolderId = null;
      showToast(`✓ "${name}" created — ${cards.length} card${cards.length !== 1 ? 's' : ''}`);
      await showMyDecks();
      showFolderById(pendingId);
    } else {
      showToast(`✓ "${name}" — ${cards.length} card${cards.length !== 1 ? 's' : ''} saved`);
      showMyDecks();
    }
  } catch (err) {
    showToast('Failed to create deck: ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Create Deck →'; }
  }
}

let _currentSep = '-';

function selectSep(el, sep) {
  el.parentElement.querySelectorAll('.sep-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');

  const inModal    = !!el.closest('.imp-body');
  const formId     = inModal ? 'imp-custom-sep-form' : 'custom-sep-form';
  const charId     = inModal ? 'imp-custom-sep-char' : 'custom-sep-char';
  const customForm = document.getElementById(formId);

  if (sep === 'custom') {
    if (customForm) customForm.style.display = 'flex';
    setTimeout(() => document.getElementById(charId)?.focus(), 60);
  } else {
    _currentSep = sep;
    if (customForm) customForm.style.display = 'none';
  }
}

function extractWithSep() {
  let sep = _currentSep;
  const customBtn = document.querySelector('.sep-btn[data-arg1="custom"]');
  if (customBtn && customBtn.classList.contains('selected')) {
    const charInput = document.getElementById('custom-sep-char');
    sep = charInput ? charInput.value : '';
    if (!sep) { showToast('Type a separator character first'); return; }
  }

  const textarea = document.querySelector('.notes-paste-area');
  if (!textarea || !textarea.value.trim()) { showToast('Paste some text first'); return; }

  const lines = textarea.value.trim().split('\n').filter(l => l.trim());
  const pairs = lines
    .map(l => { const idx = l.indexOf(sep); if (idx === -1) return null; return [l.slice(0, idx).trim(), l.slice(idx + sep.length).trim()]; })
    .filter(p => p && p[0]);

  if (!pairs.length) { showToast('No lines matched separator "' + sep + '"'); return; }

  const manualBtn = document.querySelector('.imb-opt[data-arg1="manual"]');
  if (manualBtn) selectMethod(manualBtn, 'manual');

  const list = document.getElementById('card-editor-list');
  list.innerHTML = '';
  pairs.forEach(([word, def]) => {
    const row = document.createElement('div');
    row.className = 'card-editor-row';
    row.innerHTML = `
      <input class="cer-input" placeholder="Word or term…" value="${_escHtml(word)}">
      <span class="cer-arrow">→</span>
      <input class="cer-input" placeholder="Definition or hint…" value="${_escHtml(def)}">
      <button class="cer-delete">✕</button>
    `;
    row.querySelector('.cer-delete').addEventListener('click', () => row.remove());
    list.appendChild(row);
  });
  _appendBlankCardRow(list, true);
  showToast('✓ ' + pairs.length + ' card' + (pairs.length !== 1 ? 's' : '') + ' extracted');
}

async function extractWithAI() {
  const wordRows = document.querySelectorAll('#ai-word-list .awr-input');
  const words    = Array.from(wordRows).map(i => i.value.trim()).filter(Boolean);
  if (!words.length) { showToast('Enter some words first'); return; }

  const btn = document.querySelector('.ai-generate-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating…'; }

  try {
    const result = await window.Api.ai.generate(words.join('\n'));
    const pairs  = result.cards || result;
    if (!Array.isArray(pairs) || !pairs.length) { showToast('No cards generated'); return; }

    const manualBtn = document.querySelector('.imb-opt[data-arg1="manual"]');
    if (manualBtn) selectMethod(manualBtn, 'manual');

    const list = document.getElementById('card-editor-list');
    list.innerHTML = '';
    pairs.forEach(({ term, definition }) => {
      const row = document.createElement('div');
      row.className = 'card-editor-row';
      row.innerHTML = `
        <input class="cer-input" placeholder="Word or term…" value="${_escHtml(term || '')}">
        <span class="cer-arrow">→</span>
        <input class="cer-input" placeholder="Definition or hint…" value="${_escHtml(definition || '')}">
        <button class="cer-delete">✕</button>
      `;
      row.querySelector('.cer-delete').addEventListener('click', () => row.remove());
      list.appendChild(row);
    });
    _appendBlankCardRow(list, true);
    showToast(`✓ ${pairs.length} card${pairs.length !== 1 ? 's' : ''} generated`);
  } catch (err) {
    showToast('AI generation failed: ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '✨ Generate Cards with AI'; }
  }
}

/* ── 11. INLINE ADD CARD ─────────────────────────── */

function _closeNewCard(card) {
  card.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
  card.style.opacity    = '0';
  card.style.transform  = 'translateY(10px)';
  setTimeout(() => card.remove(), 190);
}

function addInlineCard() {
  const list = document.getElementById('word-list');
  if (!list) return;

  const existing = list.querySelector('.word-new-card');
  if (existing) {
    if (existing._save) existing._save();
    else _closeNewCard(existing);
    return;
  }

  const accentVar = '--' + _currentDeckColor;
  const modKey    = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘↵' : 'Ctrl+↵';

  const card = document.createElement('div');
  card.className = 'word-new-card';
  card.style.borderLeftColor = `var(${accentVar})`;
  card.innerHTML = `
    <div class="wnc-header">
      <span class="wnc-label">✦ New card</span>
      <button class="wnc-close" title="Cancel">✕</button>
    </div>
    <div class="wnc-field">
      <label class="wnc-field-label">Term</label>
      <input class="wnc-term" placeholder="Word or phrase…" autocomplete="off" spellcheck="false">
    </div>
    <div class="wnc-field">
      <label class="wnc-field-label">Definition</label>
      <textarea class="wnc-def" placeholder="Meaning, explanation, or example…" rows="3"></textarea>
    </div>
    <div class="wnc-footer">
      <button class="wnc-save">Save card</button>
      <button class="wnc-cancel">Cancel</button>
      <span class="wnc-hint">${modKey} to save · Esc to cancel</span>
    </div>
  `;

  const termInput = card.querySelector('.wnc-term');
  const defInput  = card.querySelector('.wnc-def');

  defInput.addEventListener('input', () => {
    defInput.style.height = 'auto';
    defInput.style.height = defInput.scrollHeight + 'px';
  });

  async function save() {
    const term = termInput.value.trim();
    const def  = defInput.value.trim();
    if (!term) {
      termInput.classList.add('invalid');
      termInput.focus();
      setTimeout(() => termInput.classList.remove('invalid'), 600);
      return;
    }

    const saveBtn = card.querySelector('.wnc-save');
    if (saveBtn) saveBtn.disabled = true;

    try {
      const newCard = await window.Api.cards.create(_currentDeckId, { term, definition: def });
      _currentDeckCards.push(newCard);

      const deckObj = _allDecks.find(d => String(d._id) === String(_currentDeckId));
      if (deckObj) {
        deckObj.cardCount = (deckObj.cardCount || 0) + 1;
        const gridCard = document.querySelector(`#md-sets-grid [data-arg1="${_currentDeckId}"]`);
        if (gridCard) {
          const metaEl = gridCard.querySelector('.md-set-meta');
          if (metaEl) metaEl.textContent = `${deckObj.cardCount} card${deckObj.cardCount !== 1 ? 's' : ''}`;
        }
      }

      const id     = newCard._id;
      const newRow = document.createElement('div');
      newRow.className = 'word-row';
      newRow.id = 'wr-' + id;
      newRow.style.opacity = '0';
      newRow.dataset.action = 'toggleWord';
      newRow.dataset.arg1   = id;
      newRow.innerHTML = `
        <span class="wr-emoji">✦</span>
        <div class="wr-main">
          <div class="wr-top"><span class="wr-word">${_escHtml(term)}</span></div>
        </div>
        <button class="wr-delete" data-action="deleteCard" data-arg1="${id}" title="Delete">✕</button>
      `;

      const newDetail = document.createElement('div');
      newDetail.className = 'word-detail';
      newDetail.id = 'wd-' + id;
      newDetail.innerHTML = `
        <div class="wd-meaning">
          <div class="wd-accent-bar"></div>
          <div>
            <div class="wd-section-label">Meaning</div>
            <p class="wd-definition">${_escHtml(def || '—')}</p>
          </div>
        </div>
        <div class="wd-actions">
          <button class="wd-btn" data-action="editCard" data-arg1="${id}">✏️ Edit</button>
          <button class="wd-btn" data-action="markCard" data-arg1="${id}" data-arg2="mastered">✓ Know it</button>
          <button class="wd-btn" data-action="markCard" data-arg1="${id}" data-arg2="review">Still learning</button>
        </div>
      `;

      list.insertBefore(newRow, card);
      list.insertBefore(newDetail, card);
      requestAnimationFrame(() => {
        newRow.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        newRow.style.opacity    = '1';
      });

      termInput.value = '';
      defInput.value  = '';
      defInput.style.height = '';
      termInput.focus();
      _enrichCardWithAI(term, def, id, newRow, newDetail);
    } catch (err) {
      showToast('Failed to save card: ' + err.message);
    } finally {
      if (saveBtn) saveBtn.disabled = false;
    }
  }

  card._save = save;
  card.querySelector('.wnc-save').addEventListener('click', save);
  card.querySelector('.wnc-cancel').addEventListener('click', () => _closeNewCard(card));
  card.querySelector('.wnc-close').addEventListener('click', () => _closeNewCard(card));

  termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); defInput.focus(); }
    if (e.key === 'Escape') _closeNewCard(card);
  });
  defInput.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') _closeNewCard(card);
  });

  const addBtn = list.querySelector('.md-add-card');
  if (addBtn) list.insertBefore(card, addBtn);
  else list.appendChild(card);
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => termInput.focus(), 60);
}

/* ── 11b. AI CARD ENRICHMENT ─────────────────────── */

async function _enrichCardWithAI(term, userDef, cardId, rowEl, detailEl) {
  const emojiEl = rowEl?.querySelector('.wr-emoji');
  if (emojiEl) emojiEl.textContent = '⏳';

  try {
    const result = await window.Api.ai.generate(term);
    const aiCard = (result.cards || [])[0];
    if (!aiCard) return;

    const { parts, definition: hookPhrase, emojis, meaning: aiMeaning } = aiCard;
    const finalDef = userDef || aiMeaning || '';

    await window.Api.cards.update(String(cardId), {
      parts, emojis, type: 'mnemonic',
      definition: finalDef,
      example:    hookPhrase || '',
    });

    const idx = _currentDeckCards.findIndex(c => String(c._id) === String(cardId));
    if (idx !== -1) Object.assign(_currentDeckCards[idx], {
      parts, emojis, type: 'mnemonic',
      definition: finalDef,
      example:    hookPhrase || '',
    });

    const emoji        = (emojis && emojis[0]) || '📖';
    const emojiDisplay = emojis && emojis.length > 1 ? emojis.join('') : emoji;
    if (emojiEl) emojiEl.textContent = emoji;

    if (rowEl) {
      const partsHtml = parts && parts.length
        ? `<div class="wr-parts">${parts.map(p => `<span class="wr-part-pill"><strong>${_escHtml(p.chunk)}</strong> → ${_escHtml(p.meaning)}</span>`).join('')}</div>`
        : '';
      const main = rowEl.querySelector('.wr-main');
      if (main) {
        const old = main.querySelector('.wr-parts');
        if (old) old.remove();
        if (partsHtml) main.insertAdjacentHTML('beforeend', partsHtml);
      }
    }

    if (detailEl) {
      detailEl.innerHTML = `
        <div class="wd-meaning">
          <div class="wd-accent-bar"></div>
          <div>
            <div class="wd-section-label">Meaning</div>
            <p class="wd-definition">${_escHtml(finalDef || '—')}</p>
          </div>
        </div>
        ${hookPhrase ? `
        <div class="wd-context">
          <div class="wd-section-label">Memory hook</div>
          <p class="wd-example">${_escHtml(hookPhrase)} ${emojiDisplay}</p>
        </div>` : ''}
        <div class="wd-actions">
          <button class="wd-btn" data-action="editCard" data-arg1="${cardId}">✏️ Edit</button>
          <button class="wd-btn" data-action="markCard" data-arg1="${cardId}" data-arg2="mastered">✓ Know it</button>
          <button class="wd-btn" data-action="markCard" data-arg1="${cardId}" data-arg2="review">Still learning</button>
        </div>
      `;
    }
  } catch (_) {
    if (emojiEl) emojiEl.textContent = '✦';
  }
}

/* ── 12. CARD ACTIONS ────────────────────────────── */

function _updateCardRowBadge(cardId, status) {
  const row = document.getElementById('wr-' + cardId);
  if (!row) return;
  const badge = row.querySelector('.wr-status');
  if (!badge) return;
  if (status === 'mastered') {
    badge.style.display = 'none';
  } else {
    badge.className  = 'wr-status badge-review';
    badge.textContent = 'Learning';
    badge.style.display = '';
  }
}

async function deleteCard(id) {
  try {
    await window.Api.cards.delete(id);
    _currentDeckCards = _currentDeckCards.filter(c => String(c._id) !== String(id));
  } catch (err) {
    showToast('Failed to delete card');
    return;
  }
  const row    = document.getElementById('wr-' + id);
  const detail = document.getElementById('wd-' + id);
  const fade   = el => {
    if (!el) return;
    el.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(6px)';
    setTimeout(() => el.remove(), 190);
  };
  fade(row); fade(detail);
}

function editCard(id) {
  const detail = document.getElementById('wd-' + id);
  const card   = _currentDeckCards.find(c => String(c._id) === String(id));
  if (!detail || !card) return;

  if (detail.querySelector('.wde-save')) return; // already editing

  const savedHTML = detail.innerHTML;

  detail.innerHTML = `
    <div class="wnc-field">
      <label class="wnc-field-label">Term</label>
      <input class="wde-term wnc-term" value="${_escHtml(card.term)}" autocomplete="off" spellcheck="false">
    </div>
    <div class="wnc-field">
      <label class="wnc-field-label">Meaning</label>
      <textarea class="wde-def wnc-def" rows="2">${_escHtml(card.definition || '')}</textarea>
    </div>
    <div class="wnc-footer">
      <button class="wnc-save wde-save">Save</button>
      <button class="wnc-cancel wde-cancel">Cancel</button>
    </div>
  `;

  const termInput = detail.querySelector('.wde-term');
  const defInput  = detail.querySelector('.wde-def');

  defInput.addEventListener('input', () => {
    defInput.style.height = 'auto';
    defInput.style.height = defInput.scrollHeight + 'px';
  });

  detail.querySelector('.wde-cancel').addEventListener('click', () => {
    detail.innerHTML = savedHTML;
  });

  detail.querySelector('.wde-save').addEventListener('click', async () => {
    const newTerm = termInput.value.trim();
    const newDef  = defInput.value.trim();
    if (!newTerm) {
      termInput.classList.add('invalid');
      setTimeout(() => termInput.classList.remove('invalid'), 600);
      return;
    }
    const saveBtn = detail.querySelector('.wde-save');
    if (saveBtn) saveBtn.disabled = true;
    try {
      await window.Api.cards.update(String(id), { term: newTerm, definition: newDef });
      const idx = _currentDeckCards.findIndex(c => String(c._id) === String(id));
      if (idx !== -1) { _currentDeckCards[idx].term = newTerm; _currentDeckCards[idx].definition = newDef; }
      const row = document.getElementById('wr-' + id);
      if (row) { const wordEl = row.querySelector('.wr-word'); if (wordEl) wordEl.textContent = newTerm; }
      detail.innerHTML = savedHTML;
      const defEl = detail.querySelector('.wd-definition');
      if (defEl) defEl.textContent = newDef || '—';
      showToast('✓ Card updated');
    } catch (err) {
      showToast('Failed to update: ' + err.message);
      if (saveBtn) saveBtn.disabled = false;
    }
  });

  termInput.addEventListener('keydown', e => { if (e.key === 'Escape') detail.innerHTML = savedHTML; });
  termInput.focus();
  termInput.select();
}

async function markCard(cardId, status) {
  try {
    await window.Api.progress.update(String(cardId), status);
    _cardProgressMap[String(cardId)] = { cardId: String(cardId), status };
    _updateCardRowBadge(String(cardId), status);
    showToast(status === 'mastered' ? '✓ Marked as known' : '📝 Marked for review');
  } catch (err) {
    showToast('Failed to update progress');
  }
}

function toggleWord(id) {
  const detail = document.getElementById('wd-' + id);
  const row    = document.getElementById('wr-' + id);
  if (!detail) return;
  const isOpen = detail.classList.contains('open');
  document.querySelectorAll('.word-detail').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.word-row').forEach(r => r.classList.remove('expanded'));
  if (!isOpen) { detail.classList.add('open'); row.classList.add('expanded'); }
}

/* ── 13. SIDEBAR NAVIGATION + CATEGORY FILTER ───── */

function showFlashcards() {
  document.querySelectorAll('.mdecks-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.action === 'showFlashcards');
  });
  filterCategory('all');
}

function filterCategory(cat) {
  document.querySelectorAll('.mdecks-cat-item').forEach(el => {
    el.classList.toggle('active', el.dataset.arg1 === cat);
  });
  document.querySelectorAll('#md-sets-grid .md-set-card').forEach(card => {
    card.style.display = cat === 'all' ? '' : 'none';
  });
  const addCard = document.querySelector('#md-sets-grid .md-add-card');
  if (addCard) addCard.style.display = cat === 'all' ? '' : 'none';
}

function _resetSidebar() {
  document.querySelectorAll('.mdecks-nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.action === 'showFlashcards');
  });
  filterCategory('all');
}

let _sortDir = null;

function sortSets(dir) {
  _sortDir = (_sortDir === dir) ? null : dir;
  document.querySelectorAll('.sort-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.arg1 === _sortDir);
  });
  const grid    = document.getElementById('md-sets-grid');
  const addCard = grid.querySelector('.md-add-card');
  const cards   = [...grid.querySelectorAll('.md-set-card')];
  if (_sortDir) {
    cards.sort((a, b) => { const cmp = a.dataset.name.localeCompare(b.dataset.name, undefined, {sensitivity:'base'}); return _sortDir === 'asc' ? cmp : -cmp; });
  } else {
    cards.sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));
  }
  cards.forEach(c => grid.appendChild(c));
  if (addCard) grid.appendChild(addCard);
}

/* ── 14. IMPORT MODAL ────────────────────────────── */

function _insertImportedAICards(cards) {
  const wordList = document.getElementById('word-list');
  const addBtn   = wordList?.querySelector('.md-add-card');
  cards.forEach(async ({ term, parts, definition: hookPhrase, emojis, meaning }) => {
    const tempId       = 'imp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5);
    const emoji        = (emojis && emojis[0]) || '📖';
    const emojiDisplay = emojis && emojis.length > 1 ? emojis.join('') : emoji;
    const partsHtml    = parts && parts.length
      ? `<div class="wr-parts">${parts.map(p => `<span class="wr-part-pill"><strong>${_escHtml(p.chunk)}</strong> → ${_escHtml(p.meaning)}</span>`).join('')}</div>`
      : '';

    const row = document.createElement('div');
    row.className = 'word-row'; row.id = 'wr-' + tempId;
    row.dataset.action = 'toggleWord'; row.dataset.arg1 = tempId;
    row.style.opacity = '0';
    row.innerHTML = `
      <span class="wr-emoji">${emoji}</span>
      <div class="wr-main">
        <div class="wr-top"><span class="wr-word">${_escHtml(term)}</span></div>
        ${partsHtml}
      </div>
      <span class="wr-status badge-new">New</span>
      <button class="wr-delete" data-action="deleteCard" data-arg1="${tempId}" title="Delete">✕</button>
    `;

    const detail = document.createElement('div');
    detail.className = 'word-detail'; detail.id = 'wd-' + tempId;
    detail.innerHTML = `
      <div class="wd-meaning">
        <div class="wd-accent-bar"></div>
        <div>
          <div class="wd-section-label">Meaning</div>
          <p class="wd-definition">${_escHtml(meaning || '—')}</p>
        </div>
      </div>
      ${hookPhrase ? `
      <div class="wd-context">
        <div class="wd-section-label">Memory hook</div>
        <p class="wd-example">${_escHtml(hookPhrase)} ${emojiDisplay}</p>
      </div>` : ''}
      <div class="wd-actions">
        <button class="wd-btn wd-btn-edit-pending">✏️ Edit</button>
        <button class="wd-btn" data-action="markCard" data-arg1="${tempId}" data-arg2="mastered">✓ Know it</button>
        <button class="wd-btn" data-action="markCard" data-arg1="${tempId}" data-arg2="review">Still learning</button>
      </div>
    `;

    if (addBtn) { wordList.insertBefore(row, addBtn); wordList.insertBefore(detail, addBtn); }
    else { wordList?.appendChild(row); wordList?.appendChild(detail); }
    requestAnimationFrame(() => { row.style.transition = 'opacity 0.28s ease'; row.style.opacity = '1'; });

    if (_currentDeckId) {
      try {
        const saved = await window.Api.cards.create(_currentDeckId, {
          term, parts, emojis, type: 'mnemonic',
          definition: meaning || '',
          example:    hookPhrase || '',
        });
        _currentDeckCards.push(saved);
        const realId = saved._id;
        row.id = 'wr-' + realId;    row.dataset.arg1 = realId;
        detail.id = 'wd-' + realId;
        row.querySelector('[data-action="deleteCard"]').dataset.arg1 = realId;
        detail.querySelectorAll('[data-action="markCard"]').forEach(b => b.dataset.arg1 = realId);
        const editBtn = detail.querySelector('.wd-btn-edit-pending');
        if (editBtn) { editBtn.dataset.action = 'editCard'; editBtn.dataset.arg1 = realId; editBtn.classList.remove('wd-btn-edit-pending'); }
      } catch (_) {}
    }
  });
}

function showImportModal() {
  const modal = document.getElementById('import-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  _switchImportTab('paste');
  /* Always reset separator to dash on open */
  modal.querySelectorAll('.sep-btn').forEach((b, i) => b.classList.toggle('selected', i === 0));
  const impCustomForm = document.getElementById('imp-custom-sep-form');
  if (impCustomForm) impCustomForm.style.display = 'none';
  _currentSep = '-';
  setTimeout(() => { const area = document.getElementById('imp-paste-area'); if (area) area.focus(); }, 80);
}

function closeImportModal() {
  const modal = document.getElementById('import-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function _switchImportTab(tabId) {
  document.querySelectorAll('.imp-tab').forEach(t => t.classList.toggle('active', t.dataset.arg1 === tabId));
  document.querySelectorAll('.imp-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById('imp-panel-' + tabId);
  if (panel) panel.style.display = 'block';
}

function switchImportTab(btn, tabId) { _switchImportTab(tabId); }

async function importCards() {
  const activeTab = document.querySelector('.imp-tab.active')?.dataset.arg1 || 'paste';

  if (activeTab === 'ai') {
    const textarea = document.getElementById('imp-ai-textarea');
    const text = textarea?.value.trim();
    if (!text) { showToast('Enter some words first'); return; }

    const btn = document.querySelector('.imp-btn-import');
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Generating…'; }

    try {
      const result = await window.Api.ai.generate(text);
      const cards  = result.cards || [];
      if (!cards.length) { showToast('No cards generated'); return; }
      _insertImportedAICards(cards);
      closeImportModal();
      showToast(`✓ ${cards.length} mnemonic card${cards.length !== 1 ? 's' : ''} generated`);
      if (textarea) textarea.value = '';
    } catch (err) {
      showToast('AI failed: ' + (err.message || 'unknown error'));
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Import cards'; }
    }
    return;
  }

  if (activeTab === 'upload') {
    showToast('Drop or browse a file above to import');
    return;
  }

  // paste tab — extract terms using separator, then run AI
  const textarea = document.getElementById('imp-paste-area');
  if (!textarea?.value.trim()) { showToast('Paste some text first'); return; }

  let sep = _currentSep;
  const customForm = document.getElementById('imp-custom-sep-form');
  if (customForm?.style.display !== 'none') {
    sep = document.getElementById('imp-custom-sep-char')?.value || '';
    if (!sep) { showToast('Type a separator character first'); return; }
  }

  const lines = textarea.value.trim().split('\n').filter(l => l.trim());
  const terms = lines.map(l => {
    const idx = l.indexOf(sep);
    return idx !== -1 ? l.slice(0, idx).trim() : l.trim();
  }).filter(Boolean);

  if (!terms.length) { showToast('No words found'); return; }

  const pasteBtn = document.querySelector('.imp-btn-import');
  if (pasteBtn) { pasteBtn.disabled = true; pasteBtn.textContent = '⏳ Generating…'; }

  try {
    const result = await window.Api.ai.generate(terms.join('\n'));
    const cards  = result.cards || [];
    if (!cards.length) { showToast('No cards generated'); return; }
    _insertImportedAICards(cards);
    closeImportModal();
    showToast(`✓ ${cards.length} mnemonic card${cards.length !== 1 ? 's' : ''} generated`);
    textarea.value = '';
    const countEl = document.getElementById('imp-count');
    if (countEl) countEl.textContent = 'Paste your word list above';
  } catch (err) {
    showToast('AI failed: ' + err.message);
  } finally {
    if (pasteBtn) { pasteBtn.disabled = false; pasteBtn.textContent = 'Import cards'; }
  }
}

async function _handleFileSelect(file) {
  if (!file) return;
  const dropzone = document.getElementById('imp-dropzone');
  const titleEl  = dropzone?.querySelector('.imp-drop-title');
  const subEl    = dropzone?.querySelector('.imp-drop-sub');
  const btn      = document.querySelector('.imp-btn-import');

  if (titleEl) titleEl.textContent = file.name;
  if (subEl)   subEl.textContent   = 'Reading file…';
  if (btn)   { btn.disabled = true; btn.textContent = '⏳ Generating…'; }

  try {
    const text  = await file.text();
    const terms = text.split('\n')
      .map(l => l.split(/[,\t]/).map(p => p.trim())[0])
      .filter(Boolean);

    if (!terms.length) { showToast('No words found in file'); return; }

    if (subEl) subEl.textContent = `${terms.length} words found — generating mnemonics…`;

    const result = await window.Api.ai.generate(terms.join('\n'));
    const cards  = result.cards || [];
    if (!cards.length) { showToast('No cards generated'); return; }

    _insertImportedAICards(cards);
    closeImportModal();
    showToast(`✓ ${cards.length} mnemonic card${cards.length !== 1 ? 's' : ''} generated`);
  } catch (err) {
    showToast('File import failed: ' + err.message);
    if (titleEl) titleEl.textContent = 'Drop a file here';
    if (subEl)   subEl.textContent   = 'Supports .csv, .txt, .tsv';
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Import cards'; }
  }
}

/* ── 15. FOLDER HELPERS ──────────────────────────── */

function showFolderById(folderId) {
  const folder = _allFolders.find(f => String(f._id) === String(folderId));
  if (!folder) return;
  _currentFolderName = folder.name;
  _currentFolderId   = String(folderId);

  hideAll();
  _setLayout('two-col');
  _showView('folder-view');

  const titleEl = document.getElementById('folder-view-title');
  if (titleEl) titleEl.innerHTML = `📁 <em>${_escHtml(folder.name)}</em>`;

  const folderDeleteBtn = document.getElementById('folder-delete-btn');
  if (folderDeleteBtn) {
    folderDeleteBtn.dataset.arg1 = folderId;
    folderDeleteBtn.dataset.arg2 = 'folder';
  }

  const grid       = document.getElementById('folder-decks-grid');
  const emptyState = document.getElementById('folder-empty-state');
  if (!grid) return;
  grid.innerHTML = '';

  const folderDecks = (folder.deckIds || [])
    .map(id => _allDecks.find(d => String(d._id) === String(id)))
    .filter(Boolean);

  if (folderDecks.length === 0) {
    if (emptyState) emptyState.style.display = '';
    grid.style.display = 'none';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    grid.style.display = '';
    folderDecks.forEach(deck => {
      const cfg  = DECK_CONFIGS[deck.theme] || DECK_CONFIGS.amber;
      const card = document.createElement('div');
      card.className = 'md-set-card';
      card.dataset.action = 'showDeck';
      card.dataset.arg1   = deck._id;
      card.dataset.arg2   = deck.name;
      card.innerHTML = `
        <div class="md-set-banner" style="background:${cfg.bg}">
          <div class="md-set-emoji">${_escHtml(deck.emoji || '📖')}</div>
        </div>
        <div class="md-set-body">
          <div class="md-set-name">${_escHtml(deck.name)}</div>
          <div class="md-set-meta">${deck.cardCount || 0} card${deck.cardCount !== 1 ? 's' : ''}</div>
          <div class="md-set-prog-row">
            <div class="md-set-prog-bg"><div class="md-set-prog-fill" style="width:0%"></div></div>
            <div class="md-set-prog-pct">0%</div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
}

async function deleteDeck(deckId, opts = {}) {
  if (!deckId) return;
  const deck = _allDecks.find(d => String(d._id) === String(deckId));
  if (!deck) return;
  if (!opts.skipConfirm && !confirm(`Delete deck "${deck.name}"? This cannot be undone.`)) return;
  try {
    await window.Api.decks.delete(deckId);
    showToast(`Deleted "${deck.name}"`);
    await showMyDecks();
  } catch (err) {
    showToast('Failed to delete deck');
  }
}

async function deleteFolder(folderId, opts = {}) {
  if (!folderId) return;
  const folder = _allFolders.find(f => String(f._id) === String(folderId));
  if (!folder) return;
  if (!opts.skipConfirm && !confirm(`Delete folder "${folder.name}"? This will remove it from your library.`)) return;
  try {
    await window.Api.folders.delete(folderId);
    showToast(`Deleted "${folder.name}"`);
    await showMyDecks();
  } catch (err) {
    showToast('Failed to delete folder');
  }
}

function createDeckInFolder() {
  _pendingFolderId = _currentFolderId;
  showCreateDeck();
}

function showDeleteConfirm(type, id) {
  if (!type || !id) return;
  let title = 'Delete item?';
  let text  = 'Are you sure you want to delete this item?';
  if (type === 'deck') {
    const deck = _allDecks.find(d => String(d._id) === String(id));
    title = 'Delete deck?';
    text = deck ? `Delete "${deck.name}" from your library? This cannot be undone.` : text;
  } else if (type === 'folder') {
    const folder = _allFolders.find(f => String(f._id) === String(id));
    title = 'Delete folder?';
    text = folder ? `Delete folder "${folder.name}"? This will remove it from your library.` : text;
  }
  _pendingDelete = { type, id };
  const modal = document.getElementById('delete-confirm-modal');
  const titleEl = document.getElementById('delete-confirm-title');
  const textEl  = document.getElementById('delete-confirm-text');
  if (titleEl) titleEl.textContent = title;
  if (textEl)  textEl.textContent = text;
  const skipCb = document.getElementById('delete-skip-confirm');
  if (skipCb) skipCb.checked = false;
  if (!modal) return;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function cancelDelete() {
  _pendingDelete = null;
  const modal = document.getElementById('delete-confirm-modal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

async function confirmDelete() {
  if (!_pendingDelete) return;
  const skipCheckbox = document.getElementById('delete-skip-confirm');
  if (skipCheckbox?.checked) localStorage.setItem('sw_skip_delete_confirm', '1');
  const { type, id } = _pendingDelete;
  cancelDelete();
  if (type === 'deck') await deleteDeck(id, { skipConfirm: true });
  else if (type === 'folder') await deleteFolder(id, { skipConfirm: true });
}

function showAddDeckPicker() {
  const modal = document.getElementById('add-deck-modal');
  const list  = document.getElementById('adm-deck-list');
  if (!modal || !list) return;
  list.innerHTML = '';

  const nameEl = document.getElementById('adm-folder-name');
  if (nameEl) nameEl.textContent = _currentFolderName;

  if (_allDecks.length === 0) {
    list.innerHTML = '<div style="padding:20px;text-align:center;color:#9E9289;font-size:13px;">No decks yet — create one first!</div>';
  } else {
    const folder    = _allFolders.find(f => String(f._id) === _currentFolderId);
    const addedIds  = new Set((folder?.deckIds || []).map(id => String(id)));

    _allDecks.forEach(deck => {
      const cfg     = DECK_CONFIGS[deck.theme] || DECK_CONFIGS.amber;
      const already = addedIds.has(String(deck._id));
      const item    = document.createElement('div');
      item.className = 'adm-deck-item' + (already ? ' already-added' : '');
      item.innerHTML = `
        <div class="adm-deck-swatch" style="background:${cfg.bg}">${_escHtml(deck.emoji || '📖')}</div>
        <div class="adm-deck-info">
          <div class="adm-deck-name">${_escHtml(deck.name)}</div>
          <div class="adm-deck-meta">${deck.cardCount || 0} cards</div>
        </div>
        <div class="adm-deck-badge">${already ? '✓ Added' : '＋ Add'}</div>
      `;
      if (!already) {
        item.addEventListener('click', async () => {
          try {
            await window.Api.folders.addDeck(_currentFolderId, String(deck._id));
            const f = _allFolders.find(f => String(f._id) === _currentFolderId);
            if (f) f.deckIds = [...(f.deckIds || []), deck._id];
            closeAddDeckPicker();
            showFolderById(_currentFolderId);
            showToast(`"${deck.name}" added to ${_currentFolderName}`);
          } catch (err) {
            showToast('Failed to add deck to folder');
          }
        });
      }
      list.appendChild(item);
    });
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeAddDeckPicker() {
  const modal = document.getElementById('add-deck-modal');
  if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
}

function showNewFolderInput() {
  const modal = document.getElementById('new-folder-modal');
  const input = document.getElementById('new-folder-name');
  input.value = '';
  input.classList.remove('invalid');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  setTimeout(() => input.focus(), 80);
}

function cancelFolder() {
  const modal = document.getElementById('new-folder-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.getElementById('new-folder-name').value = '';
}

async function addFolder() {
  const input = document.getElementById('new-folder-name');
  const name  = input.value.trim();
  if (!name) {
    input.classList.add('invalid');
    setTimeout(() => input.classList.remove('invalid'), 500);
    input.focus();
    return;
  }
  try {
    const folder = await window.Api.folders.create({ name });
    _allFolders.push(folder);
    _renderFolderList();
    cancelFolder();
    showToast('Folder "' + name + '" created');
  } catch (err) {
    showToast('Failed to create folder: ' + err.message);
  }
}

/* ── 16. ACCOUNT SECTION SWITCHER ────────────────── */

function switchAccSection(id, navEl) {
  const accView = document.getElementById('account-view');
  accView.querySelectorAll('.acc-section').forEach(s => s.classList.remove('active'));
  document.getElementById('acc-' + id).classList.add('active');
  accView.querySelectorAll('.acc-nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
}

/* ── 17. FEATURED CARD ACTIONS ───────────────────── */

function featuredStudyNow() {
  if (_currentDeckCards.length) {
    showStudy();
  } else if (_allDecks.length) {
    showDeck(_allDecks[0]._id, _allDecks[0].name).then(() => { if (_currentDeckCards.length) showStudy(); });
  } else {
    showToast('Create a deck first');
  }
}

function featuredAddToDeck(btn) {
  if (btn.dataset.added) return;
  btn.dataset.added = '1';
  btn.textContent   = '✓ Added';
  btn.style.background   = 'rgba(255,255,255,0.22)';
  btn.style.borderColor  = 'rgba(255,255,255,0.4)';
  showToast('✓ Added to current deck');
}

function featuredListen(btn) {
  if (!window.speechSynthesis) { showToast('Speech not supported in this browser'); return; }
  window.speechSynthesis.cancel();
  const utter  = new SpeechSynthesisUtterance('Ephemeral');
  utter.lang   = 'en-US'; utter.rate = 0.85; utter.pitch = 1;
  const orig   = btn.textContent;
  btn.textContent = '🔊 …'; btn.style.opacity = '0.7';
  utter.onend  = () => { btn.textContent = orig; btn.style.opacity = ''; };
  utter.onerror = () => { btn.textContent = orig; btn.style.opacity = ''; };
  window.speechSynthesis.speak(utter);
}

/* ── 18. EMOJI KEYBOARD ──────────────────────────── */

const _allEmojis = [...new Set(Object.values(EMOJI_DATA).flat())];
let _currentEmojiCat  = 'all';
let _selectedEmojiVal = '📖';

function initEmojiKeyboard() { renderEmojiGrid(_allEmojis); }

function renderEmojiGrid(emojis) {
  const grid = document.getElementById('emoji-keyboard');
  if (!grid) return;
  grid.innerHTML = emojis.map(e =>
    `<div class="ekb-item${e === _selectedEmojiVal ? ' selected' : ''}" data-emoji="${e}">${e}</div>`
  ).join('');
}

function pickEmoji(e) {
  _selectedEmojiVal = e;
  document.querySelectorAll('.ekb-item').forEach(el => el.classList.toggle('selected', el.dataset.emoji === e));
  const prev = document.getElementById('emoji-preview-large');
  if (prev) prev.textContent = e;
  const previewIcon = document.getElementById('preview-icon');
  if (previewIcon) previewIcon.textContent = e;
}

function showEmojiCat(btn, cat) {
  _currentEmojiCat = cat;
  document.querySelectorAll('.ecat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('emoji-search').value = '';
  renderEmojiGrid(cat === 'all' ? _allEmojis : (EMOJI_DATA[cat] || _allEmojis));
}

function filterEmojis(query) {
  if (!query.trim()) {
    renderEmojiGrid(_currentEmojiCat === 'all' ? _allEmojis : (EMOJI_DATA[_currentEmojiCat] || _allEmojis));
    return;
  }
  const pool    = _currentEmojiCat === 'all' ? _allEmojis : (EMOJI_DATA[_currentEmojiCat] || _allEmojis);
  const results = pool.filter(e => e.includes(query.trim()));
  renderEmojiGrid(results.length ? results : pool.slice(0, 16));
}

function openCustomEmoji(btn) {
  document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('selected'));
  btn.classList.add('selected');
  const box = document.getElementById('custom-emoji-box');
  if (!box) return;
  box.style.display = box.style.display === 'flex' ? 'none' : 'flex';
  if (box.style.display === 'flex') document.getElementById('custom-emoji-input').focus();
}

function applyCustomEmoji(val) {
  if (!val) return;
  const prev = document.getElementById('deck-preview-emoji');
  if (prev) prev.textContent = val;
}

/* ── 19. USER UI + STREAK + RENAME ──────────────── */

function _getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return String(name || '?').slice(0, 2).toUpperCase();
}


async function loadStreak() {
  try {
    const { streak } = await window.Api.sessions.streak();
    const badge  = document.querySelector('.streak-badge');
    const statEl = document.getElementById('acc-stat-streak');
    if (badge)  badge.textContent  = streak > 0 ? `🔥 ${streak}-day streak` : '🔥 Start your streak!';
    if (statEl) statEl.textContent = streak > 0 ? `🔥 ${streak}` : '🔥 0';
  } catch (_) {}
}

function renameDeck() {
  const titleEl = document.getElementById('deck-hero-title');
  if (!titleEl || titleEl.tagName === 'INPUT') return;
  const current = titleEl.textContent.trim();

  const input = document.createElement('input');
  input.className = 'dv-rename-input';
  input.value     = current;
  input.maxLength = 60;
  titleEl.replaceWith(input);
  input.focus();
  input.select();

  let saved = false;

  function _restoreTitle(name) {
    const t = document.createElement('div');
    t.className = 'dv-title';
    t.id        = 'deck-hero-title';
    t.textContent = name;
    input.replaceWith(t);
  }

  async function save() {
    if (saved) return;
    saved = true;
    const newName = input.value.trim();
    if (!newName || newName === current) { _restoreTitle(current); return; }
    try {
      await window.Api.decks.update(String(_currentDeckId), { name: newName });
      const deck = _allDecks.find(d => String(d._id) === String(_currentDeckId));
      if (deck) deck.name = newName;
      const bcEl = document.getElementById('deck-breadcrumb-inner');
      if (bcEl) bcEl.textContent = 'My Decks · ' + newName;
      _restoreTitle(newName);
      showToast('✓ Deck renamed');
    } catch (err) {
      _restoreTitle(current);
      showToast('Failed to rename deck');
    }
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  { e.preventDefault(); save(); }
    if (e.key === 'Escape') { saved = true; _restoreTitle(current); }
  });
  input.addEventListener('blur', save);
}

/* ── 20. APP INIT ────────────────────────────────── */

window._appInit = async function () {
  await showMyDecks();
};

/* ── 20. EVENT DELEGATION + INIT ─────────────────── */

async function init() {
  /* Force autocomplete off for all inputs */
  document.querySelectorAll('input').forEach(i => i.setAttribute('autocomplete', 'off'));
  document.addEventListener('focusin', e => {
    if (e.target.tagName === 'INPUT') e.target.setAttribute('autocomplete', 'off');
  });

  /* Deck card tags → navigate to deck */
  document.addEventListener('click', e => {
    const tag = e.target.closest('.deck-tag');
    if (tag) {
      e.preventDefault(); e.stopPropagation();
      const card = tag.closest('.flashcard');
      if (card) showDeck(card.dataset.arg1, tag.textContent.replace('→','').trim());
    }
  });

  /* MC option click */
  document.addEventListener('click', e => {
    const opt = e.target.closest('.mc-option');
    if (opt && !opt.classList.contains('answered')) {
      answerMC(opt, opt.dataset.option, opt.dataset.correct);
    }
  });

  /* Deck tabs (visual only) */
  document.addEventListener('click', e => {
    const tab = e.target.closest('.deck-tab');
    if (tab) {
      document.querySelectorAll('.deck-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    }
  });

  /* Emoji keyboard item clicks */
  document.addEventListener('click', e => {
    const item = e.target.closest('.ekb-item');
    if (item) pickEmoji(item.dataset.emoji);
  });

  /* Card editor delete buttons */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.cer-delete');
    if (btn) btn.closest('.card-editor-row').remove();
  });

  /* Data-action button delegation */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    e.preventDefault();
    const action = btn.dataset.action;
    const arg1   = btn.dataset.arg1;
    const arg2   = btn.dataset.arg2;
    const actions = {
      showHome, showMyDecks, showDeck: () => showDeck(arg1, arg2),
      showExploreDeck: () => showExploreDeck(arg1),
      showFlashcards, filterCategory: () => filterCategory(arg1),
      showGoal, showCreateDeck, showCreateCards, showStudy, exitStudy,
      showMemory, exitMemory, showMultipleChoice, exitMC, showExplore, showAccount,
      restartStudy,
      flipCard: () => {
        if (e.target.closest('#fc-action-row')) return;
        const wrap   = document.getElementById('fc-wrap');
        const rect   = wrap.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
        if (!rect.width || clientX == null) { flipCard(); return; }
        const relX = (clientX - rect.left) / rect.width;
        if (relX < 0.25)      prevCard();
        else if (relX > 0.75) nextCardNav();
        else                  flipCard();
      },
      nextCardKnew: () => nextCard(true), nextCardForgot: () => nextCard(false),
      nextMCQuestion, revealMCHint, initMC, initMemory,
      featuredStudyNow, featuredListen: () => featuredListen(btn),
      featuredAddToDeck: () => featuredAddToDeck(btn),
      toggleWord: () => toggleWord(arg1),
      deleteCard: () => deleteCard(arg1),
      editCard:   () => editCard(arg1),
      showDeleteConfirm: () => showDeleteConfirm(arg2, arg1),
      confirmDelete: confirmDelete,
      cancelDelete,
      renameDeck,
      deleteDeck: () => deleteDeck(arg1),
      deleteFolder: () => deleteFolder(arg1),
      markCard:   () => markCard(arg1, arg2),
      showCreateDeckFromHome: showCreateDeck,
      showGoalFromSidebar: showGoal,
      createDeck, addCardRow,
      selectColor: () => selectColor(btn, arg1),
      selectEmoji: () => selectEmoji(btn, arg1),
      pickQuickEmoji: () => pickQuickEmoji(btn, arg1),
      toggleNamePanel, confirmDeckName,
      selectMethod: () => selectMethod(btn, arg1),
      selectSep:    () => selectSep(btn, arg1),
      extractWithSep, extractWithAI,
      showImportModal, closeImportModal,
      switchImportTab: () => switchImportTab(btn, arg1), importCards,
      openFolder: () => {
        const folderId = btn.dataset.folderId || btn.closest('.md-folder')?.dataset.folderId;
        if (folderId) showFolderById(folderId);
      },
      createDeckInFolder, showAddDeckPicker, closeAddDeckPicker,
      showNewFolderInput, cancelFolder, addFolder,
      addInlineCard,
      sortSets: () => sortSets(arg1),
      sortExploreSets: () => sortExploreSets(arg1),
      filterExplore:   () => filterExplore(arg1),
      openCustomEmoji: () => openCustomEmoji(btn),
      showEmojiCat:   () => showEmojiCat(btn, arg1),
      switchAccSection: () => switchAccSection(arg1, btn),
      saveProfile,
    };
    if (actions[action]) actions[action]();
  });

  /* Right-click context menu on deck cards and folder chips */
  const ctxMenu = document.getElementById('ctx-menu');
  const ctxDeleteBtn = document.getElementById('ctx-delete-btn');

  document.addEventListener('contextmenu', e => {
    const deckCard = e.target.closest('.md-set-card');
    const folderChip = e.target.closest('.md-folder:not(.md-folder-add)');
    if (!deckCard && !folderChip) return;
    e.preventDefault();

    if (deckCard) {
      _ctxTarget = { type: 'deck', id: deckCard.dataset.arg1 };
    } else {
      _ctxTarget = { type: 'folder', id: folderChip.dataset.folderId };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mw = 160;
    const mh = 50;
    let x = e.clientX;
    let y = e.clientY;
    if (x + mw > vw) x = vw - mw - 8;
    if (y + mh > vh) y = vh - mh - 8;

    ctxMenu.style.left = x + 'px';
    ctxMenu.style.top  = y + 'px';
    ctxMenu.classList.add('open');
  });

  ctxDeleteBtn.addEventListener('click', () => {
    if (!_ctxTarget) return;
    const { type, id } = _ctxTarget;
    _closeCtxMenu();
    if (localStorage.getItem('sw_skip_delete_confirm') === '1') {
      if (type === 'deck')   deleteDeck(id,   { skipConfirm: true });
      else if (type === 'folder') deleteFolder(id, { skipConfirm: true });
    } else {
      showDeleteConfirm(type, id);
    }
  });

  document.addEventListener('click', e => {
    if (ctxMenu.classList.contains('open') && !ctxMenu.contains(e.target)) _closeCtxMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') _closeCtxMenu(); });
  document.addEventListener('scroll', _closeCtxMenu, true);

  /* Keyboard shortcuts in study mode */
  document.addEventListener('keydown', e => {
    const sv = document.getElementById('study-view');
    if (sv && sv.classList.contains('active')) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
      if (e.key === 'ArrowRight') nextCardNav();
      if (e.key === 'ArrowLeft')  prevCard();
      if (e.key === 'Escape') exitStudy();
    }
  });

  /* New folder modal */
  const folderInput = document.getElementById('new-folder-name');
  if (folderInput) {
    folderInput.addEventListener('keydown', e => {
      if (e.key === 'Enter')  { e.preventDefault(); addFolder(); }
      if (e.key === 'Escape') cancelFolder();
    });
  }
  const folderModal = document.getElementById('new-folder-modal');
  if (folderModal) folderModal.addEventListener('click', e => { if (e.target === folderModal) cancelFolder(); });

  const importModal = document.getElementById('import-modal');
  if (importModal) importModal.addEventListener('click', e => { if (e.target === importModal) closeImportModal(); });

  const addDeckModal = document.getElementById('add-deck-modal');
  if (addDeckModal) addDeckModal.addEventListener('click', e => { if (e.target === addDeckModal) closeAddDeckPicker(); });

  const deleteConfirmModal = document.getElementById('delete-confirm-modal');
  if (deleteConfirmModal) deleteConfirmModal.addEventListener('click', e => { if (e.target === deleteConfirmModal) cancelDelete(); });

  const pasteArea = document.getElementById('imp-paste-area');
  if (pasteArea) {
    pasteArea.addEventListener('input', () => {
      const count = document.getElementById('imp-count');
      const lines = pasteArea.value.trim().split('\n').filter(l => l.trim()).length;
      count.textContent = pasteArea.value.trim()
        ? `${lines} card${lines !== 1 ? 's' : ''} detected`
        : 'Paste your word list above';
    });
  }

  const dropzone  = document.getElementById('imp-dropzone');
  const fileInput = dropzone?.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.addEventListener('change', () => { if (fileInput.files[0]) _handleFileSelect(fileInput.files[0]); });
  }
  if (dropzone) {
    dropzone.addEventListener('dragover',  e => { e.preventDefault(); dropzone.classList.add('dragging'); });
    dropzone.addEventListener('dragleave', ()  => dropzone.classList.remove('dragging'));
    dropzone.addEventListener('drop',      e  => {
      e.preventDefault();
      dropzone.classList.remove('dragging');
      const file = e.dataTransfer.files[0];
      if (file) _handleFileSelect(file);
    });
  }

  await showMyDecks();
  loadStreak();
}

document.addEventListener('DOMContentLoaded', init);
