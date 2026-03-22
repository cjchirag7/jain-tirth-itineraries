import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import dharmshalasOriginal from '@/data/dharmshalas.json';
import itinerariesOriginal from '@/data/itineraries.json';
import WhatsAppShareButton from '@/components/WhatsAppShareButton';

// Types
interface TirthContact {
    type: string;
    name: string;
    number: string;
    notes?: string;
}

interface Dharmshala {
    id: string;
    name: string;
    introText: string;
    description: string;
    location: { mapsLink: string; lat: number | null; lng: number | null };
    howToReach: { nearestRailway: string; nearestBusStand: string; nearestAirport: string };
    facilities: string[];
    contacts: TirthContact[];
    lastVerified: string;
}

const dharmshalas: Dharmshala[] = dharmshalasOriginal as Dharmshala[];

export async function generateStaticParams() {
    return dharmshalas.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const dharmshala = dharmshalas.find((d) => d.id === params.id);
    if (!dharmshala) return { title: 'Dharmshala Not Found | Jain Routes' };

    return {
        title: `${dharmshala.name} | Jain Routes`,
        description: dharmshala.introText || `View contacts and details for ${dharmshala.name}.`,
    };
}

export default function DharmshalaPage({ params }: { params: { id: string } }) {
    const dharmshala = dharmshalas.find((d) => d.id === params.id);

    if (!dharmshala) {
        notFound();
    }

    // Find itineraries that include this dharmshala
    const relatedItineraries = itinerariesOriginal.filter(itin => 
        itin.days.some(day => 
            day.stops.some((stop: any) => stop.tirthId === dharmshala.id) // Note: tirthId is still used in itineraries for referencing both Tirths and Dharmshalas
        )
    );

    return (
        <div className="container">
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>
                <div className={styles.categoryBadges}>
                    {(dharmshala as any).state && <span className={styles.categoryBadge}>{(dharmshala as any).state}</span>}
                    <span className={styles.categoryBadge}>🏨 Dharmshala</span>
                    <span className={`${styles.categoryBadge} ${!dharmshala.facilities.includes('Bhojanshala') ? styles.badgeDisabled : ''}`}>
                        {dharmshala.facilities.includes('Bhojanshala') ? '🍽️ Bhojanshala' : '❌ No Bhojanshala'}
                    </span>
                </div>
                <h1 className={styles.title}>{dharmshala.name}</h1>
                <p className={styles.description}>{dharmshala.introText || `A place of stay and rest located in ${(dharmshala as any).state}.`}</p>
                <div className={styles.shareSection}>
                    <WhatsAppShareButton title={dharmshala.name} />
                </div>
            </div>

            <div className={styles.contentGrid}>
                {/* Main Content Column */}
                <div className={styles.mainContent}>
                    {dharmshala.description && (
                        <section className={styles.card}>
                            <h2>📜 About </h2>
                            <p>{dharmshala.description}</p>
                        </section>
                    )}

                    <section className={styles.card}>
                        <h2>📞 Contact Directory</h2>
                        {dharmshala.contacts && dharmshala.contacts.length > 0 ? (
                            <div className={styles.contactList}>
                                {dharmshala.contacts.map((c: any, i) => {
                                    const isString = typeof c === 'string';
                                    const contactType = isString ? 'Office' : c.type;
                                    const contactName = isString ? 'Contact' : c.name;
                                    const contactNumber = isString ? c : c.number;
                                    const contactNotes = isString ? null : c.notes;

                                    return (
                                        <div key={i} className={styles.contactItem}>
                                            <div className={styles.contactInfo}>
                                                <span className={styles.contactType}>{contactType}</span>
                                                <span className={styles.contactName}>{contactName}</span>
                                                {contactNotes && <span className={styles.contactNotes}>({contactNotes})</span>}
                                            </div>
                                            <a href={`tel:${contactNumber}`} className={styles.contactButton}>
                                                {contactNumber}
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className={styles.emptyState}>No contact numbers verified yet. Help the community by suggesting an edit below.</p>
                        )}
                        <div className={styles.suggestEditWrapper}>
                            <a 
                                href={`https://docs.google.com/forms/d/e/1FAIpQLSfIfYSg3E1d1XI8lDNYkxVZAu_d3w0OJmFE4ea0cfKezoAhNg/viewform?usp=pp_url&entry.900429225=${encodeURIComponent(dharmshala.name)}&entry.340669516=${encodeURIComponent(dharmshala.id)}&entry.837366253=Dharmshala`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.suggestEditBtn}
                            >
                                ✏️ Suggest an Edit / Add Number
                            </a>
                        </div>
                    </section>
                </div>

                {/* Sidebar Column */}
                <div className={styles.sidebar}>
                    <section className={styles.card}>
                        <h2>📍 Location</h2>
                        <a href={dharmshala.location.mapsLink} target="_blank" rel="noopener noreferrer" className={styles.mapButton}>
                            Open in Google Maps ↗
                        </a>
                        
                        {dharmshala.howToReach && (dharmshala.howToReach.nearestRailway || dharmshala.howToReach.nearestAirport) && (
                            <div className={styles.howToReach}>
                                <h3>How to Reach</h3>
                                <ul>
                                    {dharmshala.howToReach.nearestAirport && <li>✈️ {dharmshala.howToReach.nearestAirport}</li>}
                                    {dharmshala.howToReach.nearestRailway && <li>🚆 {dharmshala.howToReach.nearestRailway}</li>}
                                    {dharmshala.howToReach.nearestBusStand && <li>🚌 {dharmshala.howToReach.nearestBusStand}</li>}
                                </ul>
                            </div>
                        )}
                    </section>

                    {relatedItineraries.length > 0 && (
                        <section className={styles.card}>
                            <h2>🗺️ Featured In</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                                This dharmshala is a stop in {relatedItineraries.length} itinerary route(s).
                            </p>
                            <div className={styles.itineraryLinks}>
                                {relatedItineraries.map(itin => (
                                    <Link key={itin.id} href={`/itinerary/${itin.id}`} className={styles.itinLinkCard}>
                                        <h4>{itin.title}</h4>
                                        <span>{itin.duration}</span>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
