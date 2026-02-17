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
  const [view, setView] = useState('grid');
  const [favoritos, setFavoritos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Cargar Favoritos al iniciar
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('epik_favs')) || [];
    setFavoritos(favs);
  }, []);

  const toggleFavorito = (local) => {
    let nuevosFavs;
    if (favoritos.some(f => f.id === local.id)) {
      nuevosFavs = favoritos.filter(f => f.id !== local.id);
    } else {
      nuevosFavs = [...favoritos, local];
    }
    setFavoritos(nuevosFavs);
    localStorage.setItem('epik_favs', JSON.stringify(nuevosFavs));
  };

  const cargarDatos = (lat, lng, catId) => {
    setLoading(true);
    buscarLocalesPro(lat, lng, catId).then(res => {
      setLocales(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setMiUbicacion(coords);
      cargarDatos(coords.lat, coords.lng, catActiva);
    });
  }, []);

  const cambiarCategoria = (id) => {
    setCatActiva(id);
    if (miUbicacion) {
      cargarDatos(miUbicacion.lat, miUbicacion.lng, id);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <nav className="navbar">
        <h1 className="logo">EpikEats 🍔</h1>
        <div className="nav-actions">
          <button onClick={() => setDarkMode(!darkMode)} className="btn-icon">
            {darkMode ? '☀️' : '🌙'}
          </button>
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

      <main className="container">
        {loading ? (
          <div className="grid">
            {[1,2,3,4].map(n => <div key={n} className="skeleton-card"></div>)}
          </div>
        ) : (
          view === 'grid' ? (
            <div className="grid">
              {locales.length > 0 ? locales.map(l => (
                <RestaurantCard 
                  key={l.id} 
                  local={l} 
                  esFavorito={favoritos.some(f => f.id === l.id)}
                  onFav={() => toggleFavorito(l)}
                />
              )) : <p className="no-results">No hay locales cerca :(</p>}
            </div>
          ) : (
            <Mapa locales={locales} centro={miUbicacion} />
          )
        )}
      </main>
      
      <button className="fab-refresh" onClick={() => cargarDatos(miUbicacion.lat, miUbicacion.lng, catActiva)}>🔄</button>
    </div>
  );
}

export default App;