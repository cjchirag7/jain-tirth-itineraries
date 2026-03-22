'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import tirthsOriginal from '@/data/tirths.json';
import dharmshalasOriginal from '@/data/dharmshalas.json';

const allKnownPlaces = [
    ...tirthsOriginal.map(t => ({ ...t, source: 'tirth' })),
    ...dharmshalasOriginal.map(d => ({ ...d, source: 'dharmshala' }))
];

interface Stop {
    tirthId?: string;
    name: string;
    type: string;
    facilities: string[];
    description: string;
    mapsLink: string;
}

interface Day {
    day: number;
    stops: Stop[];
}

export default function SubmitItinerary() {
    const [formType, setFormType] = useState<'detailed' | 'quick'>('detailed');
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [states, setStates] = useState<string[]>([]);
    const [customState, setCustomState] = useState('');
    const [author, setAuthor] = useState('');
    const [authorInstagram, setAuthorInstagram] = useState('');
    const [description, setDescription] = useState('');
    const [days, setDays] = useState<Day[]>([{ day: 1, stops: [] }]);
    const [quickOutline, setQuickOutline] = useState('');
    
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [emailBodyData, setEmailBodyData] = useState('');
    const [copied, setCopied] = useState(false);

    const availableStates = [
        'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Rajasthan',
        'Gujarat', 'Madhya Pradesh', 'Kerala', 'Andhra Pradesh',
        'Uttar Pradesh', 'Bihar', 'Jharkhand'
    ];

    useEffect(() => {
        const savedData = localStorage.getItem('submitItineraryDraft');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.formType) setFormType(parsed.formType);
                if (parsed.title) setTitle(parsed.title);
                if (parsed.duration) setDuration(parsed.duration);
                if (parsed.states) setStates(parsed.states);
                if (parsed.author) setAuthor(parsed.author);
                if (parsed.authorInstagram) setAuthorInstagram(parsed.authorInstagram);
                if (parsed.description) setDescription(parsed.description);
                if (parsed.days) setDays(parsed.days);
                if (parsed.quickOutline) setQuickOutline(parsed.quickOutline);
            } catch (e) {
                console.error("Failed to load draft", e);
            }
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const dataToSave = {
                formType, title, duration, states, author, authorInstagram, description, days, quickOutline
            };
            localStorage.setItem('submitItineraryDraft', JSON.stringify(dataToSave));
        }, 1000);
        return () => clearTimeout(timer);
    }, [formType, title, duration, states, author, authorInstagram, description, days, quickOutline]);

    const clearDraft = () => {
        if (window.confirm('Are you sure you want to clear your saved progress?')) {
            localStorage.removeItem('submitItineraryDraft');
            setFormType('detailed');
            setTitle('');
            setDuration('');
            setStates([]);
            setAuthor('');
            setAuthorInstagram('');
            setDescription('');
            setDays([{ day: 1, stops: [] }]);
            setQuickOutline('');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(emailBodyData).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleStateToggle = (state: string) => {
        setStates(prev =>
            prev.includes(state)
                ? prev.filter(s => s !== state)
                : [...prev, state]
        );
    };

    const handleAddCustomState = () => {
        if (customState.trim() && !states.includes(customState.trim())) {
            setStates(prev => [...prev, customState.trim()]);
            setCustomState('');
        }
    };

    const handleRemoveState = (state: string) => {
        setStates(prev => prev.filter(s => s !== state));
    };

    const addDay = () => {
        setDays(prev => [...prev, { day: prev.length + 1, stops: [] }]);
    };

    const removeDay = (dayIndex: number) => {
        setDays(prev => prev.filter((_, i) => i !== dayIndex).map((d, i) => ({ ...d, day: i + 1 })));
    };

    const addStop = (dayIndex: number) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? { ...day, stops: [...day.stops, { name: '', type: 'Tirth', facilities: [], description: '', mapsLink: '', tirthId: '' }] }
                : day
        ));
    };

    const removeStop = (dayIndex: number, stopIndex: number) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? { ...day, stops: day.stops.filter((_, si) => si !== stopIndex) }
                : day
        ));
    };

    const updateStop = (dayIndex: number, stopIndex: number, field: keyof Stop, value: any) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? {
                    ...day,
                    stops: day.stops.map((stop, si) =>
                        si === stopIndex ? { ...stop, [field]: value } : stop
                    )
                }
                : day
        ));
    };

    const handleClearPlaceLink = (dayIndex: number, stopIndex: number) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? {
                    ...day,
                    stops: day.stops.map((stop, si) =>
                        si === stopIndex ? { ...stop, tirthId: '' } : stop
                    )
                }
                : day
        ));
    };

    const SearchableDropdown = ({ dayIndex, stopIndex, currentTirthId }: { dayIndex: number, stopIndex: number, currentTirthId: string }) => {
        const [query, setQuery] = useState('');
        const [isOpen, setIsOpen] = useState(false);
        const [activeIndex, setActiveIndex] = useState(-1);

        const filteredPlaces = query.trim() === ''
            ? []
            : allKnownPlaces.filter(place =>
                place.name.toLowerCase().includes(query.toLowerCase()) ||
                place.type.toLowerCase().includes(query.toLowerCase()) ||
                (place as any).state?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 8);

        const handleSelect = (place: any) => {
            handleSelectExistingPlace(dayIndex, stopIndex, place.id);
            setQuery('');
            setIsOpen(false);
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                setActiveIndex(prev => Math.min(prev + 1, filteredPlaces.length - 1));
            } else if (e.key === 'ArrowUp') {
                setActiveIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && activeIndex >= 0) {
                e.preventDefault();
                handleSelect(filteredPlaces[activeIndex]);
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        if (currentTirthId) {
            const place = allKnownPlaces.find(p => p.id === currentTirthId);
            const route = place?.type === 'Dharmshala' ? 'dharmshala' : 'tirth';
            return (
                <div className={styles.linkedBadge}>
                    <span>
                        🔗 Linked to: 
                        <a 
                            href={`/${route}/${place?.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={styles.linkedName}
                        >
                            <strong>{place?.name}</strong>
                        </a>
                        ({place?.type})
                    </span>
                    <button 
                        type="button" 
                        onClick={() => handleClearPlaceLink(dayIndex, stopIndex)}
                        className={styles.clearLinkBtn}
                        title="Clear link"
                    >
                        ×
                    </button>
                </div>
            );
        }

        return (
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.input}
                    placeholder="Search existing Tirth/Dharmshala (e.g. Arihantagiri)"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setActiveIndex(-1);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onKeyDown={handleKeyDown}
                />
                {isOpen && query.trim() !== '' && (
                    <div className={styles.searchResults}>
                        {filteredPlaces.length > 0 ? (
                            filteredPlaces.map((place, idx) => (
                                <div
                                    key={place.id}
                                    className={`${styles.searchResultItem} ${idx === activeIndex ? styles.searchResultItemActive : ''}`}
                                    onClick={() => handleSelect(place)}
                                >
                                    <span className={styles.resultName}>{place.name}</span>
                                    <span className={styles.resultMeta}>{place.type} • {(place as any).state}</span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>No matching places found. Continue typing or fill manually.</div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleSelectExistingPlace = (dayIndex: number, stopIndex: number, placeId: string) => {
        const place = allKnownPlaces.find(p => p.id === placeId);
        if (place) {
            setDays(prev => prev.map((day, i) =>
                i === dayIndex
                    ? {
                        ...day,
                        stops: day.stops.map((stop, si) =>
                            si === stopIndex ? { 
                                ...stop, 
                                tirthId: place.id, 
                                name: place.name, 
                                type: place.type,
                                facilities: place.facilities || [],
                                description: (place as any).introText || '',
                                mapsLink: place.location?.mapsLink || ''
                            } : stop
                        )
                    }
                    : day
            ));
        }
    };

    const toggleFacility = (dayIndex: number, stopIndex: number, facility: string) => {
        setDays(prev => prev.map((day, i) =>
            i === dayIndex
                ? {
                    ...day,
                    stops: day.stops.map((stop, si) =>
                        si === stopIndex
                            ? {
                                ...stop,
                                facilities: stop.facilities.includes(facility)
                                    ? stop.facilities.filter(f => f !== facility)
                                    : [...stop.facilities, facility]
                            }
                            : stop
                    )
                }
                : day
        ));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        let emailBody = '';

        if (formType === 'detailed') {
            const stopNames = days.flatMap(d => d.stops.map(s => s.name));
            const keywords = Array.from(new Set([
                ...states,
                ...stopNames.slice(0, 10),
                'Jain Tirth',
                'Itinerary'
            ])).filter(Boolean);

            const itineraryData = {
                id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                title,
                duration: `${duration} ${parseInt(duration) === 1 ? 'Day' : 'Days'}`,
                states,
                author,
                ...(authorInstagram && { authorInstagram }),
                description,
                days,
                keywords
            };

            const jsonString = JSON.stringify(itineraryData, null, 2);

            emailBody = `Jai Jinendra! 🙏

New Detailed Itinerary Submission for Jain Routes.

Title: ${title}
Duration: ${duration} ${parseInt(duration) === 1 ? 'Day' : 'Days'}
States: ${states.join(', ')}
Author: ${author}
Instagram: ${authorInstagram || 'Not provided'}
Description: ${description}

Number of Days: ${days.length}
Number of Stops: ${days.reduce((acc, d) => acc + d.stops.length, 0)}

--- JSON DATA FOR ITINERARIES.JSON ---

${jsonString}

--- END JSON ---`;
        } else {
            emailBody = `Jai Jinendra! 🙏

New Quick Outline Submission for Jain Routes.

Title: ${title}
Author: ${author}
Instagram: ${authorInstagram || 'Not provided'}

--- QUICK OUTLINE DETAILS ---

${quickOutline}

--- END OUTLINE ---`;
        }

        setEmailBodyData(emailBody);

        const mailtoLink = `mailto:routesjain@gmail.com?subject=${encodeURIComponent(`New Itinerary: ${title}`)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;

        setSubmitted(true);
        setSubmitting(false);

        // Clear local storage on successful generation
        localStorage.removeItem('submitItineraryDraft');
    };

    const resetForm = () => {
        setFormType('detailed');
        setTitle('');
        setDuration('');
        setStates([]);
        setAuthor('');
        setAuthorInstagram('');
        setDescription('');
        setDays([{ day: 1, stops: [] }]);
        setQuickOutline('');
        setSubmitted(false);
    };

    return (
        <div className="container">
            <div className={styles.wrapper}>
                <div className={styles.headerActions}>
                    <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>
                </div>

                <div className={styles.header}>
                    <h1 className={styles.title}>Submit Your Itinerary</h1>
                    <p className={styles.subtitle}>
                        Share your Tirth Yatra experience with the community. Fill in the complete details below.
                    </p>
                </div>

                <div className={styles.motivationGrid}>
                    <div className={styles.motivationCard}>
                        <h3><span>🙏</span> Sadharmi Seva</h3>
                        <p>Help fellow Jain Yatris plan their spiritual journeys with ease and safety.</p>
                    </div>
                    <div className={styles.motivationCard}>
                        <h3><span>✨</span> Earn Punya</h3>
                        <p>Sharing knowledge that helps others visit Tirths is a great form of service.</p>
                    </div>
                    <div className={styles.motivationCard}>
                        <h3><span>🏆</span> Get Recognized</h3>
                        <p>Your name and Instagram will be featured on the route you share.</p>
                    </div>
                </div>

                {submitted ? (
                    <div className={styles.successMessage}>
                        <div className={styles.emailIcon}>✉️</div>
                        <h2>Email Client Opening...</h2>
                        <p className={styles.instructionText}>
                            Your email client should open with the itinerary data pre-filled.
                            <br />
                            <strong>Please review and click "Send" in your email to complete the submission.</strong>
                        </p>
                        
                        <div style={{ textAlign: 'left', marginTop: '2.5rem', marginBottom: '2.5rem', background: '#fff', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                            <h3 style={{ marginTop: 0, color: 'var(--secondary)' }}>Email didn't open?</h3>
                            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                Sometimes browser popups fail. You can manually email the details below to <a href="mailto:routesjain@gmail.com" style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'none'}}>routesjain@gmail.com</a>.
                            </p>
                            
                            <textarea 
                                readOnly 
                                value={emailBodyData} 
                                className={styles.fallbackTextArea}
                                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                            />
                            
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={handleCopy} className={`btn ${copied ? 'btn-outline' : 'btn-primary'}`}>
                                    {copied ? '✓ Copied to Clipboard!' : 'Copy Details to Clipboard'}
                                </button>
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            <button onClick={resetForm} className="btn btn-outline">
                                Submit Another Itinerary
                            </button>
                            <Link href="/" className="btn btn-outline">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.typeSelector}>
                            <button 
                                type="button" 
                                className={`${styles.typeButton} ${formType === 'detailed' ? styles.activeType : ''}`}
                                onClick={() => setFormType('detailed')}
                            >
                                Detailed Form (Preferred)
                            </button>
                            <button 
                                type="button" 
                                className={`${styles.typeButton} ${formType === 'quick' ? styles.activeType : ''}`}
                                onClick={() => setFormType('quick')}
                            >
                                Quick Outline (Free-form)
                            </button>
                        </div>

                        {formType === 'quick' && (
                            <div className={styles.noticeBox}>
                                <p><strong>Note:</strong> Submitting the detailed form helps us publish your itinerary quickly. Quick outlines are processed manually by our team taking longer, but they require less effort to submit. Just describe the places visited, duration, and any helpful tips.</p>
                            </div>
                        )}

                        <div className={styles.draftActions}>
                            <button type="button" onClick={clearDraft} className={styles.clearDraftBtn}>
                                🗑️ Clear Draft
                            </button>
                        </div>

                        {/* Basic Info */}
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Basic Information</h2>

                            <div className={styles.formGroup}>
                                <label htmlFor="title" className={styles.label}>
                                    Itinerary Title <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., 2 Day Northern Tamil Nadu Tirths"
                                    className={styles.input}
                                    required
                                />
                            </div>
                            
                            <div className={styles.formRow}>
                                {formType === 'detailed' && (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="duration" className={styles.label}>
                                            Duration (Days) <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="duration"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="e.g., 2"
                                            className={styles.input}
                                            min="1"
                                            required
                                        />
                                    </div>
                                )}
                                
                                <div className={styles.formGroup}>
                                    <label htmlFor="author" className={styles.label}>
                                        Your Name <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="author"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="e.g., Community Member"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="authorInstagram" className={styles.label}>
                                    Instagram Profile (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="authorInstagram"
                                    value={authorInstagram}
                                    onChange={(e) => setAuthorInstagram(e.target.value)}
                                    placeholder="https://instagram.com/yourusername"
                                    className={styles.input}
                                />
                            </div>

                            {formType === 'detailed' && (
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        States Covered <span className={styles.required}>*</span>
                                    </label>
                                    <div className={styles.stateGrid}>
                                        {availableStates.map((state) => (
                                            <label key={state} className={styles.checkbox}>
                                                <input
                                                    type="checkbox"
                                                    checked={states.includes(state)}
                                                    onChange={() => handleStateToggle(state)}
                                                />
                                                <span>{state}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <div className={styles.customStateInput}>
                                        <input
                                            type="text"
                                            value={customState}
                                            onChange={(e) => setCustomState(e.target.value)}
                                            placeholder="Add other state..."
                                            className={styles.input}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomState())}
                                        />
                                        <button type="button" onClick={handleAddCustomState} className="btn btn-outline">
                                            Add State
                                        </button>
                                    </div>

                                    {states.length > 0 && (
                                        <div className={styles.selectedStates}>
                                            <strong>Selected:</strong>
                                            {states.map(state => (
                                                <span key={state} className={styles.selectedStateBadge}>
                                                    {state}
                                                    <button type="button" onClick={() => handleRemoveState(state)}>×</button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {formType === 'detailed' && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="description" className={styles.label}>
                                        Description <span className={styles.required}>*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Brief description of the itinerary, key highlights..."
                                        className={styles.textarea}
                                        rows={3}
                                        required
                                    />
                                </div>
                            )}

                            {formType === 'quick' && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="quickOutline" className={styles.label}>
                                        Free-form Itinerary Details <span className={styles.required}>*</span>
                                    </label>
                                    <textarea
                                        id="quickOutline"
                                        value={quickOutline}
                                        onChange={(e) => setQuickOutline(e.target.value)}
                                        placeholder="Describe your journey! Mention the Tirths visited, travel details, helpful tips, etc. Don't worry about formatting perfectly."
                                        className={styles.textarea}
                                        style={{ minHeight: '150px' }}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        {/* Day-by-Day Itinerary for Detailed form mode */}
                        {formType === 'detailed' && (
                            <div className={styles.section}>
                                <div className={styles.sectionHeader}>
                                    <h2 className={styles.sectionTitle}>Day-by-Day Itinerary</h2>
                                    <button type="button" onClick={addDay} className="btn btn-outline">
                                        + Add Day
                                    </button>
                                </div>

                                {days.map((day, dayIndex) => (
                                    <div key={dayIndex} className={styles.dayCard}>
                                        <div className={styles.dayHeader}>
                                            <h3>Day {day.day}</h3>
                                            {days.length > 1 && (
                                                <button type="button" onClick={() => removeDay(dayIndex)} className={styles.removeBtn}>
                                                    Remove Day
                                                </button>
                                            )}
                                        </div>

                                        {day.stops.map((stop, stopIndex) => (
                                            <div key={stopIndex} className={styles.stopCard}>
                                                <div className={styles.stopHeader}>
                                                    <span className={styles.stopNumber}>Stop {stopIndex + 1}</span>
                                                    <button type="button" onClick={() => removeStop(dayIndex, stopIndex)} className={styles.removeBtn}>
                                                        Remove
                                                    </button>
                                                </div>

                                                <div className={styles.formRow}>
                                                    <div className={styles.formGroup}>
                                                        <label className={styles.label}>Link Existing Place (Optional)</label>
                                                        <SearchableDropdown 
                                                            dayIndex={dayIndex} 
                                                            stopIndex={stopIndex} 
                                                            currentTirthId={stop.tirthId || ''} 
                                                        />
                                                        {!stop.tirthId && <small className={styles.helpText}>Link to a place in our database to auto-fill details.</small>}
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label className={styles.label}>Place Name *</label>
                                                        <input
                                                            type="text"
                                                            value={stop.name}
                                                            onChange={(e) => updateStop(dayIndex, stopIndex, 'name', e.target.value)}
                                                            placeholder="e.g., Shree Kshetra Arihantagiri"
                                                            className={styles.input}
                                                            required
                                                        />
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label className={styles.label}>Type *</label>
                                                        <select
                                                            value={stop.type}
                                                            onChange={(e) => updateStop(dayIndex, stopIndex, 'type', e.target.value)}
                                                            className={styles.select}
                                                            required
                                                            disabled={!!stop.tirthId}
                                                        >
                                                            <option value="Tirth">Tirth</option>
                                                            <option value="Temple">Temple</option>
                                                            <option value="Dharmshala">Dharmshala</option>
                                                            <option value="Tourist-Attraction">Tourist-Attraction</option>
                                                            <option value="Travel">Travel</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Facilities</label>
                                                    <div className={styles.facilitiesRow}>
                                                        <label className={styles.checkbox}>
                                                            <input
                                                                type="checkbox"
                                                                checked={stop.facilities.includes('Dharmshala')}
                                                                onChange={() => toggleFacility(dayIndex, stopIndex, 'Dharmshala')}
                                                            />
                                                            <span>Dharmshala</span>
                                                        </label>
                                                        <label className={styles.checkbox}>
                                                            <input
                                                                type="checkbox"
                                                                checked={stop.facilities.includes('Bhojanshala')}
                                                                onChange={() => toggleFacility(dayIndex, stopIndex, 'Bhojanshala')}
                                                            />
                                                            <span>Bhojanshala</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Description</label>
                                                    <textarea
                                                        value={stop.description}
                                                        onChange={(e) => updateStop(dayIndex, stopIndex, 'description', e.target.value)}
                                                        placeholder="Distance, special notes..."
                                                        className={styles.textarea}
                                                        rows={2}
                                                    />
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>Google Maps Link {stop.tirthId ? '' : '*'}</label>
                                                    <input
                                                        type="url"
                                                        value={stop.mapsLink}
                                                        onChange={(e) => updateStop(dayIndex, stopIndex, 'mapsLink', e.target.value)}
                                                        placeholder="https://maps.app.goo.gl/..."
                                                        className={styles.input}
                                                        required={!stop.tirthId}
                                                        readOnly={!!stop.tirthId}
                                                    />
                                                    <small className={styles.helpText}>Essential for automatic coordinate generation.</small>
                                                </div>
                                            </div>
                                        ))}

                                        <button type="button" onClick={() => addStop(dayIndex)} className={styles.addStopBtn}>
                                            + Add Stop to Day {day.day}
                                        </button>
                                    </div>
                                ))}

                                {days.length > 0 && (
                                    <button type="button" onClick={addDay} className={styles.addDayBottomBtn}>
                                        + Add Another Day
                                    </button>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={(formType === 'detailed' && states.length === 0) || submitting}
                        >
                            {submitting ? 'Opening Email...' : 'Generate Email to Submit'}
                        </button>

                        <div className={styles.previewMessage}>
                            <p>✨ After submission, your itinerary will be verified and published with your name and social link!</p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
