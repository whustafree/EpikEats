const API_KEY = 'fsq3htC0kDZNJP1JjnuuziGUPlmWbtbT/brTP1YXvWIJZUo=';

export const buscarLocalesPro = async (lat, lng, categoriaId = '13000', soloAbiertos = false) => {
  // Construimos las cabeceras de forma estricta
  const misCabeceras = new Headers();
  misCabeceras.append('Accept', 'application/json');
  misCabeceras.append('Authorization', API_KEY.trim()); // Limpiamos espacios
  misCabeceras.append('fsq-version', '20231010');

  const options = {
    method: 'GET',
    headers: misCabeceras,
    mode: 'cors', // Importante para navegadores
    cache: 'no-cache' // Evita que lea versiones viejas
  };

  try {
    let url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&categories=${categoriaId}&radius=5000&fields=fsq_id,name,categories,photos,rating,location,geocodes,distance&limit=20`;
    
    if (soloAbiertos) {
      url += '&open_now=true';
    }

    console.log("🚀 Enviando petición a Foursquare con headers...");

    const response = await fetch(url, options);
    
    if (!response.ok) {
        // Si sigue el error, esto nos dirá exactamente qué pasó en la consola
        console.error(`❌ Error Foursquare: ${response.status} - Verifica tu API Key o Conexión`);
        return []; 
    }

    const data = await response.json();

    if (!data.results) return [];

    return data.results.map(local => ({
      id: local.fsq_id,
      nombre: local.name,
      categoria: local.categories[0]?.name || "Restaurante",
      imagen: local.photos?.[0] 
        ? `${local.photos[0].prefix}400x300${local.photos[0].suffix}` 
        : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      rating: local.rating ? (local.rating / 2).toFixed(1) : "4.0", 
      ubicacion: local.location?.address || "Rancagua",
      lat: local.geocodes.main.latitude,
      lng: local.geocodes.main.longitude,
      distancia: (local.distance / 1000).toFixed(2)
    }));
  } catch (err) {
    console.error("❌ Fallo crítico:", err);
    return []; 
  }
};