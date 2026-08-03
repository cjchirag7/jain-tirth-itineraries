'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import styles from './page.module.css';

function TravelGuideContent() {
  const searchParams = useSearchParams();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [selectedHub, setSelectedHub] = useState<string | null>(null);

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

  const t = {
    title: isHi ? 'श्री ज्ञानोदय दिगम्बर जैन मंदिर, बेंगलुरु' : 'Shri Gyanoday Digamber Jain Temple, Bengaluru',
    subtitle: isHi ? 'मंदिर का पता' : 'Temple Location',
    address: isHi
      ? 'Digambar Jain Mandir Road, Near VIBGYOR High School, Silver Springs Layout, Munnekollal, Marathahalli, Bengaluru, Karnataka – 560066'
      : 'Digambar Jain Mandir Road, Near VIBGYOR High School, Silver Springs Layout, Munnekollal, Marathahalli, Bengaluru, Karnataka – 560066',
    mapsBtn: isHi ? 'Google Maps पर देखें' : 'View on Google Maps',
    downloadBtn: isHi ? 'PDF डाउनलोड करें' : 'Download PDF',
    quickInfo: isHi ? 'संक्षिप्त यात्रा जानकारी' : 'Quick Travel Information',
    infoCol1: isHi ? 'जानकारी' : 'Information',
    infoCol2: isHi ? 'विवरण' : 'Details',
    airportLabel: isHi ? 'निकटतम हवाई अड्डा' : 'Nearest Airport',
    airportVal: isHi ? 'केम्पेगौड़ा अंतरराष्ट्रीय हवाई अड्डा (BLR)' : 'Kempegowda International Airport (BLR)',
    metroLabel: isHi ? 'निकटतम मेट्रो स्टेशन' : 'Nearest Metro Station',
    metroVal: isHi ? 'कुन्दलहल्ली मेट्रो स्टेशन (पर्पल लाइन) या सीतारमपाल्या मेट्रो स्टेशन (पर्पल लाइन)' : 'Kundalahalli Metro Station (Purple Line) or Seetharampalya (Purple Line)',
    railLabel: isHi ? 'निकटतम रेलवे स्टेशन' : 'Nearest Railway Station',
    railVal: isHi ? 'कृष्णराजपुरम (KR पुरम)' : 'Krishnarajapuram (KR Puram)',
    cabLabel: isHi ? 'कैब सुविधा' : 'Cab Services',
    cabVal: isHi ? 'Uber, Ola एवं Airport Taxi उपलब्ध' : 'Uber, Ola and Airport Taxi Available',
    autoLabel: isHi ? 'ऑटो सुविधा' : 'Auto Availability',
    autoVal: isHi ? 'सभी प्रमुख रेलवे एवं मेट्रो स्टेशनों पर उपलब्ध' : 'Easily available near all Metro & Railway Stations',

    flightTitle: isHi ? 'हवाई जहाज द्वारा (By Flight)' : 'Reaching by Flight',
    flightSubtitle: isHi ? 'केम्पेगौड़ा अंतरराष्ट्रीय हवाई अड्डा (BLR)' : 'Kempegowda International Airport (BLR)',
    distTime: isHi ? 'मंदिर से दूरी- लगभग 42 किलोमीटर | अनुमानित यात्रा समय- 90–180 मिनट' : 'Distance: ~42 km | Travel Time: 90–180 minutes',

    flightOpt1: isHi ? 'विकल्प 1 – टैक्सी (सबसे सुविधाजनक)' : 'Option 1 – Taxi (Recommended)',
    flightOpt1Desc: isHi
      ? 'आगमन (Arrival) टर्मिनल से बाहर निकलने के बाद Uber, Ola या Airport Taxi बुक करें। Destination में लिखें: Shri Gyanoday Digamber Jain Temple. यदि आपके साथ अधिक सामान, बुजुर्ग अथवा छोटे बच्चे हों, तो यह सबसे सुविधाजनक विकल्प है।'
      : 'After exiting the Arrival Terminal, book an Uber, Ola, or Airport Taxi. Enter the destination: Shri Gyanoday Digamber Jain Temple. This is the most comfortable option, especially with luggage or elderly family members.',
    fareTime1: isHi ? 'किराया: ₹700–₹1,500 | समय: 75–150 मिनट' : 'Fare: ₹700–₹1,500 | Time: 75–150 mins',

    flightOpt2: isHi ? 'विकल्प 2 – एयरपोर्ट बस + ऑटो' : 'Option 2 – Airport Bus + Auto',
    flightOpt2Desc: isHi
      ? 'BMTC की Vayu Vajra Airport Bus सेवा हवाई अड्डे को शहर के विभिन्न भागों से जोड़ती है। Marathahalli / Whitefield दिशा की बस लें (बस नं: KIA-6, KIA-4A, and KIA-8)। कुन्दलहल्ली / मराठाहल्ली के निकट उतरकर ऑटो अथवा कैब द्वारा मंदिर पहुँचें।'
      : 'BMTC operates Vayu Vajra airport buses. Take a bus towards Marathahalli / Whitefield (Bus No. KIA-6, KIA-4A, and KIA-8). Get down near Kundalahalli/Marathahalli, then hire an Auto or Cab to the temple.',
    fareTime2: isHi ? 'किराया: ₹450 तक | समय: 90–180 मिनट' : 'Fare: ~₹450 | Time: 90–180 mins',

    trainTitle: isHi ? 'रेल द्वारा (By Train)' : 'Reaching by Train',
    trainDesc: isHi ? 'बेंगलुरु में कई रेलवे स्टेशन हैं। सबसे सुविधाजनक स्टेशन नीचे दिए गए हैं:' : 'Bengaluru has several railway stations. The most convenient ones are:',

    krPuram: isHi ? '1. कृष्णराजपुरम (KR पुरम) रेलवे स्टेशन (7 किमी)' : '1. Krishnarajapuram (KR Puram) Railway Station (7 km)',
    krPuramDesc: isHi
      ? 'विकल्प 1 (कैब/ऑटो): स्टेशन के बाहर से Uber/Ola बुक करें (₹200–₹400)।\nविकल्प 2 (मेट्रो+ऑटो): KR पुरम मेट्रो स्टेशन पहुँचें। पर्पल लाइन में Challaghatta दिशा की मेट्रो लें। कुन्दलहल्ली या सीतारमपाल्या पर उतरें। वहाँ से ऑटो लें।'
      : 'Option 1 (Cab/Auto): Book Uber/Ola directly from station (₹200–₹400).\nOption 2 (Metro+Auto): Go to KR Puram Metro Station. Board Purple Line towards Challaghatta. Get down at Kundalahalli. Take Auto.',

    smvt: isHi ? '2. सर एम. विश्वेश्वरैया टर्मिनल (SMVT) (8-10 किमी)' : '2. Sir M. Visvesvaraya Terminal Bengaluru (SMVT) (8-10 km)',
    smvtDesc: isHi ? 'सीधे Uber या Ola लेना सबसे सुविधाजनक रहेगा। (₹250–₹500 | 30-60 मिनट)' : 'Direct Uber or Ola is recommended. (₹250–₹500 | 30-60 mins)',

    majestic: isHi ? '3. केएसआर बेंगलुरु सिटी रेलवे स्टेशन (मैजेस्टिक) (20 किमी)' : '3. KSR Bengaluru City Railway Station (Majestic) (20 km)',
    majesticDesc: isHi
      ? 'सुविधाजनक मार्ग (मेट्रो): रेलवे स्टेशन से पैदल चलकर नादप्रभु केम्पेगौड़ा (मैजेस्टिक) मेट्रो स्टेशन पहुँचें। पर्पल लाइन (Whitefield/Kadugodi दिशा) में बैठें। कुन्दलहल्ली मेट्रो स्टेशन पर उतरें और ऑटो लें। (₹70–₹180 | 60 मिनट)'
      : 'Metro Route: Walk to Nadaprabhu Kempegowda (Majestic) Metro Station. Board Purple Line towards Whitefield (Kadugodi). Get down at Kundalahalli Metro Station. Take an Auto. (₹70–₹180 | 60 mins)',

    yesvantpur: isHi ? '4. यशवंतपुर जंक्शन (22 किमी)' : '4. Yesvantpur Junction (22 km)',
    yesvantpurDesc: isHi
      ? 'मेट्रो मार्ग: यशवंतपुर मेट्रो स्टेशन से ग्रीन लाइन लें -> मैजेस्टिक मेट्रो स्टेशन -> पर्पल लाइन (Whitefield दिशा) बदलें -> कुन्दलहल्ली मेट्रो स्टेशन पर उतरें -> ऑटो लें। (75–150 मिनट)'
      : 'Metro Route: Take Green Line from Yesvantpur -> Change to Purple Line at Majestic (towards Whitefield) -> Get down at Kundalahalli -> Take Auto. (75–150 mins)',

    cantonment: isHi ? '5. बेंगलुरु कैंटोनमेंट रेलवे स्टेशन (17 किमी)' : '5. Bengaluru Cantonment Railway Station (17 km)',
    cantonmentDesc: isHi
      ? 'निकटतम पर्पल लाइन मेट्रो स्टेशन (जैसे Cubbon Park) पहुँचें। Whitefield दिशा की मेट्रो लें और कुन्दलहल्ली उतरें। या सीधे कैब लें। (50–90 मिनट)'
      : 'Reach nearest Purple Line Metro (e.g. Cubbon Park). Board towards Whitefield. Get down at Kundalahalli. Or take a direct cab. (50–90 mins)',

    busTitle: isHi ? 'बस द्वारा (By Bus)' : 'Reaching by Bus',
    busDesc: isHi
      ? 'यदि आप बस से यात्रा करना चाहते हैं, तो Whitefield, ITPL, AECS Layout, Kundalahalli या Marathahalli दिशा की बसें (BMTC) लें। कुन्दलहल्ली गेट या सीतारमपाल्या बस स्टॉप पर उतरें। वहाँ से ऑटो लें।'
      : 'If travelling entirely by bus, board BMTC buses heading towards Whitefield, ITPL, AECS Layout, Kundalahalli, or Marathahalli. Get down at Kundalahalli Gate or Seetharampalya. Take a short Auto ride.',

    tipsTitle: isHi ? 'यात्रा संबंधी सुझाव (Travel Tips)' : 'Travel Tips',
    tips: isHi ? [
      'सप्ताह के कार्यदिवसों में मेट्रो यात्रा सबसे तेज़ एवं सुविधाजनक रहती है।',
      'यदि आपके साथ बुजुर्ग, छोटे बच्चे या अधिक सामान हो, तो सीधे कैब लेना बेहतर रहेगा।',
      'Uber, Ola एवं ऑटो पूरे बेंगलुरु में आसानी से उपलब्ध हैं।',
      'अधिकांश चालक UPI, नकद एवं डिजिटल भुगतान स्वीकार करते हैं।',
      'मोबाइल में पर्याप्त बैटरी एवं इंटरनेट अवश्य रखें।',
      'सुबह (8:30–11:00 बजे) तथा शाम (5:30–8:30 बजे) के व्यस्त समय में यात्रा का समय अधिक लग सकता है।'
    ] : [
      'Metro is usually the fastest option during weekday traffic.',
      'If travelling with elderly devotees or heavy luggage, booking a Cab directly is recommended.',
      'Uber, Ola, and Auto services are widely available throughout Bengaluru.',
      'Most drivers accept UPI and cash.',
      'Keep your phone charged and carry mobile data for navigation.',
      'During peak office hours (8:30–11:00 AM and 5:30–8:30 PM), travel times may increase significantly due to traffic.'
    ]
  };

  const pdfUrl = isHi ? '/pdfs/gyanoday-travel-guide-hi.pdf' : '/pdfs/gyanoday-travel-guide-en.pdf';
  const mapUrl = 'https://www.google.com/maps?cid=10167995298631462920';

  const hubs = [
    { id: 'flight', icon: '✈️', name: isHi ? 'हवाई अड्डा (BLR Airport)' : 'Airport (BLR)' },
    { id: 'kr-puram', icon: '🚂', name: isHi ? 'KR पुरम स्टेशन' : 'KR Puram Station' },
    { id: 'smvt', icon: '🚂', name: isHi ? 'SMVT टर्मिनल' : 'SMVT Terminal' },
    { id: 'majestic', icon: '🚂', name: isHi ? 'मैजेस्टिक स्टेशन' : 'Majestic Station' },
    { id: 'yesvantpur', icon: '🚂', name: isHi ? 'यशवंतपुर जंक्शन' : 'Yesvantpur Junction' },
    { id: 'cantonment', icon: '🚂', name: isHi ? 'कैंटोनमेंट स्टेशन' : 'Cantonment Station' },
    { id: 'bus', icon: '🚌', name: isHi ? 'बस स्टैंड (BMTC)' : 'Bus Station (BMTC)' }
  ];

  const renderSelectedContent = () => {
    switch (selectedHub) {
      case 'flight':
        return (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>✈️ {t.flightTitle}</h3>
            <p className={styles.address} style={{ fontWeight: 600, color: 'var(--secondary)' }}>{t.flightSubtitle}</p>
            <p className={styles.address}>{t.distTime}</p>
            
            <div className={styles.optionBlock}>
              <h4 className={styles.optionTitle}>{t.flightOpt1} <span className={styles.recommended}>★ Recommended</span></h4>
              <p>{t.flightOpt1Desc}</p>
              <p className={styles.highlight}>{t.fareTime1}</p>
            </div>

            <div className={styles.optionBlock}>
              <h4 className={styles.optionTitle}>{t.flightOpt2}</h4>
              <p>{t.flightOpt2Desc}</p>
              <p className={styles.highlight}>{t.fareTime2}</p>
            </div>
          </section>
        );
      case 'kr-puram':
        return (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>🚂 {t.krPuram}</h3>
            <div className={styles.optionBlock}>
              <p style={{ whiteSpace: 'pre-line' }}>{t.krPuramDesc}</p>
            </div>
          </section>
        );
      case 'smvt':
        return (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>🚂 {t.smvt}</h3>
            <div className={styles.optionBlock}>
              <p>{t.smvtDesc}</p>
            </div>
          </section>
        );
      case 'majestic':
        return (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>🚂 {t.majestic}</h3>
            <div className={styles.optionBlock}>
              <p>{t.majesticDesc}</p>
            </div>
          </section>
        );
      case 'yesvantpur':
        return (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>🚂 {t.yesvantpur}</h3>
            <div className={styles.optionBlock}>
              <p>{t.yesvantpurDesc}</p>
            </div>
          </section>
        );
      case 'cantonment':
        return (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>🚂 {t.cantonment}</h3>
            <div className={styles.optionBlock}>
              <p>{t.cantonmentDesc}</p>
            </div>
          </section>
        );
      case 'bus':
        return (
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>🚌 {t.busTitle}</h3>
            <p>{t.busDesc}</p>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{t.title} | Travel Guide</title>
      </Head>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t.title}</h1>
          <h2 className={styles.subtitle}>{t.subtitle}</h2>
          <p className={styles.address}>{t.address}</p>
          <div className={styles.headerButtons}>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapsBtn}>
              📍 {t.mapsBtn}
            </a>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
              📥 {t.downloadBtn}
            </a>
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={toggleLang} className={styles.langToggle}>
            🌐 {isHi ? 'Read in English' : 'हिंदी में पढ़ें'}
          </button>
        </div>
      </div>

      {!selectedHub ? (
        <>
          <h3 className={styles.hubPrompt}>{isHi ? 'आप कहाँ पहुँच रहे हैं?' : 'Where are you arriving?'}</h3>
          <div className={styles.hubGrid}>
            {hubs.map(hub => (
              <button key={hub.id} onClick={() => setSelectedHub(hub.id)} className={styles.hubCard}>
                <span className={styles.hubIcon}>{hub.icon}</span>
                <span className={styles.hubName}>{hub.name}</span>
              </button>
            ))}
          </div>
          
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>ℹ️ {t.quickInfo}</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <tbody>
                  <tr>
                    <th>{t.airportLabel}</th>
                    <td>{t.airportVal}</td>
                  </tr>
                  <tr>
                    <th>{t.metroLabel}</th>
                    <td>{t.metroVal}</td>
                  </tr>
                  <tr>
                    <th>{t.railLabel}</th>
                    <td>{t.railVal}</td>
                  </tr>
                  <tr>
                    <th>{t.cabLabel}</th>
                    <td>{t.cabVal}</td>
                  </tr>
                  <tr>
                    <th>{t.autoLabel}</th>
                    <td>{t.autoVal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedHub(null)} className={styles.backBtn}>
            ← {isHi ? 'वापस जाएँ (Back to Options)' : 'Back to Options'}
          </button>
          
          {renderSelectedContent()}
        </>
      )}

      <section className={styles.section} style={{ marginTop: selectedHub ? '0' : '2rem' }}>
        <h3 className={styles.sectionTitle}>💡 {t.tipsTitle}</h3>
        <ul className={styles.tipsList}>
          {t.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </section>

      <div className={styles.bottomAction}>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
          📥 {t.downloadBtn}
        </a>
      </div>
    </div>
  );
}

export default function TravelGuidePage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
      <TravelGuideContent />
    </Suspense>
  );
}
