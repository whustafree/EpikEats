// Imágenes de alta calidad para el look Cyberpunk/Pro
const FOTOS_COMIDA = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", // Burger
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", // Pizza
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", // Sushi
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", // Café
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", // Burger 2
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", // Pizza 2
  "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=500"  // Café 2
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

// DATOS DE RESPALDO (Por si la API falla, Rancagua no se queda sin comer)
const RESPALDO_RANCAGUA = [
  { id: 991, nombre: "El Bajón Legendario", categoria: "Burger", lat: -34.1701, lng: -70.7410 },
  { id: 992, nombre: "Pizza Pixel", categoria: "Pizza", lat: -34.1720, lng: -70.7450 },
  { id: 993, nombre: "Sushi Shinobi", categoria: "Sushi", lat: -34.1690, lng: -70.7390 },
  { id: 994, nombre: "Café Java", categoria: "Café", lat: -34.1650, lng: -70.7420 },
  { id: 995, nombre: "Taverna RPG", categoria: "Bar", lat: -34.1710, lng: -70.7380 },
];

export const buscarLocalesPro = async (lat, lng, categoriaId = '13000', soloAbiertos = false) => {
  // Construimos la query para OpenStreetMap (Overpass API)
  let tagBusqueda = 'amenity~"restaurant|cafe|fast_food|bar|pub"';
  
  if (categoriaId === '13031') tagBusqueda = 'cuisine~"burger|sandwich"';
  if (categoriaId === '13064') tagBusqueda = 'cuisine~"pizza|italian"';
  if (categoriaId === '13276') tagBusqueda = 'cuisine~"sushi|japanese"';
  if (categoriaId === '13035') tagBusqueda = 'amenity="cafe"';
  if (categoriaId === '13003') tagBusqueda = 'amenity~"bar|pub"';

  const radio = 3000; 

  // Query optimizada
  const query = `
    [out:json][timeout:25];
    (
      node[${tagBusqueda}](around:${radio},${lat},${lng});
      way[${tagBusqueda}](around:${radio},${lat},${lng});
    );
    out center;
  `;

  try {
    // CAMBIO CLAVE: Usamos POST en lugar de GET para evitar errores de URL
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(query)
    });

    // Si la respuesta no es OK o no es JSON, saltamos al catch
    if (!response.ok) throw new Error("API Overpass saturada");
    
    const textoRespuesta = await response.text();
    
    // Verificamos si nos devolvió XML por error
    if (textoRespuesta.trim().startsWith('<')) {
        throw new Error("API devolvió XML en vez de JSON");
    }

    const data = JSON.parse(textoRespuesta);

    return data.elements.map((el, index) => {
      const lLat = el.lat || el.center.lat;
      const lLng = el.lon || el.center.lon;
      const fotoRandom = FOTOS_COMIDA[index % FOTOS_COMIDA.length];
      const ratingRandom = (3.8 + Math.random() * 1.2).toFixed(1);
      
      return {
        id: el.id,
        nombre: el.tags.name || "Local Descubierto",
        categoria: el.tags.cuisine || el.tags.amenity || "Restaurante",
        imagen: fotoRandom,
        rating: ratingRandom,
        ubicacion: "En el radar",
        lat: lLat,
        lng: lLng,
        distancia: getDistancia(lat, lng, lLat, lLng)
      };
    }).sort((a, b) => a.distancia - b.distancia).slice(0, 20);

  } catch (error) {
    console.warn("⚠️ Alerta de Sistema: API Offline. Activando protocolo de respaldo.", error);
    
    // PROTOCOLO DE RESPALDO: Devolvemos datos simulados cerca de la ubicación del usuario
    return RESPALDO_RANCAGUA.map((local, index) => ({
        ...local,
        imagen: FOTOS_COMIDA[index % FOTOS_COMIDA.length],
        rating: "4.5",
        ubicacion: "Simulación de Respaldo",
        distancia: getDistancia(lat, lng, local.lat, local.lng)
    }));
  }
};