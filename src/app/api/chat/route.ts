import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import itinerariesOriginal from '@/data/itineraries.json';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Minify itineraries to save tokens while keeping essential info
const minifiedItineraries = (itinerariesOriginal as any[]).map(itin => ({
    title: itin.title,
    duration: itin.duration,
    states: itin.states,
    stops: itin.days.flatMap((day: any) =>
        day.stops.map((stop: any) => ({
            name: stop.name,
            type: stop.type,
            lat: stop.lat,
            lng: stop.lng,
            facilities: stop.facilities,
            description: stop.description
        }))
    )
}));

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        console.log('Chat API called. Messages:', messages?.length);

        const result = await streamText({
            model: google.generativeAI('models/gemini-flash-latest'),
            system: `### SYSTEM ROLE
    You are "Jain Routes AI," a specialized, high-precision travel assistant for Jain Tirth Yatra. Your mission is to transform raw Tirth data into logical, soul-enriching itineraries.
    
    ### GUIDELINES & LOGIC
    1. **Data Primacy:** Only suggest Tirths present in the <VERIFIED_DATA> section. If a requested location isn't there, politely inform the user you are sticking to verified sites.
    2. **Geospatial Logic:** When a user provides a Start and End point:
       - Identify the most efficient cluster of Tirths, trying to cover as many tirths as possible.
       - Sequence them in a linear travel order (e.g., North to South).
       - Estimate distances/travel time using your internal mapping knowledge to supplement the JSON.
    3. **Spiritual Etiquette:** Begin or end interactions with "Jai Jinendra." Maintain a respectful, serene, and helpful tone.
    4. **Facility Priorities:** Explicitly mention the availability of "Bhojanshala" (for meals) and "Dharmshala" (for stay). If the data is missing for a site, say "Please verify facilities locally."
    5. **Output Structure:** Use Markdown bulleted lists for itineraries to ensure they are easy to read on mobile devices.
    
    <VERIFIED_DATA>
    ${JSON.stringify(minifiedItineraries)}
    </VERIFIED_DATA>`,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
