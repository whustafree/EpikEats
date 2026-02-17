import React, { useState } from 'react';

function RestaurantCard({ local }) {
  const [voto, setVoto] = useState(local.estrellas || 0);

  // Función para dibujar las estrellas según el puntaje
  const renderStars = (n) => {
    return "⭐".repeat(n) + "☆".repeat(5 - n);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-top">
          <span className="tag-tematico">{local.tematica || "🍽️ Local Real"}</span>
          <span className="dist-tag">{local.distancia ? `${(local.distancia * 1000).toFixed(0)}m` : ""}</span>
        </div>
        
        <h3>{local.nombre}</h3>
        <p className="description">{local.descripcion || "Encontrado vía GPS. ¡Ven a descubrirlo!"}</p>
        
        <div className="rating-area">
          <span className="stars">{renderStars(voto)}</span>
          <div className="vote-buttons">
            <button onClick={() => setVoto(Math.min(5, voto + 1))}>+</button>
            <button onClick={() => setVoto(Math.max(0, voto - 1))}>-</button>
          </div>
        </div>

        <div className="card-footer">
          <p className="addr">📍 {local.ubicacion || "Ver en mapa"}</p>
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${local.lat},${local.lng}`} 
             target="_blank" className="btn-go">
            ¿Cómo llegar?
          </a>
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;