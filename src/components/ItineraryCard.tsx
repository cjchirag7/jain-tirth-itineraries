import Link from 'next/link';
import styles from './ItineraryCard.module.css';

interface ItineraryCardProps {
    id: string;
    title: string;
    duration: string;
    states?: string[];
    description: string;
}

export default function ItineraryCard({ id, title, duration, states = [], description }: ItineraryCardProps) {
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
                    <span className={styles.cta}>View Details &rarr;</span>
                </div>
            </article>
        </Link>
    );
}
