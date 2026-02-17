import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const iconLocal = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});

const iconYo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  iconSize: [25, 41], iconAnchor: [12, 41],
});

function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 16);
    }
  }, [coords, map]);
  return null;
}

function Mapa({ locales, centro }) {
  // Si no hay centro, no renderizamos el mapa para evitar el salto a la Plaza de los Héroes
  if (!centro) return <div className="loader">Cargando mapa...</div>;

  return (
    <div className="map-container">
      <MapContainer center={[centro.lat, centro.lng]} zoom={16} style={{ height: "100%", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RecenterMap coords={centro} />
        
        <Marker position={[centro.lat, centro.lng]} icon={iconYo}>
          <Popup><strong>Estás aquí</strong></Popup>
        </Marker>

        {locales.map(l => (
          <Marker key={l.id} position={[l.lat, l.lng]} icon={iconLocal}>
            <Popup>
              <strong>{l.nombre}</strong><br/>
              Distancia: {l.distancia < 1 ? `${(l.distancia * 1000).toFixed(0)}m` : `${l.distancia.toFixed(2)}km`}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
export default Mapa;