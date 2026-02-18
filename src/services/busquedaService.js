// Fotos para el look Cyberpunk/Pro
const FOTOS_COMIDA = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", // Burger
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", // Pizza
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", // Sushi
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", // Café
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", // Burger 2
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", // Pizza 2
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500"  // General
];

const getDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(2);
};

export const buscarLocalesPro = async (lat, lng, categoriaId = '13000', soloAbiertos = false) => {
  // 1. SISTEMA DE CACHÉ: Revisamos si ya buscamos esto antes
  const cacheKey = `epik_cache_${lat.toFixed(3)}_${lng.toFixed(3)}_${categoriaId}`;
  const datosGuardados = sessionStorage.getItem(cacheKey);

  if (datosGuardados) {
    console.log("⚡ Usando datos de caché (Velocidad Luz)");
    return JSON.parse(datosGuardados);
  }

  // 2. BUSQUEDA AMPLIADA: Incluimos fast_food, ice_cream y radio de 10km
  let tagBusqueda = 'amenity~"restaurant|cafe|fast_food|bar|pub|ice_cream|biergarten"';
  
  if (categoriaId === '13031') tagBusqueda = 'cuisine~"burger|sandwich|hot_dog"';
  if (categoriaId === '13064') tagBusqueda = 'cuisine~"pizza|italian|pasta"';
  if (categoriaId === '13276') tagBusqueda = 'cuisine~"sushi|japanese|asian"';
  if (categoriaId === '13035') tagBusqueda = 'amenity~"cafe|ice_cream"'; // Café y helados
  if (categoriaId === '13003') tagBusqueda = 'amenity~"bar|pub|nightclub"';

  const radio = 8000; // Aumentado a 8KM para encontrar más cosas en Rancagua

  const query = `
    [out:json][timeout:35];
    (
      node[${tagBusqueda}](around:${radio},${lat},${lng});
      way[${tagBusqueda}](around:${radio},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query)
    });

    if (!response.ok) throw new Error("API Overpass saturada");
    
    const textoRespuesta = await response.text();
    if (textoRespuesta.trim().startsWith('<')) throw new Error("API devolvió XML");

    const data = JSON.parse(textoRespuesta);

    const resultadosProcesados = data.elements.map((el, index) => {
      const lLat = el.lat || el.center.lat;
      const lLng = el.lon || el.center.lon;
      const fotoRandom = FOTOS_COMIDA[index % FOTOS_COMIDA.length];
      const ratingRandom = (3.8 + Math.random() * 1.2).toFixed(1);
      
      return {
        id: el.id,
        nombre: el.tags.name || "Local sin nombre",
        categoria: el.tags.cuisine || el.tags.amenity || "Restaurante",
        imagen: fotoRandom,
        rating: ratingRandom,
        ubicacion: "Ver en mapa",
        lat: lLat,
        lng: lLng,
        distancia: getDistancia(lat, lng, lLat, lLng)
      };
    }).sort((a, b) => a.distancia - b.distancia).slice(0, 50); // Mostramos hasta 50 locales

    // Guardamos en caché para la próxima
    sessionStorage.setItem(cacheKey, JSON.stringify(resultadosProcesados));
    
    return resultadosProcesados;

  } catch (error) {
    console.warn("⚠️ Error de red, intentando recuperación...", error);
    return [];
  }
};