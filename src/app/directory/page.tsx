'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './page.module.css';
import tirthsData from '@/data/tirths.json';
import dharmshalasData from '@/data/dharmshalas.json';

// Dynamically import the map component with SSR disabled
const PlacesMap = dynamic(() => import('@/components/PlacesMap'), {
  ssr: false,
  loading: () => <div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>Loading Map...</div>
});

type PlaceType = 'tirth' | 'dharmshala';

interface Place {
  id: string;
  name: string;
  type?: string;
  introText?: string;
  state?: string;
  source: PlaceType;
  facilities: string[];
  location: { lat: number | null; lng: number | null; mapsLink: string };
}

const allPlaces: Place[] = [
  ...tirthsData.map(t => ({ ...t, source: 'tirth' as PlaceType })),
  ...dharmshalasData.map(d => ({ ...d, source: 'dharmshala' as PlaceType }))
].sort((a, b) => a.name.localeCompare(b.name));

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tirth' | 'dharmshala'>('all');
  const [filterState, setFilterState] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    allPlaces.forEach(p => {
      if ((p as any).state) states.add((p as any).state);
    });
    return Array.from(states).sort();
  }, []);

  const filteredPlaces = useMemo(() => {
    return allPlaces.filter(place => {
      const displayState = (place as any).state || '';

      const matchesSearch = searchTerm === '' || 
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (place.introText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        displayState.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || place.source === filterType;
      
      const matchesState = filterState === '' || displayState === filterState;

      return matchesSearch && matchesType && matchesState;
    });
  }, [searchTerm, filterType, filterState]);

  return (
    <div className={`container ${styles.wrapper}`}>
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>Jain Places Directory</h1>
        <p className={styles.headerSubtitle}>
          Explore our comprehensive database of Jain Tirths, Temples, and Dharmshalas across India.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchRow}>
          <input 
            type="text" 
            placeholder="Search by name or location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select 
            className={styles.stateSelect}
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="">All States</option>
            {uniqueStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterRow}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabBtn} ${filterType === 'all' ? styles.active : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Places
            </button>
            <button 
              className={`${styles.tabBtn} ${filterType === 'tirth' ? styles.active : ''}`}
              onClick={() => setFilterType('tirth')}
            >
              Tirths & Temples
            </button>
            <button 
              className={`${styles.tabBtn} ${filterType === 'dharmshala' ? styles.active : ''}`}
              onClick={() => setFilterType('dharmshala')}
            >
              Dharmshalas
            </button>
          </div>

          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              📄 List
            </button>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => setViewMode('map')}
            >
              🗺️ Map
            </button>
          </div>
        </div>
      </div>

      {filteredPlaces.length === 0 ? (
        <div className={styles.noResults}>
          <h3>No places found</h3>
          <p>Try adjusting your search terms or filters.</p>
        </div>
      ) : viewMode === 'map' ? (
        <PlacesMap places={filteredPlaces} />
      ) : (
        <div className={styles.grid}>
          {filteredPlaces.map(place => (
            <Link href={`/${place.source}/${place.id}`} key={`${place.source}-${place.id}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={`${styles.badge} ${place.source === 'tirth' ? styles.badgeTirth : styles.badgeDharmshala}`}>
                  {place.type || (place.source === 'tirth' ? 'Tirth' : 'Dharmshala')}
                </span>
                <h2 className={styles.cardTitle}>{place.name}</h2>
              </div>
              
              <div className={styles.cardBody}>
                <p className={styles.cardDesc}>
                  {place.introText || `View details and contact information for ${place.name}.`}
                </p>
                {place.facilities && place.facilities.length > 0 && (
                  <div className={styles.facilities}>
                    {place.facilities.slice(0, 3).map(f => (
                      <span key={f} className={styles.facilityTag}>{f}</span>
                    ))}
                    {place.facilities.length > 3 && (
                      <span className={styles.facilityTag}>+{place.facilities.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.location}>
                  📍 {(place as any).state || 'India'}
                </span>
                <span className={styles.viewLink}>View Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
