'use client';

import styles from './SearchFilters.module.css';

interface SearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedState: string;
    setSelectedState: (state: string) => void;
    selectedDuration: string;
    setSelectedDuration: (duration: string) => void;
}

export default function SearchFilters({
    searchTerm,
    setSearchTerm,
    selectedState,
    setSelectedState,
    selectedDuration,
    setSelectedDuration
}: SearchFiltersProps) {
    return (
        <div className={`card ${styles.filters}`}>
            <div className={styles.inputGroup}>
                <label htmlFor="search" className={styles.label}>Tirth / Place Name</label>
                <input
                    type="text"
                    id="search"
                    placeholder="e.g. Ponnur Malai"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.input}
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
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
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
