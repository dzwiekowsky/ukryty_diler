const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -0.5,
  maxZoom: 4
});

const imageUrl = 'img/mapa.jpg'; 
const imageBounds = [[0,0], [1000,1000]]; 
L.imageOverlay(imageUrl, imageBounds).addTo(map);

map.fitBounds(imageBounds);

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


  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImg');
  modal.style.display = 'flex';
  modalImg.src = src;
}


map.on('popupopen', function(e) {
  const popupNode = e.popup.getElement();
  const img = popupNode.querySelector('img');
  if (img) {
    img.style.cursor = 'pointer';
    img.onclick = () => showImageModal(img.src);
  }
});


document.getElementById('closeModal').onclick = function() {
  document.getElementById('imgModal').style.display = 'none';
};
document.getElementById('imgModal').onclick = function(e) {
  if (e.target === this) {
    this.style.display = 'none';
  }
};


map.on('click', function(e) {
  const lat = e.latlng.lat.toFixed(5);
  const lng = e.latlng.lng.toFixed(5);
  console.log(`lat: ${lat},`);
  console.log(`lng: ${lng},`);
});
