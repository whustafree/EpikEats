import React from 'react';

function RestaurantCard({ local }) {
  return (
    <div className="card">
      <div className="card-img-container" style={{ backgroundImage: `url(${local.imagen})` }}>
        <div className="card-badge">{local.categoria}</div>
      </div>
      <div className="card-info-pro">
        <div className="info-header">
          <h3>{local.nombre}</h3>
          <span className="star-rating">⭐ {local.rating}</span>
        </div>
        <p className="address-text">📍 {local.ubicacion}</p>
        <div className="info-footer">
          <span className="dist-text">📏 {local.distancia} km</span>
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
  );
}

export default RestaurantCard;