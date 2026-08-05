'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import { cabOptions, CabOption } from '@/data/cabs';

type FilterType = 'All' | '4 Seater' | '6/7 Seater' | '12 Seater';

function CabsContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [filter, setFilter] = useState<FilterType>('All');

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam === 'hi') {
      setLang('hi');
    }
  }, [searchParams]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const isHi = lang === 'hi';

  // Apply filter
  const filteredCabs = cabOptions.filter((cab) => {
    if (filter === 'All') return true;
    if (filter === '4 Seater') return cab.capacity === 4;
    if (filter === '6/7 Seater') return cab.capacity === 6 || cab.capacity === 7;
    if (filter === '12 Seater') return cab.capacity === 12;
    return true;
  });

  // Group filtered cabs by company name
  const groupedCabs = filteredCabs.reduce((acc, cab) => {
    if (!acc[cab.companyName]) {
      acc[cab.companyName] = [];
    }
    acc[cab.companyName].push(cab);
    return acc;
  }, {} as Record<string, CabOption[]>);

  // Sort companies by priority order (using the first cab's priority order)
  const sortedCompanies = Object.keys(groupedCabs).sort(
    (a, b) => groupedCabs[a][0].priorityOrder - groupedCabs[b][0].priorityOrder
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className={styles.title}>{isHi ? 'रियायती कैब और यात्रा दरें' : 'Negotiated Cabs & Tours'}</h1>
              <p className={styles.subtitle}>{isHi ? 'बेंगलुरु चातुर्मास 2026 यात्रियों के लिए विशेष दरें' : 'Special rates for Bengaluru Chaturmaas 2026 Yatris'}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={toggleLang} className={styles.langToggle}>
                {isHi ? 'Read in English' : 'हिंदी में पढ़ें'}
              </button>
              <a 
                href="https://docs.google.com/spreadsheets/d/1vLxLAB8CwDth1KU605bdT_5MMEkVpeFbfaKJWh5sBk4/export?format=pdf&gid=183019313" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.downloadBtn}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                {isHi ? 'PDF डाउनलोड करें' : 'Download PDF'}
              </a>
            </div>
          </div>

          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚠️</span> 
              <strong>{isHi ? 'ध्यान दें:' : 'Note:'}</strong> {isHi ? 'टोल टैक्स, पार्किंग शुल्क और स्टेट परमिट (कर्नाटक के बाहर) का भुगतान यात्री को अतिरिक्त करना होगा।' : 'Toll charges, parking fees, and state permits (if traveling outside Karnataka) are extra and must be paid by the passenger.'}
            </p>
          </div>
          
          <div className={styles.filters}>
            {(['All', '4 Seater', '6/7 Seater', '12 Seater'] as FilterType[]).map(f => {
              const labelEn = f;
              let labelHi: string = f;
              if (f === 'All') labelHi = 'सभी';
              else if (f === '4 Seater') labelHi = '4 सीटर';
              else if (f === '6/7 Seater') labelHi = '6/7 सीटर';
              else if (f === '12 Seater') labelHi = '12 सीटर';
              
              return (
                <button
                  key={f}
                  className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {isHi ? labelHi : labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {sortedCompanies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          {isHi ? 'इस फिल्टर से मेल खाने वाले कोई वाहन नहीं मिले।' : 'No vehicles found matching this filter.'}
        </div>
      ) : (
        <div className={styles.grid}>
          {sortedCompanies.map((company) => {
            const cabs = groupedCabs[company];
            const contact = cabs[0].contact;
            const isLink = contact.startsWith('http');

            return (
              <div key={company} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.companyName}>{company}</h2>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {isLink ? (
                      <a href={contact} target="_blank" rel="noopener noreferrer" className={styles.contact}>
                        {isHi ? 'वेबसाइट देखें' : 'Visit Website'}
                      </a>
                    ) : (
                      <a href={`tel:${contact}`} className={styles.contact}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        {contact}
                      </a>
                    )}
                  </div>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>{isHi ? 'वाहन' : 'Vehicle'}</th>
                        <th>{company === 'Aishwarya Cabs' ? (isHi ? 'कुल लागत' : 'Cost') : (isHi ? 'दर/किमी' : 'Rate/Km')}</th>
                        <th>{isHi ? 'भत्ता/दिन' : 'Bata/Day'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cabs.map((cab, idx) => (
                        <tr key={idx}>
                          <td className={styles.vehicleType}>
                            {cab.vehicleType}
                            {cab.capacity && cab.capacity !== '-' && (
                              <span style={{ display: 'block', fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal' }}>
                                {isHi ? 'क्षमता:' : 'Capacity:'} {cab.capacity}
                              </span>
                            )}
                          </td>
                          <td className={styles.rate}>
                            {cab.ratePerKm !== '-' ? `₹${cab.ratePerKm}` : '-'}
                          </td>
                          <td>
                            {cab.bataPerDay !== '-' ? `₹${cab.bataPerDay}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ChaturmasCabsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>}>
      <CabsContent />
    </Suspense>
  );
}
