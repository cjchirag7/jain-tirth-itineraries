'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Stop {
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
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [states, setStates] = useState<string[]>([]);
    const [customState, setCustomState] = useState('');
    const [author, setAuthor] = useState('');
    const [authorInstagram, setAuthorInstagram] = useState('');
    const [description, setDescription] = useState('');
    const [days, setDays] = useState<Day[]>([{ day: 1, stops: [] }]);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const availableStates = [
        'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Rajasthan',
        'Gujarat', 'Madhya Pradesh', 'Kerala', 'Andhra Pradesh'
    ];

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
                ? { ...day, stops: [...day.stops, { name: '', type: 'Tirth', facilities: [], description: '', mapsLink: '' }] }
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

        const itineraryData = {
            id: Date.now().toString(),
            title,
            duration: `${duration} ${parseInt(duration) === 1 ? 'Day' : 'Days'}`,
            states,
            author,
            ...(authorInstagram && { authorInstagram }),
            description,
            days
        };

        // Format JSON nicely
        const jsonString = JSON.stringify(itineraryData, null, 2);

        // Create email body
        const emailBody = `New Itinerary Submission

Title: ${title}
Duration: ${duration} ${parseInt(duration) === 1 ? 'Day' : 'Days'}
States: ${states.join(', ')}
Author: ${author}${authorInstagram ? `\nInstagram: ${authorInstagram}` : ''}
Description: ${description}

Number of Days: ${days.length}

---

Complete JSON Data (copy and paste this into itineraries.json):

${jsonString}`;

        // Create mailto link
        const mailtoLink = `mailto:cjchirag7+itineraries@gmail.com?subject=${encodeURIComponent(`New Itinerary: ${title}`)}&body=${encodeURIComponent(emailBody)}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        setSubmitted(true);
        setSubmitting(false);
    };

    const resetForm = () => {
        setTitle('');
        setDuration('');
        setStates([]);
        setAuthor('');
        setAuthorInstagram('');
        setDescription('');
        setDays([{ day: 1, stops: [] }]);
        setSubmitted(false);
    };

    return (
        <div className="container">
            <div className={styles.wrapper}>
                <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>

                <div className={styles.header}>
                    <h1 className={styles.title}>Submit Your Itinerary</h1>
                    <p className={styles.subtitle}>
                        Share your Tirth Yatra experience with the community. Fill in the complete details below.
                    </p>
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
                        <div className={styles.actionButtons}>
                            <button onClick={resetForm} className="btn btn-primary">
                                Submit Another Itinerary
                            </button>
                            <Link href="/" className="btn btn-outline">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
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
                        </div>

                        {/* Day-by-Day Itinerary */}
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
                                                    >
                                                        <option value="Tirth">Tirth</option>
                                                        <option value="Temple">Temple</option>
                                                        <option value="Cave/Hill">Cave/Hill</option>
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
                                                <label className={styles.label}>Google Maps Link</label>
                                                <input
                                                    type="url"
                                                    value={stop.mapsLink}
                                                    onChange={(e) => updateStop(dayIndex, stopIndex, 'mapsLink', e.target.value)}
                                                    placeholder="https://maps.app.goo.gl/..."
                                                    className={styles.input}
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    <button type="button" onClick={() => addStop(dayIndex)} className={styles.addStopBtn}>
                                        + Add Stop to Day {day.day}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={states.length === 0 || submitting}
                        >
                            {submitting ? 'Opening Email...' : 'Generate Email to Submit'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
