import {
  requireAuth,
  getLatestHrvData,
  fetchHrvFromKubios,
  getRecommendations,
  saveMood,
  showSnackbar,
} from '../js/api.js';
import { initLayout } from '../js/layout.js';

// Varmistetaan kirjautuminen
requireAuth();

// Alustus kun sivu on ladattu
document.addEventListener('DOMContentLoaded', () => {
  initLayout(); // Aktivoi navigaation, teeman ja yhteiset overlayt
  initHome();
});

async function initHome() {
  await Promise.all([loadHrvData(), loadRecommendations()]);
}

// ── HRV-data ───────────────────────────────────────────────────────────────

async function loadHrvData() {
  try {
    const data = await getLatestHrvData();
    const latest = Array.isArray(data) ? data[data.length - 1] : data;
    if (!latest) return;

    document.getElementById('hrv-rmssd').textContent =
      latest.rmssd != null ? Math.round(latest.rmssd) : '–';
    document.getElementById('hrv-lfhf').textContent =
      latest.lf_hf != null ? latest.lf_hf.toFixed(2) : '–';
    document.getElementById('hrv-stress').textContent =
      latest.stress_index != null ? Math.round(latest.stress_index) : '–';
    document.getElementById('hrv-recovery').textContent =
      latest.readiness != null ? Math.round(latest.readiness) : '–';
  } catch (e) {
    console.error('Virhe HRV-datan latauksessa:', e);
  }
}

const fetchBtn    = document.getElementById('fetch-hrv-btn');
const hrvStatus   = document.getElementById('hrv-status');

fetchBtn?.addEventListener('click', async () => {
  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Haetaan…';
  hrvStatus.textContent = '';
  try {
    await fetchHrvFromKubios();
    hrvStatus.textContent = 'Päivitetty ✓';
    await loadHrvData();
  } catch {
    hrvStatus.textContent = 'Haku epäonnistui';
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Päivitä Kubioksesta';
  }
});

// ── Suositukset ────────────────────────────────────────────────────────────

const EXERCISE_ICONS = {
  walk: '🚶', run: '🏃', bike: '🚴', yoga: '🧘',
  swim: '🏊', gym: '🏋️', stretch: '🤸', breathe: '🌬️',
};

function defaultRecommendations() {
  return [
    { type: 'walk',    name: 'Kevyt kävely', description: '20–30 min ulkoilu raikkaassa ilmassa' },
    { type: 'breathe', name: 'Hengitysharjoitus', description: '4-7-8 -tekniikka, 5 minuuttia' },
    { type: 'stretch', name: 'Venyttely', description: 'Niskan ja hartioiden lyhyt venytysohjelma' },
  ];
}

function renderRecommendations(items) {
  const container = document.getElementById('recommendations-list');
  if (!container) return;
  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">✅</div>
        <div class="empty-state__text">Ei suosituksia tällä hetkellä — hienoa!</div>
      </div>`;
    return;
  }
  container.innerHTML = items
    .map((r) => {
      const icon = EXERCISE_ICONS[r.type] ?? '💪';
      return `
        <div class="exercise-card">
          <div class="exercise-card__icon">${icon}</div>
          <div class="exercise-card__body">
            <div class="exercise-card__name">${r.name ?? r.title ?? 'Harjoitus'}</div>
            <div class="exercise-card__desc">${r.description ?? ''}</div>
          </div>
        </div>`;
    })
    .join('');
}

async function loadRecommendations() {
  try {
    const recs = await getRecommendations();
    renderRecommendations(recs);
  } catch {
    renderRecommendations(defaultRecommendations());
  }
}

// ── Mieliala-liukusäädin ───────────────────────────────────────────────────

const moodSlider = document.getElementById('mood-slider');
const userMessageBox = document.getElementById('daily-log-message');
const moodValueLabel = document.getElementById('mood-value-label');
const MOOD_LABELS = ['', 'Erinomainen 😄', 'Hyvä 🙂', 'Normaali 😐', 'Väsynyt 😔', 'Erittäin kuormittunut 😟'];

function updateMoodLabel() {
  if (moodValueLabel && moodSlider) {
    moodValueLabel.textContent = MOOD_LABELS[moodSlider.value] ?? '';
  }
}

moodSlider?.addEventListener('input', updateMoodLabel);
updateMoodLabel();

document.getElementById('save-mood-btn')?.addEventListener('click', async () => {
  const val = parseInt(moodSlider.value, 10);
  const userText = userMessageBox.value;
  try {
    await saveMood(val, val, userText);
    showSnackbar('Kuormitustaso tallennettu ✓', 'success');
  } catch {
    showSnackbar('Tallennus epäonnistui', 'error');
  }
});
