import React from 'react';

function RestaurantCard({ local, esFavorito, onFav }) {
  // Generamos un precio aleatorio visual ($, $$, $$$)
  const precio = "$".repeat(Math.floor(Math.random() * 3) + 1);

  const enviarWhatsapp = () => {
    const mensaje = `¡Oye! Encontré esta picada buena en EpikEats: *${local.nombre}*. Queda en ${local.ubicacion}. ¡Vamos! 🍔`;
    window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="card">
      <div className="card-img-container" style={{ backgroundImage: `url(${local.imagen})` }}>
        <button className={`btn-fav ${esFavorito ? 'liked' : ''}`} onClick={onFav}>
          {esFavorito ? '❤️' : '🤍'}
        </button>
        <div className="card-badge">{local.categoria}</div>
      </div>
      
      <div className="card-info-pro">
        <div className="info-header">
          <h3>{local.nombre}</h3>
          <span className="star-rating">⭐ {local.rating}</span>
        </div>
        
        <p className="address-text">📍 {local.ubicacion} • <span className="price-tag">{precio}</span></p>
        
        <div className="info-footer">
          <span className="dist-text">📏 {local.distancia} km</span>
          <div className="actions">
            <button onClick={enviarWhatsapp} className="btn-whatsapp">📲</button>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${local.lat},${local.lng}`} 
              target="_blank" 
              className="btn-go-pro"
            >
              Ir Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;