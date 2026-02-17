const API_KEY = '2C4PATBQTB2GTH12GCHRYHJ542IUHLGJQM1XZ0XH1GICUW33';

export const buscarLocalesPro = async (lat, lng, categoriaId = '13000', soloAbiertos = false) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: API_KEY
    }
  };

  try {
    // Añadimos &open_now=true si el usuario activa el filtro
    let url = `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&categories=${categoriaId}&radius=5000&fields=fsq_id,name,categories,photos,rating,location,geocodes,distance&limit=20`;
    
    if (soloAbiertos) {
      url += '&open_now=true';
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return data.results.map(local => ({
      id: local.fsq_id,
      nombre: local.name,
      categoria: local.categories[0]?.name || "Restaurante",
      imagen: local.photos?.[0] 
        ? `${local.photos[0].prefix}400x300${local.photos[0].suffix}` 
        : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
      rating: local.rating ? (local.rating / 2).toFixed(1) : "4.2",
      ubicacion: local.location?.address || "Dirección en mapa",
      lat: local.geocodes.main.latitude,
      lng: local.geocodes.main.longitude,
      distancia: (local.distance / 1000).toFixed(2)
    }));
  } catch (err) {
    console.error("Error al buscar:", err);
    return [];
  }
};