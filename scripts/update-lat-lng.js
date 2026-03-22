/**
 * Script to extract lat/lng coordinates from Google Maps short URLs
 * stored in tirths.json and dharmshalas.json and save them back into the JSON files.
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

const DATA_FILES = [
    { name: 'tirths.json', path: path.resolve(__dirname, '../src/data/tirths.json') },
    { name: 'dharmshalas.json', path: path.resolve(__dirname, '../src/data/dharmshalas.json') }
];
const DELAY_MS = 1500; // Delay between requests to avoid rate limiting

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function extractLatLng(page, mapsLink) {
    if (!mapsLink || mapsLink === '') return null;

    try {
        await page.goto(mapsLink, { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Poll the URL for up to 10 seconds waiting for Google Maps to
        // update the address bar with @lat,lng after client-side rendering
        const maxWaitMs = 10000;
        const pollIntervalMs = 500;
        let elapsed = 0;

        while (elapsed < maxWaitMs) {
            await sleep(pollIntervalMs);
            elapsed += pollIntervalMs;

            const currentUrl = page.url();
            
            // First try to match the exact pin location from the data parameters (!3d... !4d...)
            const pinMatch = currentUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
            if (pinMatch) {
                return { lat: parseFloat(pinMatch[1]), lng: parseFloat(pinMatch[2]) };
            }

            // Fallback: match the viewport center (@lat,lng)
            const viewMatch = currentUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (viewMatch) {
                return { lat: parseFloat(viewMatch[1]), lng: parseFloat(viewMatch[2]) };
            }
        }

        // Fallback: check og:url meta tag
        const coords = await page.evaluate(() => {
            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) {
                const content = ogUrl.getAttribute('content') || '';
                
                const pinMatch = content.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
                if (pinMatch) return { lat: parseFloat(pinMatch[1]), lng: parseFloat(pinMatch[2]) };

                const viewMatch = content.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (viewMatch) return { lat: parseFloat(viewMatch[1]), lng: parseFloat(viewMatch[2]) };
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
    console.log('🚀 Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    for (const fileInfo of DATA_FILES) {
        console.log(`\n📍 Processing ${fileInfo.name}...`);
        const data = JSON.parse(fs.readFileSync(fileInfo.path, 'utf-8'));

        let totalItems = data.length;
        let itemsWithCoords = 0;
        let itemsProcessed = 0;

        for (const item of data) {
            if (item.location && item.location.lat && item.location.lng) {
                itemsWithCoords++;
            }
        }

        const itemsToProcess = totalItems - itemsWithCoords;
        console.log(`📊 Found ${totalItems} items, ${itemsWithCoords} already have coordinates.`);

        if (itemsToProcess === 0) {
            console.log(`✅ All items in ${fileInfo.name} already have coordinates.`);
            continue;
        }

        for (const item of data) {
            // Check if coordinates are missing
            if (item.location && item.location.lat && item.location.lng) continue;

            const mapsLink = item.location ? item.location.mapsLink : null;
            if (!mapsLink) {
                console.log(`  ⚠ ${item.name} (no maps link, skipping)`);
                continue;
            }

            itemsProcessed++;
            console.log(`  🔍 [${itemsProcessed}/${itemsToProcess}] ${item.name}...`);

            const coords = await extractLatLng(page, mapsLink);
            if (coords) {
                item.location.lat = coords.lat;
                item.location.lng = coords.lng;
                console.log(`     ✅ ${coords.lat}, ${coords.lng}`);
            } else {
                console.log(`     ⚠ Could not extract coordinates`);
            }

            // Rate limiting delay
            await sleep(DELAY_MS);
        }

        // Save updated file
        console.log(`💾 Saving updated ${fileInfo.name}...`);
        fs.writeFileSync(fileInfo.path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    }

    await browser.close();
    console.log('\n🎉 Done! All files updated.');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
