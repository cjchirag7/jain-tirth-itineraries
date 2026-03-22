import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import tirthsOriginal from '@/data/tirths.json';
import itinerariesOriginal from '@/data/itineraries.json';
import WhatsAppShareButton from '@/components/WhatsAppShareButton';

// Types
interface TirthContact {
    type: string;
    name: string;
    number: string;
    notes?: string;
}

interface Tirth {
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

const tirths: Tirth[] = tirthsOriginal as Tirth[];

export async function generateStaticParams() {
    return tirths.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const tirth = tirths.find((t) => t.id === params.id);
    if (!tirth) return { title: 'Tirth Not Found | Jain Routes' };

    return {
        title: `${tirth.name} | Jain Routes`,
        description: tirth.introText || `Plan your visit to ${tirth.name}. View contact numbers, Dharmshala details, and connected itineraries.`,
    };
}

export default function TirthPage({ params }: { params: { id: string } }) {
    const tirth = tirths.find((t) => t.id === params.id);

    if (!tirth) {
        notFound();
    }

    // Find itineraries that include this tirth
    const relatedItineraries = itinerariesOriginal.filter(itin => 
        itin.days.some(day => 
            day.stops.some((stop: any) => stop.tirthId === tirth.id)
        )
    );

    return (
        <div className="container">
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>&larr; Back to Home</Link>
                <div className={styles.categoryBadges}>
                    {(tirth as any).state && <span className={styles.categoryBadge}>{(tirth as any).state}</span>}
                    <span className={`${styles.categoryBadge} ${!tirth.facilities.includes('Dharmshala') ? styles.badgeDisabled : ''}`}>
                        {tirth.facilities.includes('Dharmshala') ? '🏨 Dharmshala' : '❌ No Dharmshala'}
                    </span>
                    <span className={`${styles.categoryBadge} ${!tirth.facilities.includes('Bhojanshala') ? styles.badgeDisabled : ''}`}>
                        {tirth.facilities.includes('Bhojanshala') ? '🍽️ Bhojanshala' : '❌ No Bhojanshala'}
                    </span>
                </div>
                <h1 className={styles.title}>{tirth.name}</h1>
                <p className={styles.description}>{tirth.introText || `A sacred pilgrimage site located in ${(tirth as any).state}.`}</p>
                <div className={styles.shareSection}>
                    <WhatsAppShareButton title={tirth.name} />
                </div>
            </div>

            <div className={styles.contentGrid}>
                {/* Main Content Column */}
                <div className={styles.mainContent}>
                    {tirth.description && (
                        <section className={styles.card}>
                            <h2>📜 About </h2>
                            <p>{tirth.description}</p>
                        </section>
                    )}

                    <section className={styles.card}>
                        <h2>📞 Contact Directory</h2>
                        {tirth.contacts && tirth.contacts.length > 0 ? (
                            <div className={styles.contactList}>
                                {tirth.contacts.map((c: any, i) => {
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
                                href={`https://docs.google.com/forms/d/e/1FAIpQLSfIfYSg3E1d1XI8lDNYkxVZAu_d3w0OJmFE4ea0cfKezoAhNg/viewform?usp=pp_url&entry.900429225=${encodeURIComponent(tirth.name)}&entry.340669516=${encodeURIComponent(tirth.id)}&entry.837366253=Tirth`}
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
                        <a href={tirth.location.mapsLink} target="_blank" rel="noopener noreferrer" className={styles.mapButton}>
                            Open in Google Maps ↗
                        </a>
                        
                        {tirth.howToReach && (tirth.howToReach.nearestRailway || tirth.howToReach.nearestAirport) && (
                            <div className={styles.howToReach}>
                                <h3>How to Reach</h3>
                                <ul>
                                    {tirth.howToReach.nearestAirport && <li>✈️ {tirth.howToReach.nearestAirport}</li>}
                                    {tirth.howToReach.nearestRailway && <li>🚆 {tirth.howToReach.nearestRailway}</li>}
                                    {tirth.howToReach.nearestBusStand && <li>🚌 {tirth.howToReach.nearestBusStand}</li>}
                                </ul>
                            </div>
                        )}
                    </section>

                    {relatedItineraries.length > 0 && (
                        <section className={styles.card}>
                            <h2>🗺️ Featured In</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '1rem' }}>
                                This tirth is part of {relatedItineraries.length} itinerary route(s).
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
