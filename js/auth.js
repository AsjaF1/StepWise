/* ═══════════════════════════════════════════════════
   StepWise — auth.js
   Token management + auth form controller
════════════════════════════════════════════════════ */

const _TOKEN_KEY = 'sw_token';

function _parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch { return null; }
}

window.Auth = {
  getSession: async function () {
    const token = localStorage.getItem(_TOKEN_KEY);
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('bad token');
      const payload = _parseJwt(token);
      if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
        localStorage.removeItem(_TOKEN_KEY);
        return null;
      }
      return { token };
    } catch {
      localStorage.removeItem(_TOKEN_KEY);
      return null;
    }
  },
  getToken: function () {
    return localStorage.getItem(_TOKEN_KEY);
  },
  getUser: function () {
    const token = localStorage.getItem(_TOKEN_KEY);
    if (!token) return null;
    const p = _parseJwt(token);
    if (!p) return null;
    const username = p.user_metadata?.username || p.email?.split('@')[0] || 'User';
    return { id: p.sub, email: p.email || '', username };
  },
  signOut: function () {
    localStorage.removeItem(_TOKEN_KEY);
    window.location.reload();
  },
};

window._showAuthView = function () {
  const v = document.getElementById('auth-view');
  if (v) v.classList.add('active');
  _initAuthForm();
};

window._hideAuthView = function () {
  const v = document.getElementById('auth-view');
  if (v) v.classList.remove('active');
};

/* Called by app.js _appInit — kept for compatibility */
window._appInit = async function () {
  await showMyDecks();
};

let _formInitialized = false;
function _initAuthForm() {
  if (_formInitialized) return;
  _formInitialized = true;

  const form        = document.getElementById('auth-form');
  const tabLogin    = document.getElementById('tab-login');
  const tabSignup   = document.getElementById('tab-signup');
  const submitBtn   = document.getElementById('auth-submit-btn');
  const errorEl     = document.getElementById('auth-error');
  const successEl   = document.getElementById('auth-success');
  const usernameRow = document.getElementById('auth-username-row');
  let mode = 'login';

  function switchMode(m) {
    mode = m;
    if (tabLogin)  tabLogin.classList.toggle('active', m === 'login');
    if (tabSignup) tabSignup.classList.toggle('active', m === 'signup');
    if (submitBtn) submitBtn.textContent = m === 'login' ? 'Log in →' : 'Sign up →';
    if (usernameRow) usernameRow.style.display = m === 'signup' ? '' : 'none';
    if (errorEl)   { errorEl.style.display = 'none'; errorEl.textContent = ''; }
    if (successEl) { successEl.style.display = 'none'; }
  }

  if (tabLogin)  tabLogin.addEventListener('click', () => switchMode('login'));
  if (tabSignup) tabSignup.addEventListener('click', () => switchMode('signup'));

  if (!form) return;

  /* Belt-and-suspenders autofill block: set readonly, drop it on first focus */
  form.querySelectorAll('input[type="text"], input[type="email"]').forEach(inp => {
    inp.setAttribute('readonly', true);
    inp.addEventListener('focus', () => inp.removeAttribute('readonly'), { once: true });
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = document.getElementById('auth-email')?.value.trim() || '';
    const password = document.getElementById('auth-password')?.value || '';
    const username = document.getElementById('auth-username')?.value.trim() || '';

    if (errorEl)   { errorEl.style.display = 'none'; errorEl.textContent = ''; }
    if (successEl) { successEl.style.display = 'none'; }
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = mode === 'login' ? 'Logging in…' : 'Signing up…'; }

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body     = mode === 'login' ? { email, password } : { email, password, username };
      const r        = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Request failed');

      if (mode === 'signup' && !data.token) {
        if (successEl) { successEl.textContent = 'Check your email to confirm your account.'; successEl.style.display = ''; }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign up →'; }
        return;
      }

      localStorage.setItem(_TOKEN_KEY, data.token);
      window._hideAuthView();
      if (typeof _updateUserUI === 'function') _updateUserUI();
      if (typeof showMyDecks   === 'function') await showMyDecks();
      if (typeof loadStreak    === 'function') loadStreak();
    } catch (err) {
      if (errorEl)   { errorEl.textContent = err.message; errorEl.style.display = ''; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = mode === 'login' ? 'Log in →' : 'Sign up →'; }
    }
  });
}
