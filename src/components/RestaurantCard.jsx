import React, { useState } from 'react';

function RestaurantCard({ local }) {
  const [resenas, setResenas] = useState([]);
  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setResenas([input, ...resenas]);
    setInput("");
  };

  return (
    <div className="card">
      <div className="card-image" style={{ backgroundImage: `url(${local.imagen})` }}>
        <span className="badge">{local.tematica}</span>
      </div>
      <div className="card-body">
        <div className="card-header">
          <h3>{local.nombre}</h3>
          <span className="rating">⭐ {local.rating}</span>
        </div>
        <p className="address">📍 {local.ubicacion}</p>
        
        <div className="reviews">
          {resenas.slice(0, 2).map((r, i) => (
            <p key={i} className="review-text">" {r} "</p>
          ))}
          <form onSubmit={handleAdd} className="review-form">
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Deja una reseña..." 
            />
            <button type="submit">p</button>
          </form>
        </div>
        
        <a href={`https://instagram.com/${local.instagram}`} target="_blank" className="btn-social">
          Ver Instagram
        </a>
      </div>
    </div>
  );
}

export default RestaurantCard;