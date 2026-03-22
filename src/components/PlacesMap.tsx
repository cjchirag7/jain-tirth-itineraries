'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Custom Marker Icons for different types
const tirthIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const dharmshalaIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Place {
  id: string;
  name: string;
  type?: string; 
  source: 'tirth' | 'dharmshala';
  location?: { lat: number | null; lng: number | null; mapsLink?: string };
  introText?: string;
  state?: string;
  facilities?: string[];
}

function MapUpdater({ places }: { places: Place[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (places.length > 0) {
      const bounds = L.latLngBounds(
        places.map(p => L.latLng(p.location!.lat!, p.location!.lng!))
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [places, map]);

  return null;
}

export default function PlacesMap({ places }: { places: Place[] }) {
  const validPlaces = places.filter(
    (p) => p.location && p.location.lat != null && p.location.lng != null
  );

  // Default center to central India
  const center: [number, number] = validPlaces.length > 0 
    ? [validPlaces[0].location!.lat!, validPlaces[0].location!.lng!] 
    : [22.9734, 78.6569];

  return (
    <div style={{ height: '600px', width: '100%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: '1px solid var(--border)' }}>
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <MapUpdater places={validPlaces} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPlaces.map((place) => (
          <Marker 
            key={`${place.source}-${place.id}`} 
            position={[place.location!.lat!, place.location!.lng!]}
            icon={place.source === 'tirth' ? tirthIcon : dharmshalaIcon}
          >
            <Tooltip direction="top" offset={[0, -40]} opacity={1}>
              <span style={{ fontWeight: 600 }}>{place.name}</span>
            </Tooltip>
            <Popup>
              <div style={{ padding: '2px', display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#333', fontWeight: 'bold' }}>{place.name}</h3>
                <span style={{ 
                  backgroundColor: place.source === 'tirth' ? '#fff1e6' : '#e6f3ff', 
                  color: place.source === 'tirth' ? '#d35400' : '#0066cc',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  width: 'fit-content',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>
                  {place.type || (place.source === 'tirth' ? 'Tirth' : 'Dharmshala')}
                </span>
                {place.introText && (
                  <p style={{ margin: 0, fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                    {place.introText.length > 80 ? `${place.introText.substring(0, 80)}...` : place.introText}
                  </p>
                )}
                <Link 
                  href={`/${place.source}/${place.id}`}
                  style={{ 
                    display: 'inline-block', 
                    marginTop: '4px',
                    color: '#ff6b35',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  View Details &rarr;
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
