import {
  requireAuth,
  getLatestHrvData,
  fetchHrvFromKubios,
  getRecommendations,
  saveMood,
  showSnackbar,
} from '../js/api.js';
import {initLayout} from '../js/layout.js';

// Varmistetaan kirjautuminen
requireAuth();

// Alustus kun sivu on ladattu
document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  initHome();
});

async function initHome() {
  // Ladataan alkunäkymä
  await loadHrvDataAndExercises();
}

// ── HRV-DATA JA ANALYYSI ───────────────────────────────────────────────────

async function loadHrvDataAndExercises() {
  try {
    const response = await getLatestHrvData();

    const latest = response.measurement || response;
    if (!latest) return;

    updateHrvUI(latest);

    if (response.recommendations) {
      const exercises = response.recommendations.exercises || [];
      renderRecommendations(exercises);
    } else {
      await loadRecommendations();
    }
  } catch (e) {
    console.error('Virhe HRV-datan latauksessa:', e);
    // Näytetään oletukset, jos haku kyykkää
    renderRecommendations(defaultRecommendations());
  }
}

// Apufunktio numeroiden päivitykseen
function updateHrvUI(latest) {
  const elements = {
    'hrv-rmssd': latest.rmssd != null ? Math.round(latest.rmssd) : '–',
    'hrv-lfhf': latest.lf_hf != null ? latest.lf_hf.toFixed(2) : '–',
    'hrv-stress':
      latest.stress_index != null ? Math.round(latest.stress_index) : '–',
    'hrv-recovery':
      latest.readiness != null ? Math.round(latest.readiness) : '–',
  };

  for (const [id, val] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

// Päivitysnappi
const fetchBtn = document.getElementById('fetch-hrv-btn');
const hrvStatus = document.getElementById('hrv-status');

fetchBtn?.addEventListener('click', async () => {
  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Haetaan…';
  hrvStatus.textContent = '';

  try {
    // Synkronoi Kubioksen data tietokantaan
    await fetchHrvFromKubios();
    hrvStatus.textContent = 'Päivitetty ✓';

    // Lataa Kubioksen data ja harjoitteet tietokannasta
    await loadHrvDataAndExercises();

    showSnackbar('Tiedot ja harjoitukset päivitetty!', 'success');
  } catch (err) {
    console.error('Päivitysvirhe:', err);
    hrvStatus.textContent = 'Haku epäonnistui';
    showSnackbar('Haku epäonnistui. Tarkista yhteys.', 'error');
  } finally {
    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Päivitä Kubioksesta';
  }
});

// ── SUOSITUKSET ────────────────────────────────────────────────────────────

const EXERCISE_ICONS = {
  walk: '🚶',
  run: '🏃',
  bike: '🚴',
  yoga: '🧘',
  swim: '🏊',
  gym: '🏋️',
  stretch: '🤸',
  breathe: '🌬️',
};

function defaultRecommendations() {
  return [
    {
      type: 'walk',
      title: 'Kevyt kävely',
      description: '20–30 min ulkoilu raikkaassa ilmassa',
    },
    {
      type: 'breathe',
      title: 'Hengitysharjoitus',
      description: '4-7-8 -tekniikka, 5 minuuttia',
    },
    {
      type: 'stretch',
      title: 'Venyttely',
      description: 'Niskan ja hartioiden lyhyt venytysohjelma',
    },
  ];
}

function renderRecommendations(items) {
  const container = document.getElementById('recommendations-list');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">✅</div>
        <div class="empty-state__text">Ei suosituksia juuri nyt. Kokeile päivittää tiedot!</div>
      </div>`;
    return;
  }

  container.innerHTML = items
    .map((r) => {
      const category = r.category || r.type || 'gym';
      const icon = EXERCISE_ICONS[category] ?? '💪';

      return `
        <div class="exercise-card">
          <div class="exercise-card__icon">${icon}</div>
          <div class="exercise-card__body">
            <div class="exercise-card__name">${r.title ?? r.name ?? 'Harjoitus'}</div>
            <div class="exercise-card__desc">${r.description ?? ''}</div>
          </div>
        </div>`;
    })
    .join('');
}

async function loadRecommendations() {
  try {
    const data = await getRecommendations();
    const exercises = data.exercises;
    renderRecommendations(exercises);
  } catch (e) {
    console.error('Suositusten latausvirhe:', e);
    renderRecommendations(defaultRecommendations());
  }
}

// ── MIELIALA-LIUKUSÄÄDIN ───────────────────────────────────────────────────

const moodSlider = document.getElementById('mood-slider');
const userMessageBox = document.getElementById('daily-log-message');
const moodValueLabel = document.getElementById('mood-value-label');
const MOOD_LABELS = [
  '',
  'Erinomainen 😄',
  'Hyvä 🙂',
  'Normaali 😐',
  'Väsynyt 😔',
  'Erittäin kuormittunut 😟',
];

function updateMoodLabel() {
  if (moodValueLabel && moodSlider) {
    moodValueLabel.textContent = MOOD_LABELS[moodSlider.value] ?? '';
  }
}

moodSlider?.addEventListener('input', updateMoodLabel);
updateMoodLabel();

document
  .getElementById('save-mood-btn')
  ?.addEventListener('click', async () => {
    const val = parseInt(moodSlider.value, 10);
    const userText = userMessageBox.value;
    try {
      await saveMood(val, val, userText);
      showSnackbar('Kuormitustaso tallennettu ✓', 'success');
    } catch {
      showSnackbar('Tallennus epäonnistui', 'error');
    }
  });
