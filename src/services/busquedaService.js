const API_KEY = 'fsq3htC0kDZNJP1JjnuuziGUPlmWbtbT/brTP1YXvWIJZUo=';

export const buscarLocalesPro = async (lat, lng, categoriaId = '13000', soloAbiertos = false) => {
  // Configuración obligatoria para Foursquare V3
  const options = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': API_KEY,
      'fsq-version': '20231010' // <--- ESTO ES LO CRÍTICO PARA EVITAR EL ERROR 410
    }
  };

  try {
    let url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&categories=${categoriaId}&radius=5000&fields=fsq_id,name,categories,photos,rating,location,geocodes,distance&limit=20`;
    
    if (soloAbiertos) {
      url += '&open_now=true';
    }

    console.log("Consultando Foursquare..."); // Para verificar que el código nuevo está corriendo

    const response = await fetch(url, options);
    
    // Si la API falla, lanzamos error para manejarlo abajo
    if (!response.ok) {
        console.error(`Error API: ${response.status} ${response.statusText}`);
        return []; 
    }

    const data = await response.json();

    if (!data.results) return [];

    return data.results.map(local => ({
      id: local.fsq_id,
      nombre: local.name,
      categoria: local.categories[0]?.name || "General",
      imagen: local.photos?.[0] 
        ? `${local.photos[0].prefix}400x300${local.photos[0].suffix}` 
        : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      rating: local.rating ? (local.rating / 2).toFixed(1) : "4.0", 
      ubicacion: local.location?.address || "Ver en mapa",
      lat: local.geocodes.main.latitude,
      lng: local.geocodes.main.longitude,
      distancia: (local.distance / 1000).toFixed(2)
    }));
  } catch (err) {
    console.error("Error de conexión:", err);
    return []; 
  }
};