import {
  getHrvData,
  fetchUserEntries,
  changeUserEntry,
  deleteUserEntry,
  showSnackbar,
} from '../js/api.js';
import {Chart, registerables} from 'chart.js';

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
      datasets: [
        {
          label: 'RMSSD',
          data: [],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Päivämäärä',
          },
        },
        y: {
          title: {
            display: true,
            text: 'RMSSD',
          },
        },
      },
    },
  });

  stressChart = new Chart(stressCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Stressitaso',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Päivämäärä',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Stressitaso',
          },
        },
      },
    },
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

  return data.filter((item) => new Date(item.measured_at) >= startDate);
}

// Päivitä kaaviot
function updateCharts(data) {
  const filteredData = filterDataByTimeRange(data, timeRangeSelect.value);

  // Järjestä data päivämäärän mukaan
  filteredData.sort(
    (a, b) => new Date(a.measured_at) - new Date(b.measured_at),
  );

  const labels = filteredData.map((item) =>
    new Date(item.measured_at).toLocaleDateString('fi-FI'),
  );
  const rmssdData = filteredData.map((item) => parseFloat(item.rmssd));
  const stressData = filteredData.map((item) => parseFloat(item.stress_index));

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

// --- TÄSTÄ ALASPÄIN OLEVAA KOODIA ON AUTTANUT
// GOOGLEN GEMINI 3 PRO TEKOÄLYMALLI KIRJOITTAMAAN ---

async function loadAndRenderEntries() {
  const container = document.getElementById('diary-entries-list');
  if (!container) return;

  try {
    const entries = await fetchUserEntries();

    if (!entries || entries.length === 0) {
      container.innerHTML =
        '<p class="empty-state">Ei merkintöjä tallennettuna.</p>';
      return;
    }

    container.innerHTML = entries
      .map((entry) => {
        const date = new Date(entry.created_at).toLocaleDateString('fi-FI', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        let badgeClass = 'badge--success';
        if (entry.workload >= 4) badgeClass = 'badge--danger';
        else if (entry.workload >= 3) badgeClass = 'badge--warning';

        return `
      <div class="diary-item"
           data-id="${entry.id}"
           data-mood="${entry.mood_score}"
           data-workload="${entry.workload}"
           data-text="${entry.user_text || ''}">

        <div class="diary-item__header">
          <div class="diary-item__header-top">
            <span class="diary-item__date">${date}</span>
            <div class="diary-item__actions">
              <button class="action-btn btn-edit" title="Muokkaa">✏️</button>
              <button class="action-btn btn-delete" title="Poista">🗑️</button>
            </div>
          </div>
          <span class="mood-emoji">${getMoodEmoji(entry.mood_score)}</span>
        </div>

        <p class="diary-item__text">
          ${entry.user_text ? `"${entry.user_text}"` : '<em>Ei muistiinpanoja.</em>'}
        </p>

        <div class="diary-item__footer">
          <span class="badge ${badgeClass}">Kuormitus: ${entry.workload}/5</span>
        </div>
      </div>
    `;
      })
      .join('');

    attachDiaryActionListeners();
  } catch (err) {
    console.error('Virhe merkintöjen latauksessa:', err);
    container.innerHTML =
      '<p class="error">Merkintöjen lataus epäonnistui.</p>';
  }
}

function getMoodEmoji(score) {
  const emojis = ['', '😄', '🙂', '😐', '😔', '😟'];
  return emojis[score] || '😶';
}

let currentEditEntryId = null;

function attachDiaryActionListeners() {
  const modal = document.getElementById('edit-entry-modal');
  const moodInput = document.getElementById('edit-mood');
  const workloadInput = document.getElementById('edit-workload');
  const messageInput = document.getElementById('edit-message');

  // --- DELETE USER ENTRY ---
  document.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const card = e.target.closest('.diary-item');
      const entryId = card.dataset.id;

      if (
        confirm(
          'Haluatko varmasti poistaa tämän merkinnän? Tätä ei voi peruuttaa.',
        )
      ) {
        try {
          await deleteUserEntry(entryId);
          card.remove();
        } catch (err) {
          console.error('Virhe poistossa:', err);
          alert('Poistaminen epäonnistui.');
        }
      }
    });
  });

  // --- OPEN EDIT OVERLAY ---
  document.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.diary-item');
      currentEditEntryId = card.dataset.id;

      moodInput.value = card.dataset.mood;
      workloadInput.value = card.dataset.workload;
      messageInput.value = card.dataset.text;

      modal.classList.remove('hidden');
    });
  });

  // --- OVERLAY CLOSING ---
  document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
    modal.classList.add('hidden');
    currentEditEntryId = null;
  });

  // --- SAVING ---
  document
    .getElementById('save-edit-btn')
    ?.addEventListener('click', async () => {
      if (!currentEditEntryId) return;

      const updatedData = {
        entryId: currentEditEntryId,
        mood: parseInt(moodInput.value, 10),
        workload: parseInt(workloadInput.value, 10),
        message: messageInput.value.trim(),
      };

      try {
        await changeUserEntry(currentEditEntryId, updatedData);

        const card = document.querySelector(
          `.diary-item[data-id="${currentEditEntryId}"]`,
        );
        card.dataset.mood = updatedData.mood;
        card.dataset.workload = updatedData.workload;
        card.dataset.text = updatedData.message;

        card.querySelector('.mood-emoji').textContent = getMoodEmoji(
          updatedData.mood,
        );
        card.querySelector('.diary-item__text').innerHTML = updatedData.message
          ? `"${updatedData.message}"`
          : '<em>Ei muistiinpanoja.</em>';

        // Update color codes
        const badge = card.querySelector('.badge');
        badge.textContent = `Kuormitus: ${updatedData.workload}/5`;
        badge.className = 'badge';
        if (updatedData.workload >= 4) badge.classList.add('badge--danger');
        else if (updatedData.workload >= 3)
          badge.classList.add('badge--warning');
        else badge.classList.add('badge--success');

        modal.classList.add('hidden');
        showSnackbar('Muokkaus onnistui')
      } catch (err) {
        console.error('Muokkaus epäonnistui:', err);
        alert('Tallennus epäonnistui.');
      }
    });
}

// Alusta sivu
function init() {
  initCharts();
  loadHrvData();
  loadAndRenderEntries();

  // Kuuntele aikavälin muutoksia
  timeRangeSelect.addEventListener('change', () => {
    updateCharts(hrvData);
  });
}

// Vie init-funktio
export {init};
