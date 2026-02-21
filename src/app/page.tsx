'use client';

import { useState, useMemo } from 'react';
import styles from './page.module.css';
import SearchFilters from '@/components/SearchFilters';
import ItineraryCard from '@/components/ItineraryCard';
import itinerariesOriginal from '@/data/itineraries.json';

// Type definition to ensure type safety with JSON import
interface Itinerary {
  id: string;
  title: string;
  duration: string;
  states: string[];
  author: string;
  description: string;
  days: any[];
}

const itineraries: Itinerary[] = itinerariesOriginal as Itinerary[];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');

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

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>
            Discover & Share <span className={styles.highlight}>Tirth Yatra Itineraries</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Find detailed travel plans for Jain Tirths, complete with Dharmshala and Bhojanshala information. Plan your spiritual journey today.
          </p>
          <div className={styles.searchContainer}>
            <SearchFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
            />
          </div>
        </div>
      </section>

      <section className={`container ${styles.featuredSection}`}>
        <h2 className={styles.sectionTitle}>
          {filteredItineraries.length === itineraries.length
            ? 'Featured Itineraries'
            : `Found ${filteredItineraries.length} Itinerary${filteredItineraries.length !== 1 ? 'ies' : ''}`
          }
        </h2>
        {filteredItineraries.length === 0 ? (
          <div className={styles.noResults}>
            <p>No itineraries found matching your search criteria.</p>
            <p className={styles.noResultsHint}>Try adjusting your filters or search term.</p>
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
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
