import React, { useState, useEffect } from 'react';
import { buscarLocalesPro } from './services/busquedaService';
import RestaurantCard from './components/RestaurantCard';
import Mapa from './components/Mapa';
import './App.css';

const CATEGORIAS = [
  { id: '13000', nombre: 'Todos', icono: '🍴' },
  { id: '13031', nombre: 'Burgers', icono: '🍔' },
  { id: '13064', nombre: 'Pizza', icono: '🍕' },
  { id: '13276', nombre: 'Sushi', icono: '🍣' },
  { id: '13035', nombre: 'Café', icono: '☕' },
  { id: '13003', nombre: 'Bar/Pub', icono: '🍺' },
];

function App() {
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [catActiva, setCatActiva] = useState('13000');
  const [soloAbiertos, setSoloAbiertos] = useState(false); // Estado para el filtro
  const [view, setView] = useState('grid');

  const cargarDatos = (lat, lng, catId, abiertos) => {
    setLoading(true);
    buscarLocalesPro(lat, lng, catId, abiertos).then(res => {
      setLocales(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMiUbicacion(coords);
      cargarDatos(coords.lat, coords.lng, catActiva, soloAbiertos);
    });
  }, []);

  const manejarCambioFiltro = () => {
    const nuevoEstado = !soloAbiertos;
    setSoloAbiertos(nuevoEstado);
    if (miUbicacion) {
      cargarDatos(miUbicacion.lat, miUbicacion.lng, catActiva, nuevoEstado);
    }
  };

  const cambiarCategoria = (id) => {
    setCatActiva(id);
    if (miUbicacion) {
      cargarDatos(miUbicacion.lat, miUbicacion.lng, id, soloAbiertos);
    }
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="logo">EpikEats 🍔</h1>
        <div className="nav-actions">
          <button onClick={() => setView('grid')} className={view === 'grid' ? 'active' : ''}>Lista</button>
          <button onClick={() => setView('map')} className={view === 'map' ? 'active' : ''}>Mapa</button>
        </div>
      </nav>

      <div className="filter-bar">
        {CATEGORIAS.map(cat => (
          <button 
            key={cat.id} 
            className={`filter-item ${catActiva === cat.id ? 'active' : ''}`}
            onClick={() => cambiarCategoria(cat.id)}
          >
            <span className="filter-icon">{cat.icono}</span>
            <span className="filter-label">{cat.nombre}</span>
          </button>
        ))}
      </div>

      {/* Selector de Abiertos Ahora */}
      <div className="status-filter-container">
        <label className="switch-label">
          <input 
            type="checkbox" 
            checked={soloAbiertos} 
            onChange={manejarCambioFiltro} 
          />
          <span className="slider"></span>
          <span className="label-text">Abiertos ahora 🟢</span>
        </label>
      </div>

      <main className="container">
        {loading ? (
          <div className="loader">Buscando locales...</div>
        ) : (
          view === 'grid' ? (
            <div className="grid">
              {locales.length > 0 ? (
                locales.map(l => <RestaurantCard key={l.id} local={l} />)
              ) : (
                <div className="no-results">
                  <p>Parece que no hay locales abiertos en esta categoría ahora. 🌙</p>
                </div>
              )}
            </div>
          ) : (
            <Mapa locales={locales} centro={miUbicacion} />
          )
        )}
      </main>
      
      <button className="fab-refresh" onClick={() => cargarDatos(miUbicacion.lat, miUbicacion.lng, catActiva, soloAbiertos)}>🔄</button>
    </div>
  );
}

export default App;