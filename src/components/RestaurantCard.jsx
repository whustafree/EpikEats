import React from 'react';

function RestaurantCard({ local, esFavorito, onFav }) {
  // Generamos un precio aleatorio estilo RPG (G, GG, GGG)
  const precio = "💰".repeat(Math.floor(Math.random() * 3) + 1);

  // Lógica Geek: Si el nombre o categoría suena "friki", es LEGENDARIO
  // Agrega aquí palabras clave de tus picadas favoritas
  const palabrasGeek = ['burger', 'pizza', 'sushi', 'dragon', 'comic', 'game', 'bar'];
  
  // Verificamos si es temático (búsqueda simple en nombre o categoría)
  const esTematico = palabrasGeek.some(palabra => 
    local.nombre.toLowerCase().includes(palabra) || 
    local.categoria.toLowerCase().includes(palabra)
  );

  const enviarWhatsapp = () => {
    const mensaje = `⚔️ ¡Encontré un loot legendario en Rancagua! *${local.nombre}*. Ubicación: ${local.ubicacion}. ¿Vamos? 🎮`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    // Aquí aplicamos la clase "legendary" si es temático
    <div className={`card ${esTematico ? 'legendary' : ''}`}>
      <div className="card-img-container" style={{ backgroundImage: `url(${local.imagen})` }}>
        <button className="btn-fav" onClick={onFav}>
          {esFavorito ? '❤️' : '🤍'}
        </button>
        <div className="card-badge">
           {esTematico ? '✨ RARE DROP' : local.categoria}
        </div>
      </div>
      
      <div className="card-info-pro">
        <div className="info-header">
          <h3>{local.nombre}</h3>
          <span className="star-rating">⭐ {local.rating}</span>
        </div>
        
        <p className="address-text">📍 {local.ubicacion} • <span style={{color: '#ffd700'}}>{precio}</span></p>
        
        <div className="info-footer">
          <span className="dist-text">🚀 {local.distancia} KM</span>
          <div className="actions">
            <button onClick={enviarWhatsapp} className="btn-whatsapp">💬</button>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${local.lat},${local.lng}`} 
              target="_blank" 
              className="btn-go-pro"
            >
              WARP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;