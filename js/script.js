const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -0.5,
  maxZoom: 4
});

// Załaduj obraz jako tło mapy
const imageUrl = 'img/mapa.jpg'; // zmień ścieżkę jeśli trzeba
const imageBounds = [[0,0], [1000,1000]]; // dostosuj do rozmiaru obrazu
L.imageOverlay(imageUrl, imageBounds).addTo(map);

map.fitBounds(imageBounds);

// Dodawanie markerów
markers.forEach(m => {
  const color = m.category === "znajdzka" ? "red" :
                m.category === "skrot" ? "green" :
                m.category === "npc" ? "blue" : "gray";

  const marker = L.circleMarker([m.lat, m.lng], {
    radius: 8,
    color: color,
    fillOpacity: 0.8
  }).addTo(map);

  let popupHtml = `<b>${m.name}</b>`;
  if (m.img) {
    popupHtml += `<br><img src="${m.img}" alt="zdjęcie" style="max-width: 250px; height: auto; margin-top: 5px; border-radius: 4px; cursor: pointer;">`;
  }

  marker.bindPopup(popupHtml);
});

// Funkcja pokazująca modal z powiększonym obrazem
function showImageModal(src) {
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImg');
  modal.style.display = 'flex';
  modalImg.src = src;
}

// Obsługa kliknięcia w zdjęcie w popupie
map.on('popupopen', function(e) {
  const popupNode = e.popup.getElement();
  const img = popupNode.querySelector('img');
  if (img) {
    img.style.cursor = 'pointer';
    img.onclick = () => showImageModal(img.src);
  }
});

function startLoopingTimer(startHourUTCplus1, startMinuteUTCplus1, cycleMinutes) {
  const timerElement = document.getElementById('timer');

  function update() {
    const now = new Date();
    
    // Obliczamy czas UTC
    const nowUTC = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    
    // Tworzymy datę startową cyklu (w UTC)
    const startUTC = new Date(nowUTC);
    startUTC.setUTCHours(startHourUTCplus1 - 3, startMinuteUTCplus1, 0, 0);

    // Oblicz ile czasu minęło od pierwszego startu
    let elapsed = (nowUTC - startUTC) / 1000; // w sekundach

    // Jeśli jesteśmy przed pierwszym startem (czyli ujemny czas) – poczekaj do startu
    if (elapsed < 0) {
      const minutes = Math.floor(Math.abs(elapsed) / 60).toString().padStart(2, '0');
      const seconds = (Math.abs(elapsed) % 60).toFixed(0).toString().padStart(2, '0');
      timerElement.textContent = `Ukryty diler by dzwq za: ${minutes}:${seconds}`;
      return;
    }

    // Cykl trwa cycleMinutes — liczymy ile sekund minęło od ostatniego pełnego startu
    const secondsInCycle = cycleMinutes * 60;
    const secondsSinceLastStart = elapsed % secondsInCycle;
    const remaining = secondsInCycle - secondsSinceLastStart;

    const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
    const seconds = Math.floor(remaining % 60).toString().padStart(2, '0');

    timerElement.textContent = `Ukryty diler by dzwq — Reset dilera powinien być za: ${minutes}:${seconds}`;
  }

  update();
  setInterval(update, 1000);
}

// 🔁 Timer odlicza cyklicznie co 60 minut, od 15:25 UTC+1
startLoopingTimer(15, 25, 60);

// Dodanie obsługi zamykania modala po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('imgModal').style.display = 'none';
  });

  document.getElementById('imgModal').addEventListener('click', (e) => {
    if (e.target.id === 'imgModal') {
      e.target.style.display = 'none';
    }
  });
});
