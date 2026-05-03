/* ═══════════════════════════════════════════════════
   StepWise — api.js
   Thin fetch wrapper around the Express backend.
   Exposes window.Api for use in app.js
════════════════════════════════════════════════════ */

const API_BASE = 'https://stepwise-41ue.onrender.com';

async function _req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);

  const res  = await fetch(API_BASE + path, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

window.Api = {
  auth: {
    updateProfile: (data) => _req('PUT', '/api/auth/profile', data),
  },
  decks: {
    list:   ()         => _req('GET',    '/api/decks'),
    create: (data)     => _req('POST',   '/api/decks', data),
    get:    (id)       => _req('GET',    `/api/decks/${id}`),
    update: (id, data) => _req('PUT',    `/api/decks/${id}`, data),
    delete: (id)       => _req('DELETE', `/api/decks/${id}`),
  },
  cards: {
    list:   (deckId)       => _req('GET',    `/api/cards/deck/${deckId}`),
    create: (deckId, data) => _req('POST',   `/api/cards/deck/${deckId}`, data),
    update: (id, data)     => _req('PUT',    `/api/cards/${id}`, data),
    delete: (id)           => _req('DELETE', `/api/cards/${id}`),
  },
  folders: {
    list:       ()               => _req('GET',    '/api/folders'),
    create:     (data)           => _req('POST',   '/api/folders', data),
    update:     (id, data)       => _req('PUT',    `/api/folders/${id}`, data),
    delete:     (id)             => _req('DELETE', `/api/folders/${id}`),
    addDeck:    (id, deckId)     => _req('POST',   `/api/folders/${id}/decks`, { deckId }),
    removeDeck: (id, deckId)     => _req('DELETE', `/api/folders/${id}/decks/${deckId}`),
  },
  progress: {
    update:  (cardId, status) => _req('PUT', '/api/progress', { cardId, status }),
    forDeck: (deckId)         => _req('GET', `/api/progress/deck/${deckId}`),
  },
  sessions: {
    record: (data) => _req('POST', '/api/sessions', data),
    list:   ()     => _req('GET',  '/api/sessions'),
    streak: ()     => _req('GET',  '/api/sessions/streak'),
  },
  ai: {
    generate: (text) => _req('POST', '/api/ai/generate', { text }),
  },
};
