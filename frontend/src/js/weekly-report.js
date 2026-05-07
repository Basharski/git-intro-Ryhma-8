/** Tämän sivun HTML koodin on kirjoittanut Googlen Gemini 3 tekoälymalli */

import {getWeeklyReports} from '../js/api.js';

// Loads the weekly reports and renders them
export async function loadWeeklyReports() {
  const container = document.getElementById('weekly-reports-list');
  if (!container) return;

  try {
    const responseData = await getWeeklyReports();
    const reports = Array.isArray(responseData) ? responseData : (responseData?.reports || []);

    if (reports.length === 0) {
      container.innerHTML = '<p class="empty-state__text">Ei viikkoraportteja saatavilla.</p>';
      return;
    }

    container.innerHTML = reports.map(report => {
      const rmssdVal = report.avg_rmssd || 0;
      const readinessVal = report.avg_readiness || 0;
      const stressVal = report.avg_stress_score || 0;

      return `
        <div class="report-item">
          <div class="report-item__header">
            <span class="report-item__date">Viikko ${report.week_number} / ${report.year}</span>
            <span class="badge ${getReadinessColor(readinessVal)}">
              Valmius: ${Math.round(readinessVal)}%
            </span>
          </div>
          <div class="report-item__stats-grid">
            <div class="mini-stat">
              <span class="mini-stat__label">RMSSD</span>
              <span class="mini-stat__value ${getRMSSDColor(rmssdVal)}">
                ${rmssdVal.toFixed(1)} ms
              </span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat__label">Stressi</span>
              <span class="mini-stat__value ${getStressColor(stressVal)}">
                ${stressVal.toFixed(1)}
              </span>
            </div>
          </div>
          ${report.pro_comment ? `
            <div class="report-item__pro-note">
              <strong>Ammattilaisen palaute:</strong>
              <p>${report.pro_comment}</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Renderöintivirhe:', err);
  }
}

// --- HELPER FUNCTIONS ----
function getRMSSDColor(value) {
  if (value >= 50) return 'text-success';
  if (value >= 30) return 'text-warning';
  return 'text-danger';
}

function getReadinessColor(value) {
  if (value >= 80) return 'text-success';
  if (value >= 60) return 'text-warning';
  return 'text-danger';
}

function getStressColor(value) {
  if (value <= 3) return 'text-success';
  if (value <= 6) return 'text-warning';
  return 'text-danger';
}
