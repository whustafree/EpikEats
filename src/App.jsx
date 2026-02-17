import React, { useState, useEffect } from 'react';
import { buscarLocalesCercanos } from './services/busquedaService';
import Mapa from './components/Mapa';
import './App.css';

function App() {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState("");

  const obtenerDatos = () => {
    setLoading(true);
    
    /* --- MODO DE PRUEBA ---
       Si tu PC te ubica siempre en la Plaza de los Héroes, 
       descomenta las líneas de abajo para forzar otra ubicación 
       (Ejemplo: Cerca del Hospital Regional)
    */
    
    /*
    const coordsPrueba = { lat: -34.1882, lng: -70.7335 }; 
    setMiUbicacion(coordsPrueba);
    buscarLocalesCercanos(coordsPrueba.lat, coordsPrueba.lng).then(res => {
      setLocales(res);
      setLoading(false);
    });
    return; 
    */
    
    /* --- FIN MODO DE PRUEBA --- */

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        console.log("Ubicación real detectada:", coords);
        setMiUbicacion(coords);
        
        const res = await buscarLocalesCercanos(coords.lat, coords.lng);
        setLocales(res);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.error("Error de GPS:", error);
        alert("No se pudo obtener la ubicación precisa. Se usará la ubicación por defecto o el Modo de Prueba.");
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 0 
      }
    );
  };

  useEffect(() => { 
    obtenerDatos(); 
  }, []);

  const filtrados = locales.filter(l => 
    l.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">EpikEats</h1>
        <div className="nav-actions">
          <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}>Lista</button>
          <button onClick={() => setView('map')} className={view === 'map' ? 'active' : ''}>Mapa</button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <input 
            placeholder="¿Qué quieres comer?" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
          <button className="btn-refresh" onClick={obtenerDatos}>
            {loading ? "Buscando..." : "🔄 Actualizar Ubicación"}
          </button>
        </div>
      </header>

      <main className="container">
        {loading && <div className="loader">🛰️ Sincronizando con satélites...</div>}
        
        {!loading && (
          view === 'grid' ? (
            <div className="grid">
              {filtrados.length > 0 ? filtrados.map(l => (
                <div key={l.id} className="card">
                  <div className="card-body">
                    <h3>{l.nombre}</h3>
                    <p className="category">🍴 {l.categoria.replace('_', ' ')}</p>
                    <p className="distance">
                      📏 {l.distancia < 1 ? `${(l.distancia * 1000).toFixed(0)}m` : `${l.distancia.toFixed(2)}km`}
                    </p>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lng}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn-route"
                    >
                      ¿Cómo llegar?
                    </a>
                  </div>
                </div>
              )) : (
                <div className="no-results">
                  <p>No hay locales en 5km a la redonda o el GPS no ha conectado.</p>
                </div>
              )}
            </div>
          ) : (
            <Mapa locales={filtrados} centro={miUbicacion} />
          )
        )}
      </main>
    </div>
  );
}

export default App;