import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/icon.png" alt="Jain Routes Logo" width={32} height={32} className={styles.iconImage} />
          <span className={styles.title}>Jain Routes</span>
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
