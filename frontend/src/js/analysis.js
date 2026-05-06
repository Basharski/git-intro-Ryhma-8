import { getHrvData } from '../js/api.js';
import { Chart, registerables } from 'chart.js';

// Rekisteröi Chart.js komponentit
Chart.register(...registerables);

let rmssdChart;
let stressChart;
let hrvData = [];

// Aikavälin valinta
const timeRangeSelect = document.getElementById('time-range');

// Alusta kaaviot
function initCharts() {
  const rmssdCtx = document.getElementById('rmssd-chart').getContext('2d');
  const stressCtx = document.getElementById('stress-chart').getContext('2d');

  rmssdChart = new Chart(rmssdCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'RMSSD',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Päivämäärä'
          }
        },
        y: {
          title: {
            display: true,
            text: 'RMSSD'
          }
        }
      }
    }
  });

  stressChart = new Chart(stressCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'Stressitaso',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Päivämäärä'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Stressitaso'
          }
        }
      }
    }
  });
}

// Suodata data aikavälin mukaan
function filterDataByTimeRange(data, range) {
  const now = new Date();
  let startDate;

  switch (range) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      return data;
  }

  return data.filter(item => new Date(item.measured_at) >= startDate);
}

// Päivitä kaaviot
function updateCharts(data) {
  const filteredData = filterDataByTimeRange(data, timeRangeSelect.value);

  // Järjestä data päivämäärän mukaan
  filteredData.sort((a, b) => new Date(a.measured_at) - new Date(b.measured_at));

  const labels = filteredData.map(item =>
    new Date(item.measured_at).toLocaleDateString('fi-FI')
  );
  const rmssdData = filteredData.map(item => parseFloat(item.rmssd));
  const stressData = filteredData.map(item => parseFloat(item.stress_index));

  rmssdChart.data.labels = labels;
  rmssdChart.data.datasets[0].data = rmssdData;
  rmssdChart.update();

  stressChart.data.labels = labels;
  stressChart.data.datasets[0].data = stressData;
  stressChart.update();

  // Näytä viesti jos ei dataa
  const noDataMessage = document.getElementById('no-data-message');
  if (filteredData.length === 0) {
    if (!noDataMessage) {
      const message = document.createElement('p');
      message.id = 'no-data-message';
      message.textContent = 'Ei dataa valitulla aikavälillä.';
      message.style.textAlign = 'center';
      message.style.color = 'var(--color-text-secondary)';
      message.style.marginTop = '1rem';
      document.querySelector('.charts-container').appendChild(message);
    }
  } else {
    if (noDataMessage) {
      noDataMessage.remove();
    }
  }
}

// Lataa HRV-data
async function loadHrvData() {
  try {
    const data = await getHrvData();
    if (data && Array.isArray(data)) {
      hrvData = data;
      updateCharts(hrvData);
    } else {
      console.warn('Ei HRV-dataa saatavilla');
      hrvData = [];
      updateCharts(hrvData);
    }
  } catch (error) {
    console.error('Virhe HRV-datan latauksessa:', error);
    hrvData = [];
    updateCharts(hrvData);
    // Näytä virhe käyttäjälle tarvittaessa
    // showSnackbar('Virhe datan latauksessa', 'error');
  }
}

// Alusta sivu
function init() {
  initCharts();
  loadHrvData();

  // Kuuntele aikavälin muutoksia
  timeRangeSelect.addEventListener('change', () => {
    updateCharts(hrvData);
  });
}

// Vie init-funktio
export { init };
