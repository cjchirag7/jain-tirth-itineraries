'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import SearchFilters from '@/components/SearchFilters';
import ItineraryCard from '@/components/ItineraryCard';
import ChaturmasModal from '@/components/ChaturmasModal';
import itinerariesOriginal from '@/data/itineraries.json';

// Type definition to ensure type safety with JSON import
interface Itinerary {
  id: string;
  title: string;
  duration: string;
  states: string[];
  author: string;
  description: string;
  startingCity?: string;
  endingCity?: string;
  keywords?: string[];
  days: any[];
}

const itineraries: Itinerary[] = itinerariesOriginal as unknown as Itinerary[];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [isModalOpen, setIsModalOpen] = useState<boolean | undefined>(undefined);

  const handleSearchClick = () => {
    // Scroll to results section 
    const featuredSection = document.getElementById('featured-section');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredItineraries = useMemo(() => {
    return itineraries.filter((itinerary) => {
      const matchesSearch = searchTerm === '' ||
        itinerary.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itinerary.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itinerary.days.some(day =>
          day.stops.some((stop: any) =>
            stop.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

      const matchesState = selectedState === '' ||
        itinerary.states.includes(selectedState);

      // Extract number from duration string (e.g., "2 Days" -> 2)
      const durationMatch = itinerary.duration.match(/\d+/);
      const durationNumber = durationMatch ? parseInt(durationMatch[0]) : 0;

      const matchesDuration = selectedDuration === '' ||
        (selectedDuration === '5+' ? durationNumber >= 5 : durationNumber.toString() === selectedDuration);

      return matchesSearch && matchesState && matchesDuration;
    });
  }, [searchTerm, selectedState, selectedDuration]);

  const searchSuggestions = useMemo(() => {
    const suggestions = new Set<string>();
    itineraries.forEach(itinerary => {
      suggestions.add(itinerary.title);
      itinerary.days.forEach(day => {
        day.stops.forEach((stop: any) => {
          suggestions.add(stop.name);
        });
      });
    });
    return Array.from(suggestions).sort();
  }, []);

  const totalRoutes = itineraries.length;
  const totalUniqueTirths = useMemo(() => {
    const tirths = new Set<string>();
    itineraries.forEach(itinerary => {
      itinerary.days.forEach(day => {
        day.stops.forEach((stop: any) => {
          if (stop.type === 'Tirth' || stop.type === 'Temple') {
            tirths.add(stop.name);
          }
        });
      });
    });
    return tirths.size;
  }, []);

  const uniqueStates = useMemo(() => {
    const states = new Set<string>();
    itineraries.forEach(itinerary => {
      itinerary.states.forEach(state => states.add(state));
    });
    return Array.from(states).sort();
  }, []);

  return (
    <div className={styles.wrapper}>
      <ChaturmasModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Discover & Share <span className={styles.highlight}>Jain Routes</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Find detailed travel plans for Jain Tirths, complete with Dharmshalas. Plan your spiritual journey today.
          </p>
          <div className={styles.searchContainer}>
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              searchSuggestions={searchSuggestions}
              states={uniqueStates}
              onSearchClick={handleSearchClick}
            />
          </div>
          <div className={styles.ctaGroup}>
            <button className="btn btn-outline" onClick={() => {
              const searchInput = document.querySelector('input');
              if (searchInput) searchInput.focus();
            }}>
              Explore Routes
            </button>
            <Link href="/directory" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📍 Places Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Permanent Banner Section for Chaturmas PDFs */}
      <section className="container" style={{ margin: '2rem auto' }}>
        <div className="card" style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '1px solid #fed7aa',
          padding: '1.5rem',
          borderRadius: '1rem'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#9a3412', fontSize: '1.25rem', fontWeight: 700 }}>
              🙏 Bengaluru Chaturmaas 2026 (आत्म-सिलिकॉन वर्षायोग) - Itinerary PDFs
            </h3>
            <p style={{ margin: '0.25rem 0 0', color: '#c2410c', fontSize: '0.9rem' }}>
              Download ready-to-use print & digital itinerary tables for Karnataka & Tamil Nadu.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem'
          }}>
            <a
              href="/pdfs/karnataka-itinerary-en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                background: 'white',
                border: '1px solid #fdba74',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>Karnataka Itineraries</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>English PDF</span>
              </div>
            </a>

            <a
              href="/pdfs/karnataka-itinerary-hi.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                background: 'white',
                border: '1px solid #fdba74',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📜</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>कर्नाटक यात्रा मार्ग</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>हिंदी PDF</span>
              </div>
            </a>

            <a
              href="/pdfs/tamil-nadu-itinerary-en.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                background: 'white',
                border: '1px solid #fdba74',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>Tamil Nadu Itineraries</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>English PDF</span>
              </div>
            </a>

            <a
              href="/pdfs/tamil-nadu-itinerary-hi.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                background: 'white',
                border: '1px solid #fdba74',
                textDecoration: 'none'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>📜</span>
              <div>
                <strong style={{ display: 'block', color: 'var(--secondary)', fontSize: '0.95rem' }}>तमिलनाडु यात्रा मार्ग</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>हिंदी PDF</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section id="featured-section" className={`container ${styles.featuredSection}`}>
        <h2 className={styles.sectionTitle}>
          {filteredItineraries.length === itineraries.length
            ? 'Featured Itineraries'
            : `Found ${filteredItineraries.length} ${filteredItineraries.length !== 1 ? 'Itineraries' : 'Itinerary'}`
          }
        </h2>
        {filteredItineraries.length === 0 ? (
          <div className={styles.noResults}>
            <p>No itineraries found matching your search criteria.</p>
            <p className={styles.noResultsHint}>Be the first to <Link href="/submit" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>share a route</Link> for this area!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredItineraries.map((itinerary) => (
              <ItineraryCard
                key={itinerary.id}
                id={itinerary.id}
                title={itinerary.title}
                duration={itinerary.duration}
                states={itinerary.states}
                description={itinerary.description}
                author={itinerary.author}
                authorInstagram={(itinerary as any).authorInstagram}
              />
            ))}
          </div>
        )}
      </section>

      <section className={styles.impactSection}>
        <div className="container">
          <h2 className={styles.sectionTitle} style={{ color: 'white' }}>Our Community Impact</h2>
          <p className={styles.impactSubtitle}>Jain Routes is built by the community, for the community.</p>

          <div className={styles.impactGrid}>
            <div className={styles.impactItem}>
              <h3>{totalUniqueTirths}</h3>
              <p>Tirths Covered</p>
            </div>
            <div className={styles.impactItem}>
              <h3>{totalRoutes}</h3>
              <p>Verified Routes</p>
            </div>
            <div className={styles.impactItem}>
              <h3>1000+</h3>
              <p>Yatris & Growing</p>
            </div>
          </div>

          <div className={styles.contributionNudge}>
            <h3>Earn Punya by Guiding Others</h3>
            <p>Your travel experience can help a fellow Sadharmi plan their spiritual journey safely and comfortably.</p>
            <Link href="/submit" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>
              Contribute an Itinerary
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
