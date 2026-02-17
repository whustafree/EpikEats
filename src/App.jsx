import React, { useState, useEffect } from 'react';
import { buscarLocalesCercanos } from './services/busquedaService';
import { picadasDestacadas } from './data/picadas';
import RestaurantCard from './components/RestaurantCard';
import Mapa from './components/Mapa';
import './App.css';

function App() {
  const [localesGPS, setLocalesGPS] = useState([]);
  const [loading, setLoading] = useState(false);
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [view, setView] = useState('grid');

  const cargarTodo = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMiUbicacion(coords);
      const res = await buscarLocalesCercanos(coords.lat, coords.lng);
      setLocalesGPS(res);
      setLoading(false);
    }, () => setLoading(false), { enableHighAccuracy: true });
  };

  useEffect(() => { cargarTodo(); }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">EpikEats 🍔</h1>
        <div className="nav-actions">
          <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}>Explorar</button>
          <button onClick={() => setView('map')} className={view === 'map' ? 'active' : ''}>Mapa</button>
        </div>
      </nav>

      {view === 'grid' && (
        <>
          <section className="top-section">
            <h2>🏆 Las Top de Rancagua</h2>
            <div className="horizontal-scroll">
              {picadasDestacadas.map((p, i) => <RestaurantCard key={i} local={p} />)}
            </div>
          </section>

          <section className="container">
            <h2>📍 Cerca de ti ahora</h2>
            {loading ? <div className="loader">Buscando locales...</div> : (
              <div className="grid">
                {localesGPS.map(l => <RestaurantCard key={l.id} local={l} />)}
              </div>
            )}
          </section>
        </>
      )}

      {view === 'map' && <Mapa locales={localesGPS} centro={miUbicacion} />}
    </div>
  );
}

export default App;