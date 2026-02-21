import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import itinerariesOriginal from '@/data/itineraries.json';
import WhatsAppShareButton from '@/components/WhatsAppShareButton';

// Type definition (same as Home page for now, could be shared)
interface Itinerary {
    id: string;
    title: string;
    duration: string;
    states: string[];
    author: string;
    authorInstagram?: string;
    description: string;
    days: {
        day: number;
        stops: {
            name: string;
            type: string;
            facilities: string[];
            description: string;
            mapsLink: string;
        }[];
    }[];
}

const itineraries: Itinerary[] = itinerariesOriginal as Itinerary[];

export async function generateStaticParams() {
    return itineraries.map((itinerary) => ({
        id: itinerary.id,
    }));
}

export default function ItineraryDetails({ params }: { params: { id: string } }) {
    const itinerary = itineraries.find((i) => i.id === params.id);

    if (!itinerary) {
        notFound();
    }

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

                <WhatsAppShareButton title={itinerary.title} />
            </div>

            <div className={styles.timeline}>
                {itinerary.days.map((day) => (
                    <div key={day.day} className={styles.dayBlock}>
                        <h2 className={styles.dayTitle}>Day {day.day}</h2>
                        <div className={styles.stopsList}>
                            {day.stops.map((stop, index) => (
                                <div key={index} className={styles.stopCard}>
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

                                    <p className={styles.stopDescription}>{stop.description}</p>

                                    {stop.mapsLink && (
                                        <a
                                            href={stop.mapsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.mapLink}
                                        >
                                            View on Maps ↗
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
