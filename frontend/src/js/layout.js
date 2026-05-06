import {
  logout,
  toggleTheme,
  applyTheme,
  getProfile,
  updateProfile,
  getHrvData,
  showSnackbar,
  shareWithProfessional,
  revokeProfessionalAccess,
} from './api.js';

// --- LOGIC FOR NAVBAR, SETTINGS AND PROFILE OVERLAYS ---
export function initLayout() {
  // Perusasetukset
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
      if (
        href &&
        (currentPath.endsWith(href) ||
          (currentPath === '/' && href.includes('home')))
      ) {
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
    themeToggle.checked =
      document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.addEventListener('change', toggleTheme);
  }

  // --- LOGOUT ---
  document.getElementById('logout-btn')?.addEventListener('click', logout);

  // --- DATA DOWNLOAD (CSV/JSON) ---
  document
    .getElementById('download-btn')
    ?.addEventListener('click', async () => {
      const format =
        document.querySelector('input[name="format"]:checked')?.value ?? 'csv';
      try {
        const data = await getHrvData();
        if (!data) throw new Error('Ei dataa');

        const blob =
          format === 'json'
            ? new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
              })
            : new Blob([jsonToCsv(data)], {type: 'text/csv'});

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

  // --- DATA SHARING TO A PROFESSIONAL ---
  document.addEventListener('click', async (e) => {
    if (e.target.closest('#send-code-btn')) {
      const input = document.getElementById('invite-code-input');
      const code = input?.value.trim();
      if (!code) return;

      // Share data with a professional
      try {
        await shareWithProfessional(code);
        toggleProLinkUI(true, code);
        showSnackbar('Tietojen jako aktivoitu!', 'success');
        input.value = '';
      } catch (err) {
        showSnackbar('Virheellinen koodi', 'error');
      }
    }

    // Revoke the professionals access
    if (e.target.closest('#revoke-code-btn')) {
      if (
        confirm('Haluatko varmasti lopettaa tietojen jaon asiantuntijalle?')
      ) {
        try {
          await revokeProfessionalAccess();
          toggleProLinkUI(false);
          showSnackbar('Tietojen jako lopetettu', 'success');
        } catch (err) {
          console.log(err);
          showSnackbar('Yhteyden katkaisu epäonnistui', 'error');
        }
      }
    }
  });

  // --- SAVE PROFILE ---
  document
    .getElementById('save-profile-btn')
    ?.addEventListener('click', async () => {
      const profileData = {
        name: document.getElementById('profile-name').value.trim(),
        height:
          parseInt(document.getElementById('profile-height').value, 10) ||
          undefined,
        weight:
          parseInt(document.getElementById('profile-weight').value, 10) ||
          undefined,
        age:
          parseInt(document.getElementById('profile-age').value, 10) ||
          undefined,
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

        setTimeout(() => {
          if (msgEl) msgEl.textContent = '';
        }, 3000);
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
    if (
      confirm(
        'Haluatko varmasti poistaa kaikki omat tietosi? Tätä ei voi peruuttaa.',
      )
    ) {
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
  const texts = [
    'Miten voit tänään?',
    'Muistathan levätä tarpeeksi.',
    'Päivän mittaukset odottavat.',
  ];
  return texts[Math.floor(Math.random() * texts.length)];
}

async function loadProfile() {
  try {
    const profile = await getProfile();
    if (!profile) return;

    // Checks if there is already a connection between the user and professional
    if (profile && profile.pro_code) {
      toggleProLinkUI(true, profile.pro_code);
    } else {
      toggleProLinkUI(false);
    }

    const greetingTextEl = document.getElementById('greeting-text');
    const greetingSubEl = document.getElementById('greeting-sub');
    if (greetingTextEl)
      greetingTextEl.textContent = `${getGreeting()}${profile.name ? ', ' + profile.name : ''}!`;
    if (greetingSubEl) greetingSubEl.textContent = randomSubText();

    const fields = {
      'profile-name': profile.name,
      'profile-height': profile.height,
      'profile-weight': profile.weight,
      'profile-age': profile.age,
      'profile-email-display': profile.email,
    };

    for (const [id, value] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el && value !== undefined) el.value = value;
    }

    setTimeout(() => {
      const status = document.getElementById('share-status');

      if (status && profile.pro_code) {
        status.textContent = `Yhteys aktiivinen koodilla: ${profile.pro_code}`;
        status.style.color = 'var(--color-primary)';

        const input = document.getElementById('invite-code-input');
        const btn = document.getElementById('send-code-btn');
        if (input) input.style.display = 'none';
        if (btn) btn.style.display = 'none';
      }
    }, 100);
  } catch (err) {
    console.error('Profiilin lataus epäonnistui');
  }
}

function toggleProLinkUI(isActive, code = '') {
  const inputContainer = document.getElementById('pro-link-input-container');
  const statusContainer = document.getElementById('pro-link-status-container');
  const statusText = document.getElementById('share-status');

  if (isActive) {
    inputContainer.style.display = 'none';
    statusContainer.style.display = 'block';
    statusText.textContent = `Yhteys aktiivinen koodilla: ${code}`;
  } else {
    inputContainer.style.display = 'block';
    statusContainer.style.display = 'none';
    statusText.textContent = '';
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
