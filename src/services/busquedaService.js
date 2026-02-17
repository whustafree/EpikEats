// Imágenes de alta calidad para que la app se vea profesional
const FOTOS_COMIDA = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", // Burger
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", // Pizza
  "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500", // Sushi
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500", // Café
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", // Burger 2
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", // Pizza 2
  "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500"  // Sushi 2
];

// Función auxiliar para calcular distancia (Haversine)
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
  // Traducimos tus categorías de Foursquare a etiquetas de OpenStreetMap
  let tagBusqueda = 'amenity~"restaurant|cafe|fast_food|bar|pub"';
  
  if (categoriaId === '13031') tagBusqueda = 'cuisine~"burger|sandwich"'; // Burgers
  if (categoriaId === '13064') tagBusqueda = 'cuisine~"pizza|italian"'; // Pizza
  if (categoriaId === '13276') tagBusqueda = 'cuisine~"sushi|japanese"'; // Sushi
  if (categoriaId === '13035') tagBusqueda = 'amenity="cafe"'; // Café
  if (categoriaId === '13003') tagBusqueda = 'amenity~"bar|pub"'; // Bar

  const radio = 3000; // 3km a la redonda

  const query = `
    [out:json];
    (
      node[${tagBusqueda}](around:${radio},${lat},${lng});
      way[${tagBusqueda}](around:${radio},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    const data = await response.json();

    return data.elements.map((el, index) => {
      const lLat = el.lat || el.center.lat;
      const lLng = el.lon || el.center.lon;
      
      // Magia: Asignamos datos "Pro" simulados para que se vea bonito
      const fotoRandom = FOTOS_COMIDA[index % FOTOS_COMIDA.length];
      const ratingRandom = (3.5 + Math.random() * 1.5).toFixed(1); // Entre 3.5 y 5.0
      
      return {
        id: el.id,
        nombre: el.tags.name || "Local Local",
        categoria: el.tags.cuisine || el.tags.amenity || "Restaurante",
        imagen: fotoRandom,
        rating: ratingRandom,
        ubicacion: "A pasos de ti", // Simplificamos la dirección
        lat: lLat,
        lng: lLng,
        distancia: getDistancia(lat, lng, lLat, lLng)
      };
    }).sort((a, b) => a.distancia - b.distancia).slice(0, 20); // Solo los 20 más cercanos

  } catch (error) {
    console.error("Error GPS:", error);
    return [];
  }
};