import React, { useState } from 'react';
import './App.css';

function App() {
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className="app-container">
      <header className="header">
        <h1>EpikEats 🍔</h1>
        <p>Las mejores picadas de Rancagua</p>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Busca un local (ej. Star Wars)..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </header>

      <main className="content">
        <div className="status-card">
          <p>📍 Explorando Rancagua</p>
          <span>El entorno está listo para conectar la API de Google.</span>
        </div>
      </main>

      <nav className="bottom-nav">
        <button className="nav-item active">🏠 Inicio</button>
        <button className="nav-item">📍 Mapa</button>
        <button className="nav-item">⭐ Favoritos</button>
      </nav>
    </div>
  );
}

export default App;