import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './ChaturmasModal.module.css';

interface ChaturmasModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function ChaturmasModal({ isOpen: controlledIsOpen, onClose }: ChaturmasModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);

    useEffect(() => {
        if (controlledIsOpen === undefined) {
            const hasSeen = sessionStorage.getItem('hasSeenChaturmasModal');
            if (!hasSeen) {
                // Show popup on reload with a slight smooth delay
                const timer = setTimeout(() => {
                    setInternalOpen(true);
                }, 600);
                return () => clearTimeout(timer);
            }
        }
    }, [controlledIsOpen]);

    const isVisible = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

    const handleClose = () => {
        sessionStorage.setItem('hasSeenChaturmasModal', 'true');
        if (onClose) {
            onClose();
        } else {
            setInternalOpen(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={handleClose} aria-label="Close modal">×</button>

                <div className={styles.modalHeader}>
                    <h2>🙏 Welcome to All Yatris arriving for<br />Bengaluru Chaturmaas 2026<br /><span className={styles.hindiTheme}>(आत्म-सिलिकॉन वर्षायोग)</span></h2>
                </div>

                <div className={styles.modalContent}>
                    <p>Start planning your tirth yatras in South India. Download our special curated itinerary guides:</p>

                    <div className={styles.pdfLinks}>
                        <a href="/pdfs/gyanoday-travel-guide-en.pdf" target="_blank" rel="noopener noreferrer" className={styles.pdfCard}>
                            <div className={styles.pdfIcon}>📍</div>
                            <div className={styles.pdfDetails}>
                                <strong>How to Reach Shri Gyanoday Tirth Bengaluru?</strong>
                                <span>English Version</span>
                            </div>
                        </a>

                        <a href="/pdfs/gyanoday-travel-guide-hi.pdf" target="_blank" rel="noopener noreferrer" className={styles.pdfCard}>
                            <div className={styles.pdfIcon}>🗺️</div>
                            <div className={styles.pdfDetails}>
                                <strong>श्री ज्ञानोदय तीर्थ बेंगलुरु कैसे पहुँचें?</strong>
                                <span>हिंदी संस्करण</span>
                            </div>
                        </a>

                        <a href="/pdfs/karnataka-itinerary-en.pdf" target="_blank" rel="noopener noreferrer" className={styles.pdfCard}>
                            <div className={styles.pdfIcon}>📄</div>
                            <div className={styles.pdfDetails}>
                                <strong>Karnataka Itineraries</strong>
                                <span>English Version</span>
                            </div>
                        </a>

                        <a href="/pdfs/karnataka-itinerary-hi.pdf" target="_blank" rel="noopener noreferrer" className={styles.pdfCard}>
                            <div className={styles.pdfIcon}>📜</div>
                            <div className={styles.pdfDetails}>
                                <strong>कर्नाटक यात्रा मार्ग</strong>
                                <span>हिंदी संस्करण</span>
                            </div>
                        </a>

                        <a href="/pdfs/tamil-nadu-itinerary-en.pdf" target="_blank" rel="noopener noreferrer" className={styles.pdfCard}>
                            <div className={styles.pdfIcon}>📄</div>
                            <div className={styles.pdfDetails}>
                                <strong>Tamil Nadu Itineraries</strong>
                                <span>English Version</span>
                            </div>
                        </a>

                        <a href="/pdfs/tamil-nadu-itinerary-hi.pdf" target="_blank" rel="noopener noreferrer" className={styles.pdfCard}>
                            <div className={styles.pdfIcon}>📜</div>
                            <div className={styles.pdfDetails}>
                                <strong>तमिलनाडु यात्रा मार्ग</strong>
                                <span>हिंदी संस्करण</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.exploreBtn} onClick={handleClose}>
                        Explore Jain Routes
                    </button>
                </div>
            </div>
        </div>
    );
}
