/**
 * Script to verify the state given in tirths.json and dharmshalas.json
 * matches the state derived from their lat/long coordinates.
 * 
 * Uses OpenStreetMap's Nominatim Reverse Geocoding API.
 * Includes rate-limiting (1.5s delay) to comply with Nominatim usage policy.
 * 
 * Usage: node scripts/verify-states.js
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DATA_FILES = [
    { name: 'tirths.json', path: path.resolve(__dirname, '../src/data/tirths.json') },
    { name: 'dharmshalas.json', path: path.resolve(__dirname, '../src/data/dharmshalas.json') }
];
const DELAY_MS = 1500;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeState(state) {
    if (!state) return '';
    return state.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function getStateFromCoords(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'JainTirthItinerariesBot/1.0 (verify-script)'
            }
        });
        if (!response.ok) {
            console.error(`\nReceived status ${response.status} from Nominatim`);
            return null;
        }
        const data = await response.json();
        return data.address ? data.address.state : null;
    } catch (err) {
        console.error(`\nError fetching state for (${lat}, ${lng}):`, err.message);
        return null;
    }
}

async function main() {
    let totalChecked = 0;
    
    for (const fileInfo of DATA_FILES) {
        console.log(`\n📍 Verifying ${fileInfo.name}...`);
        const data = JSON.parse(fs.readFileSync(fileInfo.path, 'utf-8'));
        
        let mismatches = [];
        
        for (const item of data) {
            if (!item.location || item.location.lat == null || item.location.lng == null) {
                // skip
                continue;
            }

            const { lat, lng } = item.location;
            const expectedState = item.state || '';
            
            const actualState = await getStateFromCoords(lat, lng);
            
            if (!actualState) {
                process.stdout.write('❌');
            } else {
                const isMatch = normalizeState(actualState) === normalizeState(expectedState);
                if (isMatch) {
                    process.stdout.write('.');
                } else {
                    process.stdout.write('🚨');
                    mismatches.push({
                        item,
                        expectedState,
                        actualState
                    });
                }
            }

            totalChecked++;
            await sleep(DELAY_MS);
        }
        console.log(); // Newline after progress dots

        if (mismatches.length > 0) {
            console.log(`\nFound ${mismatches.length} mismatches in ${fileInfo.name}:`);
            mismatches.forEach(m => {
                console.log(`  - ${m.item.name}: JSON="${m.expectedState}", Map="${m.actualState}"`);
            });

            console.log();
            const action = await askQuestion(`How to handle? [y]es to all, [n]o to all, or [m]anually choose? (y/n/m): `);
            const choice = action.toLowerCase();
            
            let fileChanged = false;

            if (choice === 'y' || choice === 'yes') {
                mismatches.forEach(m => {
                    m.item.state = m.actualState;
                });
                fileChanged = true;
                console.log(`✅ Updated all mismatched states.`);
            } else if (choice === 'm' || choice === 'manual') {
                for (const m of mismatches) {
                    const ans = await askQuestion(`  Update state for "${m.item.name}" to "${m.actualState}"? (y/n): `);
                    if (ans.toLowerCase() === 'y' || ans.toLowerCase() === 'yes') {
                        m.item.state = m.actualState;
                        fileChanged = true;
                        console.log(`     ✅ Updated.`);
                    } else {
                        console.log(`     ⏭ Skipped.`);
                    }
                }
            } else {
                console.log(`⏭ Skipped all updates for ${fileInfo.name}.`);
            }

            if (fileChanged) {
                console.log(`\n💾 Saving updated ${fileInfo.name}...`);
                fs.writeFileSync(fileInfo.path, JSON.stringify(data, null, 2) + '\n', 'utf-8');
            }
        } else {
            console.log(`✅ No state mismatches found in ${fileInfo.name}.`);
        }
    }
    
    console.log(`\n🏁 Done! Checked ${totalChecked} places across all files.`);
    rl.close();
}

main().catch((err) => {
    console.error(err);
    if (rl) rl.close();
});
