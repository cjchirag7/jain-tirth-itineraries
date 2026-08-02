'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import WhatsAppShareButton from '@/components/WhatsAppShareButton';
import MapEmbed from '@/components/MapEmbed';

interface Itinerary {
    id: string;
    title: string;
    duration: string;
    states: string[];
    author: string;
    authorInstagram?: string;
    description: string;
    startingCity?: string;
    endingCity?: string;
    keywords?: string[];
    days: {
        day: number;
        stops: {
            tirthId?: string;
            tirth?: any;
            name: string;
            type: string;
            facilities: string[];
            description: string;
            mapsLink: string;
            lat?: number;
            lng?: number;
        }[];
    }[];
}

interface ItineraryClientProps {
    itinerary: Itinerary;
}

export default function ItineraryClient({ itinerary }: ItineraryClientProps) {
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [expandedContacts, setExpandedContacts] = useState<Record<string, boolean>>({});

    const toggleContacts = (stopId: string) => {
        setExpandedContacts(prev => ({
            ...prev,
            [stopId]: !prev[stopId]
        }));
    };

    useEffect(() => {
        const savedStart = localStorage.getItem('userStartingLocation');
        const savedEnd = localStorage.getItem('userEndingLocation');
        const hasSeenHint = localStorage.getItem('hasSeenLocationHint');
        
        if (savedStart) {
            setStartLocation(savedStart);
        } else if (itinerary.startingCity) {
            setStartLocation(itinerary.startingCity);
        }

        if (savedEnd) {
            setEndLocation(savedEnd);
        } else if (itinerary.endingCity || itinerary.startingCity) {
            setEndLocation(itinerary.endingCity || itinerary.startingCity || 'Bangalore, Karnataka, India');
        }

        if (!hasSeenHint) {
            setShowHint(true);
        }

        // Expand all accordions before printing
        const handleBeforePrint = () => {
            const newExpanded: Record<string, boolean> = {};
            itinerary.days.forEach((day, dayIndex) => {
                day.stops.forEach((stop, index) => {
                    if (stop.tirth && stop.tirth.contacts && stop.tirth.contacts.length > 0) {
                        newExpanded[`${dayIndex}-${index}`] = true;
                    }
                });
            });
            setExpandedContacts(newExpanded);
        };

        window.addEventListener('beforeprint', handleBeforePrint);
        return () => window.removeEventListener('beforeprint', handleBeforePrint);
    }, [itinerary]);

    const dismissHint = () => {
        setShowHint(false);
        localStorage.setItem('hasSeenLocationHint', 'true');
    };

    const handleStartLocationChange = (val: string) => {
        setStartLocation(val);
        localStorage.setItem('userStartingLocation', val);
    };

    const handleEndLocationChange = (val: string) => {
        setEndLocation(val);
        localStorage.setItem('userEndingLocation', val);
    };

    const handleUseMyLocationForStart = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleStartLocationChange(`${latitude},${longitude}`);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please check your browser permissions.');
            }
        );
    };

    const handleUseMyLocationForEnd = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleEndLocationChange(`${latitude},${longitude}`);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please check your browser permissions.');
            }
        );
    };

    return (
        <div className="container">
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>&larr; Back to Itineraries</Link>
                <div className={styles.categoryBadges}>
                    {itinerary.states.map((state) => (
                        <span key={state} className={styles.categoryBadge}>{state}</span>
                    ))}
                </div>
                <h1 className={styles.title}>{itinerary.title}</h1>
                <div className={styles.meta}>
                    <span>⏱ {itinerary.duration}</span>
                    <span>
                        👤 Shared by {itinerary.author}
                        {itinerary.authorInstagram && (
                            <a
                                href={itinerary.authorInstagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.instagramLink}
                                aria-label="Author's Instagram"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                        )}
                    </span>
                </div>
                <p className={styles.description}>{itinerary.description}</p>

                <div className={styles.actionButtons}>
                    <WhatsAppShareButton title={itinerary.title} />
                    <button 
                        onClick={async (e) => {
                            const btn = e.currentTarget;
                            const originalHTML = btn.innerHTML;
                            btn.innerHTML = '⏳ Preparing Maps...';
                            
                            const iframes = document.querySelectorAll('iframe');
                            
                            // Programmatically scroll to each iframe to trigger lazy loading and rendering
                            for (let i = 0; i < iframes.length; i++) {
                                iframes[i].scrollIntoView({ block: 'center' });
                                // Wait 1.5s for each map to fully load and render
                                await new Promise(resolve => setTimeout(resolve, 1500));
                            }
                            
                            // Scroll back to the top of the page
                            window.scrollTo(0, 0);
                            
                            // Small buffer before opening print dialog
                            setTimeout(() => {
                                window.print();
                                btn.innerHTML = originalHTML;
                            }, 500);
                        }}
                        className={styles.printBtn}
                        aria-label="Print or Save as PDF"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        Save as PDF / Print
                    </button>
                </div>

                {/* Interactive At-a-Glance Summary Matrix */}
                {(() => {
                    let totalStops = 0;
                    let totalTirths = 0;

                    itinerary.days.forEach((day) => {
                        totalStops += day.stops.length;
                        day.stops.forEach((stop) => {
                            if (stop.type === 'Tirth' || stop.type === 'Temple') {
                                totalTirths += 1;
                            }
                        });
                    });

                    return (
                        <div className={styles.summaryMatrixCard}>
                            <div className={styles.summaryMatrixHeader}>
                                <h3>📋 Itinerary Overview at a Glance</h3>
                                <div className={styles.summaryStats}>
                                    <span className={styles.statBadge}>⏱ {itinerary.duration}</span>
                                    <span className={styles.statBadge}>📍 {totalStops} Total Stops</span>
                                    <span className={styles.statBadge}>🛕 {totalTirths} Tirths</span>
                                </div>
                            </div>
                            
                            <div className={styles.summaryTableWrapper}>
                                <table className={styles.summaryTable}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '90px' }}>Day</th>
                                            <th>Places Covered (Click to Jump)</th>
                                            <th style={{ width: '180px' }}>Night Stay / End Stop</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itinerary.days.map((day, dayIndex) => {
                                            const lastStop = day.stops[day.stops.length - 1];
                                            const dharmshalaStop = lastStop && (lastStop.type === 'Dharmshala' || lastStop.facilities?.includes('Dharmshala')) ? lastStop : null;
                                            const isLastDay = dayIndex === itinerary.days.length - 1;

                                            return (
                                                <tr key={day.day}>
                                                    <td className={styles.dayCell}>
                                                        <strong>Day {day.day}</strong>
                                                        <span className={styles.stopCountText}>{day.stops.length} stops</span>
                                                    </td>
                                                    <td>
                                                        <div className={styles.chipsContainer}>
                                                            {day.stops.map((stop, stopIndex) => (
                                                                <button
                                                                    key={stopIndex}
                                                                    className={styles.stopChip}
                                                                    onClick={() => {
                                                                        const el = document.getElementById(`stop-${dayIndex}-${stopIndex}`);
                                                                        if (el) {
                                                                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                        }
                                                                    }}
                                                                    title={`Click to jump to ${stop.name}`}
                                                                >
                                                                    <span className={styles.chipNum}>{stopIndex + 1}</span>
                                                                    <span className={styles.chipName}>{stop.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className={styles.stayCell}>
                                                        {isLastDay && lastStop ? (
                                                            <div className={styles.endStopBadge} title="End of Journey / Final Stop">
                                                                <span>🏁 {lastStop.name}</span>
                                                            </div>
                                                        ) : dharmshalaStop ? (
                                                            <div className={styles.stayBadge} title="Night Stay Dharmshala Available">
                                                                <span>🏨 {dharmshalaStop.name}</span>
                                                            </div>
                                                        ) : lastStop ? (
                                                            <div className={styles.endStopBadge} title="End of Day / Final Stop">
                                                                <span>📍 {lastStop.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className={styles.mutedText}>—</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })()}

                <div className={styles.travelContext}>
                    <div className={styles.locationsRow}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="startLocation">📍 My Starting Location</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    id="startLocation"
                                    value={startLocation}
                                    onChange={(e) => handleStartLocationChange(e.target.value)}
                                    placeholder="e.g. Bangalore"
                                    className={styles.input}
                                />
                                <div className={styles.inputActions}>
                                    {!startLocation && (
                                        <button
                                            onClick={handleUseMyLocationForStart}
                                            className={styles.locationBtn}
                                            title="Use my current location"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="3"></circle>
                                                <path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>
                                            </svg>
                                        </button>
                                    )}
                                    {startLocation && (
                                        <button
                                            onClick={() => handleStartLocationChange('')}
                                            className={styles.clearBtn}
                                            title="Clear location"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                            <small>Directions for the first stop will start from here.</small>
                            {showHint && (
                                <div className={styles.locationHint}>
                                    💡 <strong>Hint:</strong> You can change your start & end cities here or click the GPS icon to use your current location.
                                    <button onClick={dismissHint} className={styles.dismissHintBtn}>Got it</button>
                                </div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="endLocation">🏁 My Ending Location</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    id="endLocation"
                                    value={endLocation}
                                    onChange={(e) => handleEndLocationChange(e.target.value)}
                                    placeholder="e.g. Bangalore"
                                    className={styles.input}
                                />
                                <div className={styles.inputActions}>
                                    {!endLocation && (
                                        <button
                                            onClick={handleUseMyLocationForEnd}
                                            className={styles.locationBtn}
                                            title="Use my current location"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="3"></circle>
                                                <path d="M12 2v3m0 14v3M2 12h3m14 0h3"></path>
                                            </svg>
                                        </button>
                                    )}
                                    {endLocation && (
                                        <button
                                            onClick={() => handleEndLocationChange('')}
                                            className={styles.clearBtn}
                                            title="Clear location"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                            <small>Return directions from the final stop will end here.</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.timeline}>
                {itinerary.days.map((day, dayIndex) => {
                    const prevDayStops = dayIndex > 0 ? itinerary.days[dayIndex - 1].stops : [];
                    const lastStop = prevDayStops.length > 0 ? prevDayStops[prevDayStops.length - 1] : undefined;
                    const previousDayLastStop = lastStop ? { name: lastStop.name, lat: lastStop.lat, lng: lastStop.lng } : undefined;

                    return (
                        <div key={day.day} className={styles.dayBlock}>
                            <h2 className={styles.dayTitle}>Day {day.day}</h2>
                            <MapEmbed
                                day={day.day}
                                stops={day.stops}
                                states={itinerary.states}
                                previousDayLastStop={previousDayLastStop}
                                startLocation={dayIndex === 0 ? startLocation : undefined}
                                endLocation={dayIndex === itinerary.days.length - 1 ? endLocation : undefined}
                            />
                            <div className={styles.stopsList}>
                                {day.stops.map((stop, index) => {
                                    // Determine origin for directions
                                    let origin = '';
                                    if (dayIndex === 0 && index === 0) {
                                        origin = startLocation || 'My+Location';
                                    } else if (index === 0 && previousDayLastStop) {
                                        origin = previousDayLastStop.lat && previousDayLastStop.lng 
                                            ? `${previousDayLastStop.lat},${previousDayLastStop.lng}`
                                            : `${previousDayLastStop.name}, ${itinerary.states[0]}`;
                                    } else {
                                        const prevStop = day.stops[index - 1];
                                        origin = prevStop.lat && prevStop.lng
                                            ? `${prevStop.lat},${prevStop.lng}`
                                            : `${prevStop.name}, ${itinerary.states[0]}`;
                                    }

                                    const dest = stop.lat && stop.lng
                                        ? `${stop.lat},${stop.lng}`
                                        : `${stop.name}, ${itinerary.states[0]}`;
                                    
                                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}`;

                                    return (
                                        <div key={index} id={`stop-${dayIndex}-${index}`} className={styles.stopCard}>
                                            <div className={styles.stopHeader}>
                                                <h3 className={styles.stopName}>
                                                    {index + 1}. {stop.name}
                                                </h3>
                                                <span className={styles.stopType}>{stop.type}</span>
                                            </div>

                                            {stop.facilities.length > 0 && (
                                                <div className={styles.facilities}>
                                                    {stop.facilities.map((fac) => (
                                                        <span key={fac} className={styles.facilityTag}>
                                                            {fac === 'Bhojanshala' ? '🍽️' : '🏨'} {fac}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <p className={styles.stopDescription}>{stop.description || stop.tirth?.introText}</p>

                                            {stop.tirth && stop.tirth.contacts && stop.tirth.contacts.length > 0 && (
                                                <div className={styles.contactsAccordion}>
                                                    <button 
                                                        className={styles.accordionToggle} 
                                                        onClick={() => toggleContacts(`${dayIndex}-${index}`)}
                                                    >
                                                        <span>📞 Contact Information</span>
                                                        <span className={styles.chevron}>
                                                            {expandedContacts[`${dayIndex}-${index}`] ? '▲' : '▼'}
                                                        </span>
                                                    </button>
                                                    
                                                    {expandedContacts[`${dayIndex}-${index}`] && (
                                                        <div className={styles.contactsContent}>
                                                            <div className={styles.contactsList}>
                                                                {stop.tirth.contacts.map((contact: any, i: number) => (
                                                                    <div key={i} className={styles.contactItem}>
                                                                        <span className={styles.contactType}>{contact.type} ({contact.name})</span>
                                                                        <a href={`tel:${contact.number}`} className={styles.contactNumber}>{contact.number}</a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className={styles.contactFooter}>
                                                                <span className={styles.verifiedBadge}>✓ verified</span>
                                                                <a 
                                                                    href={`https://docs.google.com/forms/d/e/1FAIpQLSfIfYSg3E1d1XI8lDNYkxVZAu_d3w0OJmFE4ea0cfKezoAhNg/viewform?usp=pp_url&entry.900429225=${encodeURIComponent(stop.name)}&entry.340669516=${encodeURIComponent(stop.tirth.id)}&entry.837366253=${encodeURIComponent(stop.type)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={styles.suggestEdit}
                                                                >
                                                                    Suggest Edit
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className={styles.stopActions}>
                                                <a
                                                    href={directionsUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.mapLink}
                                                >
                                                    Get Directions ↗
                                                </a>
                                                {dayIndex === itinerary.days.length - 1 && index === day.stops.length - 1 && (
                                                    <a
                                                        href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(dest)}&destination=${encodeURIComponent(endLocation || 'My+Location')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.returnLink}
                                                    >
                                                        Return Directions ↗
                                                    </a>
                                                )}
                                                {stop.type === 'Dharmshala' && stop.tirth ? (
                                                    <Link 
                                                        href={`/dharmshala/${stop.tirth.id}`}
                                                        className={styles.viewLink}
                                                    >
                                                        View Dharmshala
                                                    </Link>
                                                ) : (['Tirth', 'Temple'].includes(stop.type) && stop.tirth) ? (
                                                    <Link 
                                                        href={`/tirth/${stop.tirth.id}`}
                                                        className={styles.viewLink}
                                                    >
                                                        View Place
                                                    </Link>
                                                ) : (
                                                    <a
                                                        href={stop.mapsLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.viewLink}
                                                    >
                                                        View on Map ↗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
