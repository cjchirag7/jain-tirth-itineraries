'use client';

import styles from './MapEmbed.module.css';

interface Stop {
    name: string;
    lat?: number;
    lng?: number;
}

interface MapEmbedProps {
    day: number;
    stops: Stop[];
    states: string[];
    previousDayLastStop?: Stop;
    startLocation?: string;
}

export default function MapEmbed({ day, stops, states, previousDayLastStop, startLocation }: MapEmbedProps) {
    if (!stops || stops.length === 0) return null;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    // Format a stop as coordinates if available, otherwise fall back to name with state context
    const formatStop = (stop: Stop) => {
        if (stop.lat && stop.lng) {
            return encodeURIComponent(`${stop.lat},${stop.lng}`);
        }
        const stateContext = states.length > 0 ? `, ${states[0]}` : '';
        return encodeURIComponent(`${stop.name}${stateContext}`);
    };

    // Build the full list of routing stops
    // 1. If we have a startLocation (Day 1), prepend it
    // 2. Else if we have previousDayLastStop, prepend it
    // 3. Otherwise just use stops
    let routingStops: (Stop | string)[] = stops;

    if (day === 1 && startLocation) {
        routingStops = [startLocation, ...stops];
    } else if (previousDayLastStop) {
        routingStops = [previousDayLastStop, ...stops];
    }

    const getStopString = (stop: Stop | string) => {
        if (typeof stop === 'string') return encodeURIComponent(stop);
        return formatStop(stop);
    };

    let embedUrl = '';
    let universalLink = '';

    if (routingStops.length === 1) {
        // Single stop - use Place mode for embed and Search mode for link
        const place = getStopString(routingStops[0]);
        embedUrl = apiKey ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${place}` : '';
        universalLink = `https://www.google.com/maps/search/?api=1&query=${place}`;
    } else {
        // Multiple stops - use Directions mode
        const origin = getStopString(routingStops[0]);
        const destination = getStopString(routingStops[routingStops.length - 1]);

        let waypoints = '';
        if (routingStops.length > 2) {
            const middleStops = routingStops.slice(1, routingStops.length - 1);
            waypoints = middleStops.map(stop => getStopString(stop)).join('|');
        }

        if (apiKey) {
            embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}`;
            if (waypoints) {
                embedUrl += `&waypoints=${waypoints}`;
            }
        }

        universalLink = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
        if (waypoints) {
            universalLink += `&waypoints=${waypoints}`;
        }
    }

    return (
        <div className={styles.mapContainer}>
            {apiKey ? (
                <div className={styles.embedWrapper}>
                    <iframe
                        title={`Day ${day} Route Map`}
                        className={styles.iframe}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={embedUrl}
                    ></iframe>
                </div>
            ) : null}

            <div className={styles.actionWrapper}>
                <a
                    href={universalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-primary ${styles.openMapBtn}`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                        <line x1="9" y1="3" x2="9" y2="18"></line>
                        <line x1="15" y1="6" x2="15" y2="21"></line>
                    </svg>
                    {stops.length > 1 ? `Open Day ${day} Route in Google Maps` : `View Location in Google Maps`}
                </a>
            </div>
        </div>
    );
}
