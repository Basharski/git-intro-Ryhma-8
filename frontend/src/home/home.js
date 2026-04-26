import {
  requireAuth,
  getProfile,
  updateProfile,
  getHrvData,
  fetchHrvFromKubios,
  getRecommendations,
  saveMood,
  logout,
  showSnackbar,
  applyTheme,
  toggleTheme,
} from '../js/api.js';

// Varmistetaan kirjautuminen
requireAuth();

// Teema
const savedTheme = applyTheme();
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) themeToggle.checked = savedTheme === 'dark';

themeToggle?.addEventListener('change', () => {
  const next = toggleTheme();
  themeToggle.checked = next === 'dark';
});

// ── Tervehdys ──────────────────────────────────────────────────────────────

const GREETINGS = [
  'Mukavaa nähdä sinut taas',
  'Hienoa, että olet paikalla',
  'Tänään on hyvä päivä huolehtia itsestäsi',
  'Tervetuloa takaisin',
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return 'Huomenta';
  if (hour < 17) return 'Hei';
  return 'Hyvää iltaa';
}

function randomSubText() {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)] + '! 🌿';
}

// ── Profiili & tervehdys ───────────────────────────────────────────────────

async function loadProfile() {
  try {
    const profile = await getProfile();
    const name = profile.name ?? profile.first_name ?? '';
    document.getElementById('greeting-text').textContent =
      `${getGreeting()}${name ? ', ' + name : ''}!`;
    document.getElementById('greeting-sub').textContent = randomSubText();

    // Täytä profiili-overlay
    if (profile.name) document.getElementById('profile-name').value = profile.name;
    if (profile.height) document.getElementById('profile-height').value = profile.height;
    if (profile.weight) document.getElementById('profile-weight').value = profile.weight;
    if (profile.age) document.getElementById('profile-age').value = profile.age;
    if (profile.email) document.getElementById('profile-email-display').value = profile.email;
  } catch {
    document.getElementById('greeting-text').textContent = `${getGreeting()}!`;
    document.getElementById('greeting-sub').textContent = randomSubText();
  }
}

// ── HRV-data ───────────────────────────────────────────────────────────────

async function loadHrvData() {
  try {
    const data = await getHrvData();
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
    // Jätetään '–' placeholderit näkyviin
    console.log(e)
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
const moodValueLabel = document.getElementById('mood-value-label');
const MOOD_LABELS = ['', 'Erinomainen 😄', 'Hyvä 🙂', 'Normaali 😐', 'Väsynyt 😔', 'Erittäin kuormittunut 😟'];

function updateMoodLabel() {
  moodValueLabel.textContent = MOOD_LABELS[moodSlider.value] ?? '';
}

moodSlider?.addEventListener('input', updateMoodLabel);
updateMoodLabel();

document.getElementById('save-mood-btn')?.addEventListener('click', async () => {
  const val = parseInt(moodSlider.value, 10);
  try {
    await saveMood(val, val);
    showSnackbar('Kuormitustaso tallennettu ✓', 'success');
  } catch {
    showSnackbar('Tallennus epäonnistui', 'error');
  }
});

// ── Asetukset-overlay ──────────────────────────────────────────────────────

const settingsOverlay = document.getElementById('settings-overlay');

document.getElementById('open-settings')?.addEventListener('click', () => {
  settingsOverlay.classList.add('open');
});
document.getElementById('close-settings')?.addEventListener('click', () => {
  settingsOverlay.classList.remove('open');
});
settingsOverlay?.addEventListener('click', (e) => {
  if (e.target === settingsOverlay) settingsOverlay.classList.remove('open');
});

document.getElementById('logout-btn')?.addEventListener('click', () => logout());

document.getElementById('download-btn')?.addEventListener('click', async () => {
  const format = document.querySelector('input[name="format"]:checked')?.value ?? 'csv';
  try {
    const data = await getHrvData();
    const blob = format === 'json'
      ? new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      : new Blob([jsonToCsv(data)], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a   = Object.assign(document.createElement('a'), { href: url, download: `tues-data.${format}` });
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    showSnackbar('Lataus epäonnistui', 'error');
  }
});

function jsonToCsv(arr) {
  if (!Array.isArray(arr) || !arr.length) return '';
  const keys = Object.keys(arr[0]);
  return [keys.join(','), ...arr.map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
}

document.getElementById('delete-all-btn')?.addEventListener('click', () => {
  if (confirm('Haluatko varmasti poistaa kaikki omat tietosi? Tätä ei voi peruuttaa.')) {
    showSnackbar('Tietojen poisto ei ole vielä käytössä', 'error');
  }
});

// ── Profiili-overlay ───────────────────────────────────────────────────────

const profileOverlay = document.getElementById('profile-overlay');

document.getElementById('open-profile')?.addEventListener('click', () => {
  profileOverlay.classList.add('open');
});
document.getElementById('close-profile')?.addEventListener('click', () => {
  profileOverlay.classList.remove('open');
});
profileOverlay?.addEventListener('click', (e) => {
  if (e.target === profileOverlay) profileOverlay.classList.remove('open');
});

document.getElementById('save-profile-btn')?.addEventListener('click', async () => {
  const profileData = {
    name:   document.getElementById('profile-name').value.trim(),
    height: parseInt(document.getElementById('profile-height').value, 10) || undefined,
    weight: parseInt(document.getElementById('profile-weight').value, 10) || undefined,
    age:    parseInt(document.getElementById('profile-age').value, 10) || undefined,
  };
  try {
    await updateProfile(profileData);
    document.getElementById('profile-message').textContent = 'Tallennettu ✓';
    showSnackbar('Profiili päivitetty', 'success');
    // Päivitä tervehdys uudella nimellä
    if (profileData.name) {
      document.getElementById('greeting-text').textContent =
        `${getGreeting()}, ${profileData.name}!`;
    }
    setTimeout(() => {
      document.getElementById('profile-message').textContent = '';
    }, 3000);
  } catch {
    document.getElementById('profile-message').textContent = 'Tallennus epäonnistui';
    document.getElementById('profile-message').style.color = 'var(--color-danger)';
  }
});

// ── Fokusointi Esc-näppäimellä ─────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    settingsOverlay.classList.remove('open');
    profileOverlay.classList.remove('open');
  }
});

// ── Alustus ────────────────────────────────────────────────────────────────

(async () => {
  await loadProfile();
  await Promise.all([loadHrvData(), loadRecommendations()]);
})();
