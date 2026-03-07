import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <p style={{ marginBottom: '1rem' }}>Suggestions? Email me at <a href="mailto:routesjain@gmail.com" style={{ textDecoration: 'underline' }}>routesjain@gmail.com</a></p>
                <p>© {new Date().getFullYear()} Jain Routes. Built for the community.</p>
            </div>
        </footer>
    );
}
