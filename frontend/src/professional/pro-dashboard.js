import {
  getPatients,
  getPatientReports,
  getPatientDailyLogs,
  updateReportFeedback,
  generateCode,
  logout,
} from '../js/api.js';

const activeCharts = {};

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initProfileOverlay();
  await initProDashboard();
});

// --- THEME ---
function initTheme() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('pro-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pro-theme', newTheme);
  });
}

// --- PROFILE OVERLAY & CODE GENERATION ---
function initProfileOverlay() {
  const trigger = document.getElementById('profile-trigger');
  const overlay = document.getElementById('profile-overlay');
  const genBtn = document.getElementById('btn-generate-code');
  const logoutBtn = document.getElementById('btn-logout');

  if (!trigger || !overlay) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    overlay.classList.toggle('show');
  });

  document.addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', (e) => e.stopPropagation());

  genBtn.addEventListener('click', async () => {
    try {
      genBtn.disabled = true;
      genBtn.textContent = '...';
      const data = await generateCode();

      const code = data.inviteCode;

      const codeDisplay = document.getElementById('generated-code');
      if (code && codeDisplay) {
        codeDisplay.textContent = code;
        codeDisplay.classList.remove('code-placeholder');
      }

      genBtn.textContent = 'Luo uusi';
      genBtn.disabled = false;
    } catch (err) {
      console.error('Koodin luonti epäonnistui:', err);
      genBtn.textContent = 'Luo uusi';
      genBtn.disabled = false;
    }
  });

  logoutBtn.addEventListener('click', () => logout());
}

// --- DASHBOARD MAIN LOGIC ---
async function initProDashboard() {
  const container = document.getElementById('patient-list-container');
  try {
    const patients = await getPatients();
    if (container) container.innerHTML = '';

    renderPatientList(patients);

    if (patients.length > 0) {
      selectPatient(patients[0]);
    }
  } catch (err) {
    console.error('Dashboardin alustus epäonnistui:', err);
    if (container) container.innerHTML = '<p>Virhe potilaiden latauksessa.</p>';
  }
}

// --- PATIENT LIST ---
function renderPatientList(patients) {
  const container = document.getElementById('patient-list-container');
  if (!container) return;

  container.innerHTML = patients
    .map((p) => {
      const displayName = p.name || p.first_name || 'Potilas';
      return `
            <div class="exercise-card patient-item" data-id="${p.id}" style="cursor: pointer;">
                <div class="exercise-card__icon">👤</div>
                <div class="exercise-card__body">
                    <div class="exercise-card__name">${displayName}</div>
                    <div class="exercise-card__desc">ID: #${p.id}</div>
                </div>
            </div>
        `;
    })
    .join('');

  container.querySelectorAll('.patient-item').forEach((item) => {
    item.addEventListener('click', () => {
      const pId = item.dataset.id;
      const patient = patients.find((p) => p.id == pId);
      if (patient) selectPatient(patient);
    });
  });
}

// --- PATIENT SELECTION ---
async function selectPatient(patient) {
  const id = patient.id;
  const name = patient.name || patient.first_name || 'Potilas';

  document.getElementById('active-patient-name').textContent = name;

  const metaEl = document.getElementById('active-patient-meta');
  if (metaEl) {
    metaEl.textContent = `Potilas-ID: #${id} | Viimeisin synkronointi: Tänään`;
  }

  const reportsContainer = document.getElementById('pro-reports-list');
  reportsContainer.innerHTML = '<p class="loading">Ladataan raportteja...</p>';

  try {
    const reports = await getPatientReports(id);
    renderReports(reports, id);

    if (reports && reports.length > 0) {
      updateSummaryBoxes(reports[0]);
    } else {
      resetSummaryBoxes();
    }
  } catch (err) {
    console.error('selectPatient virhe:', err);
    reportsContainer.innerHTML = '<p class="error">Virhe haettaessa raportteja.</p>';
  }
}

