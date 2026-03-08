import Link from 'next/link';
import styles from './ItineraryCard.module.css';

interface ItineraryCardProps {
    id: string;
    title: string;
    duration: string;
    states?: string[];
    description: string;
    author: string;
    authorInstagram?: string;
}

export default function ItineraryCard({
    id,
    title,
    duration,
    states = [],
    description,
    author,
    authorInstagram
}: ItineraryCardProps) {
    return (
        <Link href={`/itinerary/${id}`} className={styles.cardLink}>
            <article className={`card ${styles.card}`}>
                <div className={styles.header}>
                    <div className={styles.badges}>
                        {states && states.length > 0 && states.map((state) => (
                            <span key={state} className={styles.badge}>{state}</span>
                        ))}
                    </div>
                    <span className={styles.duration}>⏱ {duration}</span>
                </div>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
                <div className={styles.footer}>
                    <div className={styles.authorInfo}>
                        <span className={styles.authorLabel}>By</span>
                        <span className={styles.authorName}>{author}</span>
                        {authorInstagram && (
                            <a
                                href={authorInstagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.instagramLink}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        )}
                    </div>
                    <span className={styles.cta}>View &rarr;</span>
                </div>
            </article>
        </Link>
    );
}
