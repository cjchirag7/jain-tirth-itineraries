import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import itinerariesOriginal from '@/data/itineraries.json';
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
    const itinerary = itineraries.find((i) => i.id === params.id);

    if (!itinerary) {
        notFound();
    }

    return <ItineraryClient itinerary={itinerary} />;
}

