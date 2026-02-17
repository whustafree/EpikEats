const API_KEY = 'fsq3htC0kDZNJP1JjnuuziGUPlmWbtbT/brTP1YXvWIJZUo=';

export const buscarLocalesPro = async (lat, lng, categoriaId = '13000', soloAbiertos = false) => {
  try {
    const searchParams = new URLSearchParams({
      ll: `${lat},${lng}`,
      categories: categoriaId,
      radius: '5000',
      fields: 'fsq_id,name,categories,photos,rating,location,geocodes,distance',
      limit: '20'
    });

    if (soloAbiertos) {
      searchParams.append('open_now', 'true');
    }

    // Usamos el formato más simple posible para las cabeceras
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?${searchParams.toString()}`, 
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: API_KEY,
          'fsq-version': '20231010' // Esta es la clave del error 410
        }
      }
    );

    if (!response.ok) throw new Error(`Error API: ${response.status}`);

    const data = await response.json();
    if (!data.results) return [];

    return data.results.map(local => ({
      id: local.fsq_id,
      nombre: local.name,
      categoria: local.categories[0]?.name || "Restaurante",
      imagen: local.photos?.[0] 
        ? `${local.photos[0].prefix}400x300${local.photos[0].suffix}` 
        : "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
      rating: local.rating ? (local.rating / 2).toFixed(1) : "4.0",
      ubicacion: local.location?.address || "Rancagua",
      lat: local.geocodes.main.latitude,
      lng: local.geocodes.main.longitude,
      distancia: (local.distance / 1000).toFixed(2)
    }));

  } catch (err) {
    console.error("Fallo búsqueda:", err);
    return [];
  }
};