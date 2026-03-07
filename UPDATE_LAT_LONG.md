# Updating Latitude & Longitude for Itinerary Stops

When new itineraries are added to `src/data/itineraries.json`, each stop's Google Maps short link needs to be resolved into `lat`/`lng` coordinates. These coordinates power the embedded route maps and the "Open in Google Maps" universal links.

## Prerequisites

- **Node.js** (v18+)
- **Puppeteer** (installed as a dev dependency)

If Puppeteer is not installed yet:
```bash
npm install --save-dev puppeteer
```

## How to Run

```bash
node scripts/update-lat-lng.js
```

The script will:
1. Read all stops from `src/data/itineraries.json`
2. Skip any stops that already have `lat` and `lng` values (idempotent)
3. For each remaining stop, visit its `mapsLink` in a headless browser
4. Extract the coordinates from the Google Maps URL bar
5. Write the updated data back to `itineraries.json`

## Rate Limiting

The script includes a **1.5-second delay** between each request to avoid Google's rate limiting. Processing all stops takes approximately **10–15 minutes** depending on network speed.

## Re-running

The script is **idempotent** — it only processes stops that are missing coordinates. If the script is interrupted, simply re-run it and it will pick up where it left off.

## Important Notes

- This script is a **local development tool only**. It is not used during build or deployment.
- Puppeteer is installed as a `devDependency` and is excluded from production bundles.
- The `scripts/` folder is not included in the Next.js build output or Vercel deployment.
