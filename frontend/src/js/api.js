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

export function clearLocalStorage() {
  localStorage.removeItem('tues_token');
  localStorage.removeItem('userId');
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
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
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
  const data = await apiFetch('/user/login', {
    method: 'POST',
    body: JSON.stringify({email, password}),
  });
  saveToken(data.token);
  return data;
}

/** POST /api/users – Rekisteröityminen */
export async function register(email, password) {
  return apiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({email, password}),
  });
}

/** Uloskirjautuminen (paikallinen) */
export function logout() {
  clearLocalStorage();
  window.location.href = '/src/auth/login.html';
}

// ── Käyttäjäprofiili ───────────────────────────────────────────────────────

/** GET /api/user/profile – Kirjautuneen käyttäjän profiilitiedot */
export async function getProfile() {
  return apiFetch('/user/profile');
}

/** PATCH /api/user/profile – Päivitä profiilitiedot */
export async function updateProfile(profileData) {
  return apiFetch('/user/profile', {
    method: 'PATCH',
    body: JSON.stringify(profileData),
  });
}

// ── HRV-data (Kubios) ──────────────────────────────────────────────────────

/** GET /api/hrv/data – Haetun HRV-datan aikasarja */
export async function getHrvData() {
  return apiFetch('/hrv/data');
}

/** GET /api/hrv/data/latest - Palauttaa uusimman HRV-mittauksen */
export async function getLatestHrvData() {
  return apiFetch('/hrv/data/latest');
}

/** POST /api/hrv/fetch – Käynnistää HRV-datan noudon Kubioksesta */
export async function fetchHrvFromKubios() {
  return apiFetch('/hrv/fetch', {method: 'POST'});
}

// -- Viikottaiset raportit ──────────────────────────────────────────────────

/** GET /api/reports/user/:userId - Palauttaa tietyn käyttäjän viikkoraportit */
export async function getWeeklyReports() {
  return apiFetch(`/reports/user`);
}

// ── Mieliala / kuormitus ───────────────────────────────────────────────────

/** POST /api/mood – Tallentaa käyttäjän tunnetilan ja koetun kuormituksen */
export async function saveMood(mood, workload, message) {
  return apiFetch('/entry/mood', {
    method: 'POST',
    body: JSON.stringify({mood, workload, message}),
  });
}

// ── Suositukset ────────────────────────────────────────────────────────────

/** GET /api/recommendations – Hakee personalisoidut suositukset */
export async function getRecommendations() {
  return apiFetch('/recommendations');
}

// ── Datan jakaminen ammattilaiselle ────────────────────────────────────────

/** POST /api/sharing/patient/claim-code – Jakaa dataa ammattilaiselle */
export async function shareWithProfessional(shareCode) {
  return apiFetch('/user/patient/claim-code', {
    method: 'POST',
    body: JSON.stringify({shareCode}),
  });
}

export async function revokeProfessionalAccess() {
  return apiFetch('/user/patient/revoke', {
    method: 'DELETE',
  });
}

// ── Käyttäjän poistaminen ──────────────────────────────────────────────────
export const deleteAccount = async () => {
  return await apiFetch('/user/delete', {
    method: 'DELETE',
  });
};

// ── Ammattilaisen API-kutsut ───────────────────────────────────────────────

/** Luo kutsukoodin, joka linkittää käyttäjän ja ammattilaisen */
export async function generateCode() {
  return apiFetch('/pro/generate-code', {method: 'POST'});
}

/** Hakee kaikki potilaat, jotka ovat linkittäneet tilinsä tälle ammattilaiselle */
export async function getPatients() {
  return apiFetch('/pro/patients');
}

/** * Hakee tietyn potilaan viikkoraportit
 * Polku vastaa backendin: /api/pro/patients/:id/reports
 */
export async function getPatientReports(patientId) {
  return apiFetch(`/pro/patients/${patientId}/reports`);
}

/** * Hakee tarkat päivätason tiedot (Kubios + Päiväkirja) tietyltä väliltä
 * Käytetään haitari-näkymän graafeihin.
 * @param {string} start - 'YYYY-MM-DD'
 * @param {string} end - 'YYYY-MM-DD'
 */
export async function getPatientDailyLogs(patientId, start, end) {
  return apiFetch(`/pro/patients/${patientId}/daily?start=${start}&end=${end}`);
}

/** * Päivittää ammattilaisen kommentin tiettyyn raporttiin
 * Polku vastaa backendin PATCH-reittiä
 */
export async function updateReportFeedback(reportId, feedback) {
  return apiFetch(`/pro/reports/feedback`, {
    method: 'PUT',
    body: JSON.stringify({reportId, feedback}),
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
  const current =
    document.documentElement.getAttribute('data-theme') ?? 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('tues_theme', next);
  return next;
}
