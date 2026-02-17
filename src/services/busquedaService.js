export const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; 
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const buscarLocalesCercanos = async (lat, lng) => {
  const radio = 5000; 
  const query = `
    [out:json];
    (
      node["amenity"~"restaurant|cafe|fast_food"](around:${radio},${lat},${lng});
      way["amenity"~"restaurant|cafe|fast_food"](around:${radio},${lat},${lng});
    );
    out center;
  `;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.elements.map(el => {
      const lLat = el.lat || el.center.lat;
      const lLng = el.lon || el.center.lon;
      return {
        id: el.id,
        nombre: el.tags.name || "Local sin nombre",
        categoria: el.tags.amenity || "Comida",
        lat: lLat,
        lng: lLng,
        distancia: calcularDistancia(lat, lng, lLat, lLng)
      };
    }).sort((a, b) => a.distancia - b.distancia);
  } catch (error) {
    console.error("Error en la API de búsqueda:", error);
    return [];
  }
};