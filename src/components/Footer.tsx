import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p>© {new Date().getFullYear()} Jain Tirth Yatra. Built for the community.</p>
            </div>
        </footer>
    );
}
