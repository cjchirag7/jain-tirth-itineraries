# How to Add an Itinerary

This guide explains how to manually add a new itinerary to the `jain-tirth-itineraries` website.

## 1. Local Preview & Data Structure
All itineraries are stored in the `src/data/itineraries.json` file. The frontend reads from this file to display itineraries on the homepage and individual itinerary pages.

Each itinerary is an object with the following structure:
```json
{
  "id": "unique-id-here",
  "title": "Title of the Itinerary",
  "duration": "e.g., 3 Days",
  "states": ["State1", "State2"],
  "author": "Your Name",
  "authorInstagram": "https://instagram.com/yourhandle",
  "description": "A short overview of the trip.",
  "keywords": ["Tirth1", "Dharmshala", "Bhojanshala", "LocationName"],
  "days": [
    {
      "day": 1,
      "stops": [
        {
          "name": "Name of the Tirth/Stop",
          "type": "Temple / Travel / Sightseeing",
          "facilities": ["Dharmshala", "Bhojanshala"],
          "description": "Details about this stop.",
          "mapsLink": "https://maps.app.goo.gl/..."
        }
      ]
    }
  ]
}
```

### Allowed Values
- **`id`**: Must be unique, URL-friendly slug based on the title (lowercase, hyphens instead of spaces, e.g., `shikharji-yatra-3-days`).
- **`facilities`**: An array of strings. We highly recommend using exactly `"Dharmshala"` and `"Bhojanshala"` when applicable, as the UI adds special icons (🍽️, 🏨) for these exact strings.

## 2. Handling Form Submissions
When a user submits the "Submit an Itinerary" form, the JSON data is automatically generated. However, the form currently does not prompt for **SEO keywords**.

To fully integrate a user-submitted itinerary:
1. Copy the generated JSON snippet from the form submission.
2. Paste it into the array in `src/data/itineraries.json`.
4. Ensure the **id** is in same format as other itineraries but unique.
3. **Manually add the `keywords` field**, foe example:
   ```json
   "keywords": ["Shikharji", "Parasnath Hill", "Jharkhand", "Dharmshala", "Bhojanshala", "Jain Tirth"],
   ```
   Add specific names of the popular tirths to ensure good SEO when the page is generated.

## 3. Previewing the Updated Itinerary
To see the new itinerary locally:
1. Ensure the development server is running (`npm run dev`).
2. Open [http://localhost:3000](http://localhost:3000). The new itinerary should now appear in the list.
3. Click on the itinerary to view its dedicated page and verify that all information, including stops and facilities, is formatted correctly.
