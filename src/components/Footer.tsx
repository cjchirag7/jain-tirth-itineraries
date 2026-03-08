import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <Link href="/submit" className={styles.contributionLink}>
                    Have a route to share? Help the community &rarr;
                </Link>
                <p style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Suggestions? Email me at <a href="mailto:routesjain@gmail.com" style={{ textDecoration: 'underline' }}>routesjain@gmail.com</a></p>
                <p>© {new Date().getFullYear()} Jain Routes. Built for the community.</p>
            </div>
        </footer>
    );
}
