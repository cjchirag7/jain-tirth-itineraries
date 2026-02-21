import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.icon}>🪔</span>
          <span className={styles.title}>Jain Tirth Yatra</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/submit" className="btn btn-primary">
            Submit Itinerary
          </Link>
        </nav>
      </div>
    </header>
  );
}
