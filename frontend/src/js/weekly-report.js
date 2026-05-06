import {getWeeklyReports} from '../js/api.js';

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

    // Nyt .map() toimii oikealle listalle (7 raporttia)
    container.innerHTML = reports.map(report => {
      const rmssd = report.avg_rmssd ? report.avg_rmssd.toFixed(1) : '--';
      const readiness = report.avg_readiness ? Math.round(report.avg_readiness) : '--';

      return `
        <div class="report-item">
          <div class="report-item__header">
            <span class="report-item__date">Viikko ${report.week_number} / ${report.year}</span>
            <span class="badge">Valmius: ${readiness}%</span>
          </div>
          <div class="report-item__stats-grid">
            <div class="mini-stat">
              <span class="mini-stat__label">RMSSD (KA)</span>
              <span class="mini-stat__value">${rmssd} ms</span>
            </div>
            <div class="mini-stat">
              <span class="mini-stat__label">Stressi (KA)</span>
              <span class="mini-stat__value">${report.avg_stress_score || '--'} / 10</span>
            </div>
          </div>
          ${report.pro_comment ? `
            <div class="report-item__pro-note">
              <strong>Ammattilaisen kommentti:</strong>
              <p>${report.pro_comment}</p>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error('Renderöintivirhe:', err);
    container.innerHTML = '<p class="error-text">Raporttien piirtäminen epäonnistui.</p>';
  }
}
