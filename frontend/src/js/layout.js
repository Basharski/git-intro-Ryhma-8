import {
  logout,
  toggleTheme,
  applyTheme,
  getProfile,
  updateProfile,
  getHrvData,
  showSnackbar,
} from './api.js';

// --- LOGIC FOR NAVBAR, SETTINGS AND PROFILE OVERLAYS ---
export function initLayout() {
  // 1. Perusasetukset
  applyTheme();
  highlightActiveNav();
  loadProfile();

  const settingsOverlay = document.getElementById('settings-overlay');
  const profileOverlay = document.getElementById('profile-overlay');

  // --- NAVIGATION ---
  function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar__btn');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (currentPath.endsWith(href) || (currentPath === '/' && href.includes('home')))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- SETTINGS-OVERLAY ---
  document.getElementById('open-settings')?.addEventListener('click', (e) => {
    e.preventDefault();
    settingsOverlay?.classList.add('is-visible');
  });

  document.getElementById('close-settings')?.addEventListener('click', () => {
    settingsOverlay?.classList.remove('is-visible');
  });

  // --- PROFILE-OVERLAY ---
  document.getElementById('open-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    profileOverlay?.classList.add('is-visible');
  });

  document.getElementById('close-profile')?.addEventListener('click', () => {
    profileOverlay?.classList.remove('is-visible');
  });

  [settingsOverlay, profileOverlay].forEach((overlay) => {
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('is-visible');
    });
  });

  // Esc-button close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      settingsOverlay?.classList.remove('is-visible');
      profileOverlay?.classList.remove('is-visible');
    }
  });

  // --- THEME CHANGE ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.addEventListener('change', toggleTheme);
  }

  // --- LOGOUT ---
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  // --- DATA DOWNLOAD (CSV/JSON) ---
  document.getElementById('download-btn')?.addEventListener('click', async () => {
    const format = document.querySelector('input[name="format"]:checked')?.value ?? 'csv';
    try {
      const data = await getHrvData();
      if (!data) throw new Error('Ei dataa');

      const blob = format === 'json'
        ? new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        : new Blob([jsonToCsv(data)], { type: 'text/csv' });

      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `tues-data.${format}`,
      });
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showSnackbar('Lataus epäonnistui', 'error');
    }
  });

  // --- SAVE PROFILE ---
  document.getElementById('save-profile-btn')?.addEventListener('click', async () => {
    const profileData = {
      name: document.getElementById('profile-name').value.trim(),
      height: parseInt(document.getElementById('profile-height').value, 10) || undefined,
      weight: parseInt(document.getElementById('profile-weight').value, 10) || undefined,
      age: parseInt(document.getElementById('profile-age').value, 10) || undefined,
    };

    try {
      await updateProfile(profileData);
      const msgEl = document.getElementById('profile-message');
      if (msgEl) {
        msgEl.textContent = 'Tallennettu ✓';
        msgEl.style.color = 'var(--color-primary)';
      }
      showSnackbar('Profiili päivitetty', 'success');

      // If on front page update greeting text
      const greetingTextEl = document.getElementById('greeting-text');
      if (greetingTextEl && profileData.name) {
        greetingTextEl.textContent = `${getGreeting()}, ${profileData.name}!`;
      }

      setTimeout(() => { if (msgEl) msgEl.textContent = ''; }, 3000);
    } catch (err) {
      const msgEl = document.getElementById('profile-message');
      if (msgEl) {
        msgEl.textContent = 'Tallennus epäonnistui';
        msgEl.style.color = 'var(--color-danger)';
      }
    }
  });

  // --- REMOVE DATA (placeholder) ---
  document.getElementById('delete-all-btn')?.addEventListener('click', () => {
    if (confirm('Haluatko varmasti poistaa kaikki omat tietosi? Tätä ei voi peruuttaa.')) {
      showSnackbar('Tietojen poisto ei ole vielä käytössä', 'error');
    }
  });
}

// ── HELPER FUNCTIONS ──

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 10) return 'Hyvää huomenta';
  if (hour < 18) return 'Hyvää päivää';
  return 'Hyvää iltaa';
}

function randomSubText() {
  const texts = ['Miten voit tänään?', 'Muistathan levätä tarpeeksi.', 'Päivän mittaukset odottavat.'];
  return texts[Math.floor(Math.random() * texts.length)];
}

async function loadProfile() {
  try {
    const profile = await getProfile();
    if (!profile) return;

    const greetingTextEl = document.getElementById('greeting-text');
    const greetingSubEl = document.getElementById('greeting-sub');
    if (greetingTextEl) greetingTextEl.textContent = `${getGreeting()}${profile.name ? ', ' + profile.name : ''}!`;
    if (greetingSubEl) greetingSubEl.textContent = randomSubText();

    const fields = {
      'profile-name': profile.name,
      'profile-height': profile.height,
      'profile-weight': profile.weight,
      'profile-age': profile.age,
      'profile-email-display': profile.email
    };

    for (const [id, value] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el && value !== undefined) el.value = value;
    }
  } catch (err) {
    console.error('Profiilin lataus epäonnistui');
  }
}

function jsonToCsv(arr) {
  if (!Array.isArray(arr) || !arr.length) return '';
  const keys = Object.keys(arr[0]);
  return [
    keys.join(','),
    ...arr.map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(',')),
  ].join('\n');
}