// --- WEEKLY REPORT RENDERING ---
function renderReports(reports, patientId) {
  const container = document.getElementById('pro-reports-list');
  if (!container) return;

  if (reports.length === 0) {
    container.innerHTML = '<p>Ei viikkoraportteja.</p>';
    return;
  }

  container.innerHTML = reports
    .map(
      (report) => `
        <details class="pro-report-accordion" data-report-id="${report.id}" data-week="${report.week_number}" data-year="${report.year}">
            <summary class="pro-report-summary">
                <div class="pro-report-summary__left">
                    <span class="week-tag">Viikko ${report.week_number}</span>
                    <span class="date-range">${report.year}</span>
                </div>
                <div class="pro-report-summary__right">
                    <span class="badge ${report.avg_readiness > 70 ? 'badge--success' : 'badge--warning'}">
                        Valmius: ${Math.round(report.avg_readiness)}%
                    </span>
                    <span class="icon-chevron">▼</span>
                </div>
            </summary>
            <div class="pro-report-content">
                <div class="pro-report-grid">
                    <div class="pro-report-chart-container">
                        <h4>Sykevälivaihtelu (RMSSD)</h4>
                        <canvas id="chart-${report.id}"></canvas>
                    </div>
                    <div class="pro-report-info">
                        <h4>Asiantuntijan palaute</h4>
                        <textarea class="form-input feedback-text" placeholder="Kirjoita ohjeet potilaalle...">${report.pro_comment || ''}</textarea>
                        <button class="btn btn--primary btn--sm save-feedback-btn" data-report-id="${report.id}">Tallenna palaute</button>
                    </div>
                </div>
            </div>
        </details>
    `,
    )
    .join('');

  // Saving the comment
  container.querySelectorAll('.save-feedback-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const clickedBtn = e.currentTarget;
      const reportId = clickedBtn.dataset.reportId;
      const infoBox = clickedBtn.closest('.pro-report-info');
      const textArea = infoBox.querySelector('.feedback-text');

      if (textArea) {
        await saveFeedback(reportId, textArea.value, clickedBtn);
      }
    });
  });

  // Draw graphs
  container.querySelectorAll('.pro-report-accordion').forEach((accordion) => {
    accordion.addEventListener('toggle', async () => {
      if (accordion.open) {
        const reportId = accordion.dataset.reportId;
        const week = accordion.dataset.week;
        const year = accordion.dataset.year;
        await loadDailyDataAndRenderChart(patientId, reportId, week, year);
      }
    });
  });
}

// --- GRAPHS ---
async function loadDailyDataAndRenderChart(patientId, reportId, week, year) {
  const {start, end} = getWeekRange(week, year);

  try {
    const dailyLogs = await getPatientDailyLogs(patientId, start, end);
    const canvas = document.getElementById(`chart-${reportId}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (activeCharts[reportId]) activeCharts[reportId].destroy();

    activeCharts[reportId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dailyLogs.map((log) =>
          new Date(log.measured_at).toLocaleDateString('fi-FI', { weekday: 'short' }),
        ),
        datasets: [
          {
            label: 'RMSSD (ms)',
            data: dailyLogs.map((log) => log.rmssd),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            yAxisID: 'y',
            tension: 0.3,
            fill: true,
          },
          {
            label: 'Stressi-indeksi',
            data: dailyLogs.map((log) => log.stress_index),
            borderColor: '#ef4444',
            backgroundColor: 'transparent',
            yAxisID: 'y1',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { type: 'linear', position: 'left', title: {display: true, text: 'RMSSD'} },
          y1: { type: 'linear', position: 'right', grid: {drawOnChartArea: false}, title: {display: true, text: 'Stressi'} },
        },
      },
    });
  } catch (err) {
    console.error('Virhe graafin latauksessa:', err);
  }
}

// --- FEEDBACK LOGIC ---
async function saveFeedback(reportId, comment, buttonElement) {
  if (!buttonElement) return;

  try {
    buttonElement.disabled = true;
    const originalText = buttonElement.textContent;
    buttonElement.textContent = 'Tallennetaan...';

    await updateReportFeedback(reportId, comment);

    showSnackbar('Palaute tallennettu!');
    buttonElement.textContent = originalText;
    buttonElement.disabled = false;
  } catch (err) {
    console.error('Tallennus epäonnistui:', err);
    showSnackbar('Virhe tallennuksessa.');
    buttonElement.disabled = false;
    buttonElement.textContent = 'Yritä uudelleen';
  }
}

// --- HELPERS ---
function getWeekRange(weekNo, year) {
  const d = new Date(year, 0, 1 + (weekNo - 1) * 7);
  const day = d.getDay();
  const ISOweekStart = d;
  if (day <= 4) ISOweekStart.setDate(d.getDate() - d.getDay() + 1);
  else ISOweekStart.setDate(d.getDate() + 8 - d.getDay());

  const start = ISOweekStart.toISOString().split('T')[0];
  const endDate = new Date(ISOweekStart);
  endDate.setDate(ISOweekStart.getDate() + 6);
  const end = endDate.toISOString().split('T')[0];

  return {start, end};
}

function updateSummaryBoxes(latest) {
  const readiness = Math.round(latest.avg_readiness);
  const rmssd = Math.round(latest.avg_rmssd);

  document.getElementById('stat-readiness').textContent = `${readiness}%`;
  document.getElementById('stat-rmssd').textContent = `${rmssd} ms`;

  const statusText = document.getElementById('stat-status');
  if (statusText) {
    const isGood = readiness > 70;
    statusText.textContent = isGood ? 'Hyvä' : 'Heikko';
    statusText.classList.remove('text-success', 'text-danger');
    statusText.classList.add(isGood ? 'text-success' : 'text-danger');
  }
}

function resetSummaryBoxes() {
    document.getElementById('stat-readiness').textContent = '-';
    document.getElementById('stat-rmssd').textContent = '-';
    document.getElementById('stat-status').textContent = '-';
}

function showSnackbar(message) {
  const snackbar = document.getElementById('snackbar');
  if (snackbar) {
    snackbar.textContent = message;
    snackbar.classList.add('show');
    setTimeout(() => snackbar.classList.remove('show'), 3000);
  } else {
    alert(message);
  }
}
