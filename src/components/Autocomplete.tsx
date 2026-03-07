'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import styles from './Autocomplete.module.css';

interface AutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    placeholder?: string;
    id?: string;
}

export default function Autocomplete({
    value,
    onChange,
    suggestions,
    placeholder = 'Search...',
    id = 'autocomplete'
}: AutocompleteProps) {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input value
    useEffect(() => {
        if (value.trim().length > 0) {
            const filtered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions([]);
        }
    }, [value, suggestions]);

    // Handle clicks outside the component to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setShowSuggestions(true);
        setActiveSuggestionIndex(0);
    };

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && showSuggestions && filteredSuggestions[activeSuggestionIndex]) {
            handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className={styles.autocompleteContainer} ref={containerRef}>
            <input
                type="text"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => value.trim().length > 0 && setShowSuggestions(true)}
                className={styles.input}
                autoComplete="off"
            />
            {showSuggestions && value.trim().length > 0 && (
                <ul className={styles.suggestionsList}>
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((suggestion, index) => {
                            const isSelected = index === activeSuggestionIndex;
                            const lowerValue = value.toLowerCase();
                            const suggestionLower = suggestion.toLowerCase();
                            const matchIndex = suggestionLower.indexOf(lowerValue);

                            // Highlight the matching part
                            const before = suggestion.substring(0, matchIndex);
                            const match = suggestion.substring(matchIndex, matchIndex + value.length);
                            const after = suggestion.substring(matchIndex + value.length);

                            return (
                                <li
                                    key={index}
                                    className={`${styles.suggestionItem} ${isSelected ? styles.suggestionItemActive : ''}`}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    onMouseEnter={() => setActiveSuggestionIndex(index)}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <span>
                                        {before}<span className={styles.highlight}>{match}</span>{after}
                                    </span>
                                </li>
                            );
                        })
                    ) : (
                        <li className={styles.noSuggestions}>No matches found</li>
                    )}
                </ul>
            )}
        </div>
    );
}
