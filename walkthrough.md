# Jain Routes - Project Walkthrough

## Overview
Jain Routes is a premium Progressive Web App (PWA) designed for the Jain community to discover, share, and navigate tirth yatra itineraries. It replaces static text sharing with a dynamic, interactive, and searchable portal.

---

## ✅ Core Features

### 1. Advanced Search & Discovery
- **Hero Context**: Modern gradient design with a clear value proposition.
- **Real-time Filter Engine**: 
  - **Tirth Search**: Deep searches across titles, descriptions, and individual stops.
  - **Auto-suggest**: Custom `AutoComplete` component providing instant feedback.
  - **Dynamic State Filter**: Automatically derived from the itinerary database.
  - **Duration Filter**: Quickly find trips from 1 day to 5+ days.
- **Rich Cards**: View state badges, travel duration, and summaries at a glance.

### 2. AI Chatbot Assistant
- **Contextual Help**: A built-in AI assistant helps users find specific itineraries or answer questions about tirths.
- **Itinerary Recommendations**: The bot can suggest existing routes based on natural language queries.
- **Feedback Loop**: All queries are logged (to Google Sheets) to continuously improve response precision.

### 3. Smart Map Directions (Mobile-First)
- **GPS Integration**: One-touch **"Use My Location"** button fetches coordinates via browser Geolocation API.
- **Starting Location Memory**: Users can set a custom starting city which is persisted via `localStorage` across the site.
- **Hop-by-Hop Routing**: Every stop card has a "Get Directions" button that automatically routes from the *previous* stop for a seamless journey.
- **Interactive Embeds**: Dynamic Google Maps integration for every day of the trip.

### 4. Advanced Submission Flow (v2)
- **Data Safety**: Integrated `localStorage` auto-save prevents data loss if the tab is closed during drafting.
- **"Quick Outline" Mode**: A low-friction tab for users who prefer pasting free-form text instead of filling a structured form.
- **Submission Fallback**: If the email client (`mailto:`) fails, the app provides a beautiful "Copy to Clipboard" interface for manual submission.
- **UX Refinements**: Secondary "Add Another Day" buttons and standardized button typography (1rem/600 weight).

### 5. Architectural Excellence
- **Hybrid Components**: Uses a mix of Next.js Server Components (for SEO and `generateStaticParams`) and Client Components (for complex state management).
- **PWA Ready**: Fully configured `manifest.json` for home-screen installation.
- **Type Safety**: Built with strict TypeScript for maintainability.
- **Performance**: Optimized bundles and fast First Load JS.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Header/Footer/Analytics)
│   ├── page.tsx            # Home page (Search & Filter engine)
│   ├── api/                # Backend routes (Chatbot, Analytics logging)
│   ├── itinerary/[id]/     # Itinerary Details (Hybrid Server/Client)
│   └── submit/             # Submission form (Auto-save logic)
├── components/             # Reusable UI (MapEmbed, AutoComplete, Chatbot)
└── data/
    └── itineraries.json    # The core database
```

---

## 🎨 Design System
- **Primary Color**: `#ff6b35` (Vibrant Orange)
- **Secondary Color**: `#1a2332` (Deep Navy)
- **Typography**: Playfair Display (Headings) & Inter (Body)
- **Aesthetics**: Glassmorphism, subtle micro-animations, and consistent spacing.

---

## 🚀 Technical Commands

### Development
```bash
npm run dev
```

### Build & Audit
```bash
npm run build
npx tsc --noEmit     # Type check
npx next lint        # Lint check
```

---

## ✨ Achievements Since Launch
- ✅ Full rebranding to **Jain Routes**.
- ✅ AI Assistant integration.
- ✅ Search auto-suggestion engine.
- ✅ Persistent user travel context (Starting Location).
- ✅ GPS-based direction support.
- ✅ Robust itinerary submission flow with auto-drafting.
- ✅ 1000+ Yatris reached through shared links.
