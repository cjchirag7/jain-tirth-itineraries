import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>404</h1>
            <h2 className={styles.message}>Page Not Found</h2>
            <p className={styles.text}>
                Jai Jinendra! 🙏 The page you are looking for might have been removed, 
                had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/" className="btn btn-primary">
                Return to Home
            </Link>
        </div>
    );
}
