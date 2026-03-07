/**
 * Script to extract lat/lng coordinates from Google Maps short URLs
 * stored in itineraries.json and save them back into the JSON file.
 * 
 * Uses Puppeteer to visit each short link and extract coordinates
 * from the final URL in the browser's address bar.
 * 
 * Includes rate-limiting (1.5s delay between requests) to avoid
 * being blocked by Google.
 * 
 * Usage: node scripts/update-lat-lng.js
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ITINERARIES_PATH = path.resolve(__dirname, '../src/data/itineraries.json');
const DELAY_MS = 1500; // Delay between requests to avoid rate limiting

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractLatLng(page, mapsLink) {
    if (!mapsLink || mapsLink === '') return null;

    try {
        await page.goto(mapsLink, { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Poll the URL for up to 8 seconds waiting for Google Maps to
        // update the address bar with @lat,lng after client-side rendering
        const maxWaitMs = 10000; // Increased to 10s for slower loads
        const pollIntervalMs = 500;
        let elapsed = 0;

        while (elapsed < maxWaitMs) {
            await sleep(pollIntervalMs);
            elapsed += pollIntervalMs;

            const currentUrl = page.url();
            const match = currentUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (match) {
                return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
            }
        }

        // Fallback: check og:url meta tag
        const coords = await page.evaluate(() => {
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) {
                const content = ogUrl.getAttribute('content') || '';
                const m = content.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
            }
            return null;
        });

        return coords;
    } catch (err) {
        console.error(`  ⚠ Error processing ${mapsLink}:`, err.message);
        return null;
    }
}

async function main() {
    console.log('📍 Reading itineraries.json...');
    const itineraries = JSON.parse(fs.readFileSync(ITINERARIES_PATH, 'utf-8'));

    // Count total stops to process
    let totalStops = 0;
    let stopsWithCoords = 0;
    let stopsProcessed = 0;

    for (const itin of itineraries) {
        for (const day of itin.days) {
            for (const stop of day.stops) {
                totalStops++;
                if (stop.lat && stop.lng) stopsWithCoords++;
            }
        }
    }

    const stopsToProcess = totalStops - stopsWithCoords;
    console.log(`📊 Found ${totalStops} total stops, ${stopsWithCoords} already have coordinates.`);

    if (stopsToProcess === 0) {
        console.log('✅ All stops already have coordinates. Nothing to do.');
        return;
    }

    console.log(`🔍 Processing ${stopsToProcess} stops without coordinates...\n`);

    console.log('🚀 Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set a reasonable viewport
    await page.setViewport({ width: 1280, height: 800 });

    for (const itin of itineraries) {
        console.log(`\n📋 Itinerary: ${itin.title}`);
        for (const day of itin.days) {
            for (const stop of day.stops) {
                // Skip if already has coordinates
                if (stop.lat && stop.lng) {
                    console.log(`  ✅ ${stop.name} (already has coords)`);
                    continue;
                }

                if (!stop.mapsLink) {
                    console.log(`  ⚠ ${stop.name} (no maps link, skipping)`);
                    continue;
                }

                stopsProcessed++;
                console.log(`  🔍 [${stopsProcessed}/${stopsToProcess}] ${stop.name}...`);

                const coords = await extractLatLng(page, stop.mapsLink);
                if (coords) {
                    stop.lat = coords.lat;
                    stop.lng = coords.lng;
                    console.log(`     ✅ ${coords.lat}, ${coords.lng}`);
                } else {
                    console.log(`     ⚠ Could not extract coordinates`);
                }

                // Rate limiting delay
                await sleep(DELAY_MS);
            }
        }
    }

    await browser.close();

    // Save updated itineraries
    console.log('\n💾 Saving updated itineraries.json...');
    fs.writeFileSync(ITINERARIES_PATH, JSON.stringify(itineraries, null, 2) + '\n', 'utf-8');

    // Summary
    let finalCount = 0;
    for (const itin of itineraries) {
        for (const day of itin.days) {
            for (const stop of day.stops) {
                if (stop.lat && stop.lng) finalCount++;
            }
        }
    }

    console.log(`\n🎉 Done! ${finalCount}/${totalStops} stops now have coordinates.`);
    if (finalCount < totalStops) {
        console.log(`⚠ ${totalStops - finalCount} stops still missing coordinates.`);
        console.log('   You can re-run this script to retry failed extractions.');
    }
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
