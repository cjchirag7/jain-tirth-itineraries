import { Google } from '@ai-sdk/google';
import { streamText } from 'ai';
import itinerariesOriginal from '@/data/itineraries.json';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Initialize Google providers with primary and secondary keys
const googlePrimary = new Google({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const googleSecondary = new Google({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY_SECONDARY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Minify itineraries while keeping essential info for AI
const minifiedItineraries = (itinerariesOriginal as any[]).map(itin => ({
    id: itin.id,
    title: itin.title,
    states: itin.states,
    stops: itin.days.flatMap((day: any) =>
        day.stops.map((stop: any) => ({
            name: stop.name,
            type: stop.type,
            lat: stop.lat,
            lng: stop.lng,
            fac: stop.facilities,
            desc: stop.description
        }))
    )
}));

export async function POST(req: Request) {
    const { messages } = await req.json();
    const lastMessage = messages?.[messages.length - 1];

    // Log the user's question for analysis
    if (lastMessage?.role === 'user') {
        console.log(`[Chat Query]: ${lastMessage.content}`);

        // Asynchronous logging to Google Sheets (if URL exists)
        const logUrl = process.env.LOGGING_GOOGLE_SCRIPT_URL;

        if (logUrl) {
            console.log('Attempting to log to Google Sheet...');
            // We use fetch and await it to ensure it's sent before the function finishes
            // even if it's streaming, it's better to be safe.
            (async () => {
                try {
                    const response = await fetch(logUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            timestamp: new Date().toISOString(),
                            query: lastMessage.content
                        }),
                    });
                    console.log(`Logging Sheet Response: ${response.status} ${response.statusText}`);
                } catch (e) {
                    console.error('Logging fetch failed ERROR:', e);
                }
            })();
        } else {
            console.log('LOGGING_GOOGLE_SCRIPT_URL is not defined in .env.local');
        }
    }

    const systemPrompt = `### SYSTEM ROLE
You are "Jain Routes AI," a specialized, high-precision travel assistant for Jain Tirth Yatra. Your mission is to transform raw Tirth data into logical, soul-enriching itineraries.

### GUIDELINES & LOGIC
1. **Data Primacy:** Only suggest Tirths present in the <VERIFIED_DATA> section.
2. **Feature Itineraries:** If a user's request matches an existing itinerary, share the link(s): [Itinerary Name](https://jainroutes.com/itinerary/[id]).
3. **Tone & Etiquette:** Be friendly but direct. Help users like a local expert.
4. **Strict Greeting:** START your response with "Jai Jinendra! 🙏". **NEVER** say "Jai Jinendra" at the end. Say it only once.
5. **Conciseness:** Be brief but informative. Use markdown bullet points. Avoid long paragraphs or filler text.
6. **Geospatial Logic:** Sequence Tirths in a logical travel order. Estimate distances / travel time using your internal knowledge.
7. **Facility Priorities:** Mention "Bhojanshala" and "Dharmshala" availability if present in data.

<VERIFIED_DATA>
${JSON.stringify(minifiedItineraries)}
</VERIFIED_DATA>`;

    const callAi = async (provider: Google) => {
        return streamText({
            model: provider.generativeAI('models/gemini-flash-latest'),
            system: systemPrompt,
            messages,
            // Reduce retries for primary to switch to secondary faster if it fails
            maxRetries: 1,
            onFinish: async ({ text }) => {
                const logUrl = process.env.LOGGING_GOOGLE_SCRIPT_URL;
                // Sheet logging is now handled at the start of POST to capture failures
            }
        });
    };

    try {
        const result = await callAi(googlePrimary);
        return result.toDataStreamResponse();
    } catch (error: any) {
        // Fallback to secondary if primary is rate-limited (429)
        // AI SDK might wrap quota error in RetryError
        const isRateLimited =
            error.statusCode === 429 ||
            error.status === 429 ||
            error.message?.includes('429') ||
            error.message?.includes('quota') ||
            (error.errors && error.errors.some((e: any) => e.statusCode === 429 || e.message?.includes('429')));

        if (isRateLimited && process.env.GOOGLE_GENERATIVE_AI_API_KEY_SECONDARY) {
            console.log('Primary API rate-limited or quota exceeded, attempting fallback to secondary key...');
            try {
                const result = await callAi(googleSecondary);
                return result.toDataStreamResponse();
            } catch (secError: any) {
                console.error('Secondary API also failed:', secError);
                throw secError;
            }
        }
        console.error('Chat API error:', error);
        throw error;
    }
}
