'use client';

import styles from './SearchFilters.module.css';
import Autocomplete from './Autocomplete';

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedState: string;
    setSelectedState: (state: string) => void;
    selectedDuration: string;
    setSelectedDuration: (duration: string) => void;
    searchSuggestions: string[];
    states: string[];
}

export default function SearchFilters({
    searchTerm,
    setSearchTerm,
    selectedState,
    setSelectedState,
    selectedDuration,
    setSelectedDuration,
    searchSuggestions,
    states
}: SearchFiltersProps) {
    return (
        <div className={`card ${styles.filters}`}>
            <div className={styles.inputGroup}>
                <label htmlFor="search" className={styles.label}>Tirth / Place Name</label>
                <Autocomplete
                    id="search"
                    placeholder="e.g. Ponnur Malai"
                    value={searchTerm}
                    onChange={setSearchTerm}
                    suggestions={searchSuggestions}
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="state" className={styles.label}>State</label>
                <select
                    id="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={styles.select}
                >
                    <option value="">All States</option>
                    {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="duration" className={styles.label}>Duration</label>
                <select
                    id="duration"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Any Duration</option>
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="4">4 Days</option>
                    <option value="5+">5+ Days</option>
                </select>
            </div>
        </div>
    );
}
