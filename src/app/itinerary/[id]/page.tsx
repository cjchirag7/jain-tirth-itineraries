import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import itinerariesOriginal from '@/data/itineraries.json';
import tirthsOriginal from '@/data/tirths.json';
import dharmshalasOriginal from '@/data/dharmshalas.json';
import ItineraryClient from './ItineraryClient';

// Type definition (same as Home page for now, could be shared)
interface Itinerary {
    id: string;
    title: string;
    duration: string;
    states: string[];
    author: string;
    authorInstagram?: string;
    description: string;
    keywords?: string[];
    days: {
        day: number;
        stops: {
            tirthId?: string;
            tirth?: any; // Full tirth object
            name: string;
            type: string;
            facilities: string[];
            description: string;
            mapsLink: string;
            lat?: number;
            lng?: number;
        }[];
    }[];
}

const itineraries: Itinerary[] = itinerariesOriginal as Itinerary[];

export async function generateStaticParams() {
    return itineraries.map((itinerary) => ({
        id: itinerary.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const itinerary = itineraries.find((i) => i.id === params.id);

    if (!itinerary) {
        return {
            title: 'Itinerary Not Found | Jain Routes'
        };
    }

    const defaultKeywords = ['Jain', 'Tirth', 'Yatra', 'Itinerary', 'Dharmshala', 'Bhojanshala'];

    return {
        title: `${itinerary.title} | Jain Routes`,
        description: itinerary.description,
        keywords: itinerary.keywords ? [...defaultKeywords, ...itinerary.keywords] : defaultKeywords,
    };
}

export default function ItineraryDetails({ params }: { params: { id: string } }) {
    const rawItinerary = itineraries.find((i) => i.id === params.id);

    if (!rawItinerary) {
        notFound();
    }

    // Enrich itinerary with Tirth data
    const enrichedItinerary = {
        ...rawItinerary,
        days: rawItinerary.days.map((day) => ({
            ...day,
            stops: day.stops.map((stop: any) => {
                let foundDetails = null;
                
                if (stop.tirthId) {
                    foundDetails = tirthsOriginal.find(t => t.id === stop.tirthId);
                    if (!foundDetails) {
                        foundDetails = dharmshalasOriginal.find(d => d.id === stop.tirthId);
                    }
                }

                return {
                    ...stop,
                    tirth: foundDetails || null,
                    lat: foundDetails?.location?.lat ?? stop.lat,
                    lng: foundDetails?.location?.lng ?? stop.lng,
                    mapsLink: foundDetails?.location?.mapsLink ?? stop.mapsLink,
                    facilities: foundDetails?.facilities ?? stop.facilities ?? []
                };
            }),
        })),
    };

    return <ItineraryClient itinerary={enrichedItinerary} />;
}
