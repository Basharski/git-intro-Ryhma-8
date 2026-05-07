import { login, register, redirectIfLoggedIn, showSnackbar, applyTheme } from '../js/api.js';

applyTheme();
redirectIfLoggedIn();

// ── Tab-vaihto ─────────────────────────────────────────────────────────────

const tabLogin    = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin   = document.getElementById('form-login');
const formRegister= document.getElementById('form-register');

function switchTab(active, inactive, showForm, hideForm) {
  active.classList.add('active');
  active.setAttribute('aria-selected', 'true');
  inactive.classList.remove('active');
  inactive.setAttribute('aria-selected', 'false');
  showForm.classList.add('active');
  hideForm.classList.remove('active');
}

tabLogin.addEventListener('click', () => switchTab(tabLogin, tabRegister, formLogin, formRegister));
tabRegister.addEventListener('click', () => switchTab(tabRegister, tabLogin, formRegister, formLogin));

// ── Viestit (RF-testit edellyttävät näitä tekstejä) ───────────────────────

const msgEl = document.getElementById('login-message');

function setMessage(el, text, isError = false) {
  el.textContent = text;
  el.style.color = isError ? 'var(--color-danger)' : 'var(--color-primary)';
  el.style.marginBottom = '0.75rem';
}

// ── Kirjautuminen ──────────────────────────────────────────────────────────

const loginBtn = document.getElementById('login-btn');
const emailInput    = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginBtn.addEventListener('click', async () => {
  const email    = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    setMessage(msgEl, 'Täytä kaikki kentät', true);
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Kirjaudutaan…';
  msgEl.textContent = '';

  try {
    const responseData = await login(email, password);
    setMessage(msgEl, 'Tervetuloa');

    setTimeout(() => {
      if (responseData && responseData.user && responseData.user.role === 'pro') {
        window.location.href = '/src/professional/professional.html';
      } else {
        window.location.href = '/src/home/index.html';
      }
    }, 600);
  } catch (err) {
    setMessage(msgEl, 'Kirjautuminen epäonnistui', true);
    console.error('Login error:', err);
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Kirjaudu sisään';
  }
});

// Enter-näppäin kirjautumislomakkeessa
[emailInput, passwordInput].forEach((el) =>
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') loginBtn.click();
  })
);

// ── Rekisteröityminen ──────────────────────────────────────────────────────

const registerBtn = document.getElementById('register-btn');
const regMsgEl    = document.getElementById('register-message');

registerBtn.addEventListener('click', async () => {
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const password2= document.getElementById('reg-password2').value;

  if (!email || !password || !password2) {
    setMessage(regMsgEl, 'Täytä kaikki kentät', true);
    return;
  }

  if (password !== password2) {
    setMessage(regMsgEl, 'Salasanat eivät täsmää', true);
    return;
  }

  if (password.length < 8) {
    setMessage(regMsgEl, 'Salasanassa tulee olla vähintään 8 merkkiä', true);
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = 'Luodaan tiliä…';
  regMsgEl.textContent = '';

  try {
    await register(email, password);
    setMessage(regMsgEl, 'Tili luotu! Kirjaudu sisään.');
    setTimeout(() => switchTab(tabLogin, tabRegister, formLogin, formRegister), 1500);
  } catch (err) {
    setMessage(regMsgEl, err.message ?? 'Rekisteröityminen epäonnistui', true);
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = 'Luo tili';
  }
});
