/**
 * api.js – Fetch-apufunktiot, token-hallinta ja API-kutsut
 * Kaikki endpointit perustuvat TUES-vaatimusdokumentin kohtaan 7.3
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// ── Token-hallinta ─────────────────────────────────────────────────────────

export function saveToken(token) {
  localStorage.setItem('tues_token', token);
}

export function getToken() {
  return localStorage.getItem('tues_token');
}

export function clearToken() {
  localStorage.removeItem('tues_token');
}

export function isLoggedIn() {
  return !!getToken();
}

// ── Sivuohjaukset ──────────────────────────────────────────────────────────

export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/src/auth/login.html';
  }
}

export function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = '/src/home/index.html';
  }
}

// ── Yhteinen fetch-apufunktio ──────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.href = '/src/auth/login.html';
    return;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? `Virhe ${response.status}`);
  }

  return data;
}

// ── Autentikointi ──────────────────────────────────────────────────────────

/** POST /api/login – Kirjautuminen, palauttaa JWT-tokenin */
export async function login(email, password) {
  const data = await apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  saveToken(data.token);
  return data;
}

/** POST /api/users – Rekisteröityminen */
export async function register(email, password) {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/** Uloskirjautuminen (paikallinen) */
export function logout() {
  clearToken();
  window.location.href = '/src/auth/login.html';
}

// ── Käyttäjäprofiili ───────────────────────────────────────────────────────

/** GET /api/user/profile – Kirjautuneen käyttäjän profiilitiedot */
export async function getProfile() {
  return apiFetch('/user/profile');
}

/** PUT /api/user/profile – Päivitä profiilitiedot */
export async function updateProfile(profileData) {
  return apiFetch('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

// ── HRV-data (Kubios) ──────────────────────────────────────────────────────

/** GET /api/hrv/data – Haetun HRV-datan aikasarja */
export async function getHrvData() {
  return apiFetch('/hrv/data');
}

/** POST /api/hrv/fetch – Käynnistää HRV-datan noudon Kubioksesta */
export async function fetchHrvFromKubios() {
  return apiFetch('/hrv/fetch', { method: 'POST' });
}

// ── Mieliala / kuormitus ───────────────────────────────────────────────────

/** POST /api/mood – Tallentaa käyttäjän tunnetilan ja koetun kuormituksen */
export async function saveMood(mood, workload) {
  return apiFetch('/mood', {
    method: 'POST',
    body: JSON.stringify({ mood, workload }),
  });
}

// ── Suositukset ────────────────────────────────────────────────────────────

/** GET /api/recommendations – Hakee personalisoidut suositukset */
export async function getRecommendations() {
  return apiFetch('/recommendations');
}

// ── Datan jakaminen ammattilaiselle ────────────────────────────────────────

/** POST /api/share – Jakaa dataa ammattilaiselle */
export async function shareWithProfessional(professionalId) {
  return apiFetch('/share', {
    method: 'POST',
    body: JSON.stringify({ professionalId }),
  });
}

// ── Snackbar-apufunktio ────────────────────────────────────────────────────

export function showSnackbar(message, type = 'default') {
  let el = document.getElementById('snackbar');
  if (!el) {
    el = document.createElement('div');
    el.id = 'snackbar';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = `show ${type}`;
  setTimeout(() => {
    el.className = el.className.replace('show', '').trim();
  }, 3000);
}

// ── Teema (tumma/vaalea) ───────────────────────────────────────────────────

export function applyTheme() {
  const saved = localStorage.getItem('tues_theme') ?? 'light';
  document.documentElement.setAttribute('data-theme', saved);
  return saved;
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') ?? 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tues_theme', next);
  return next;
}
