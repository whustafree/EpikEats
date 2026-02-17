const API_KEY = 'fsq3htC0kDZNJP1JjnuuziGUPlmWbtbT/brTP1YXvWIJZUo=';

export const buscarLocalesPro = async (lat, lng, categoriaId = '13000', soloAbiertos = false) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: API_KEY,
      // ESTO ES LO QUE FALTA PARA EVITAR EL ERROR 410
      'fsq-version': '20231010' 
    }
  };

  try {
    let url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&categories=${categoriaId}&radius=5000&fields=fsq_id,name,categories,photos,rating,location,geocodes,distance&limit=20`;
    
    if (soloAbiertos) {
      url += '&open_now=true';
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
        console.error("Error de Foursquare:", response.status);
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
        : "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      rating: local.rating ? (local.rating / 2).toFixed(1) : "4.0", 
      ubicacion: local.location?.address || "Rancagua",
      lat: local.geocodes.main.latitude,
      lng: local.geocodes.main.longitude,
      distancia: (local.distance / 1000).toFixed(2)
    }));
  } catch (err) {
    console.error("Fallo de red:", err);
    return []; 
  }
};