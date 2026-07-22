# 🚀 NASA Space & Satellite Operations Dashboard

A real-time, interactive space telemetry and satellite operations ground center built with official **NASA Open APIs** and modern web standards.

![NASA Operations Center](https://images-assets.nasa.gov/image/PIA12235/PIA12235~medium.jpg)

## 🌌 Overview

The **NASA Space & Satellite Operations Dashboard** provides mission control monitoring across multiple live space telemetry streams:

- 📷 **Astronomy Picture of the Day (APOD)**: Daily high-resolution deep space imagery with random historical discovery and HD lightbox inspection.
- ☄️ **Near-Earth Object (NEO) Asteroid Radar**: Real-time tracking of close-approach asteroids, estimated diameters, relative velocities, miss distances, and potential hazard ratings.
- ☀️ **DONKI Space Weather Notifications**: Solar flare (CME/FLR), geomagnetic storm, and solar energetic particle alerts.
- 🌍 **DSCOVR EPIC Earth Globe Camera**: Animated rotation time-lapse player using sequential sub-satellite full-disc imagery from the DSCOVR space satellite at Lagrange Point L1.
- 🌋 **NASA EONET Hazard Tracker**: Earth Observatory Natural Event Tracker monitoring active wildland fires, severe storms, volcanoes, and sea ice events.
- 🛸 **NASA Image & Deep Space Explorer**: High-performance search across the NASA Image & Video Archive featuring Curiosity, Perseverance, James Webb (JWST), and Hubble discoveries.

---

## 🏗️ Architecture & Project Directory Structure

```
nasa-space-ops-dashboard/
├── index.html                  # Main application HTML entry point
├── assets/
│   ├── css/
│   │   └── main.css            # NASA Light Design System, variables, and responsive layout
│   └── js/
│       ├── config.js           # API key configuration and fallback constants
│       ├── utils.js            # Image fallbacks, UTC clock, and async API fetch helper
│       ├── main.js             # Global navigation tab controller and bootstrap initializer
│       └── modules/
│           ├── apod.js         # Astronomy Picture of the Day module
│           ├── neo.js          # Near-Earth Object asteroid feed & table renderer
│           ├── weather.js      # DONKI Space Weather notification parser
│           ├── epic.js         # DSCOVR EPIC Earth globe player & preloader
│           ├── eonet.js        # NASA EONET Earth Natural Event Tracker
│           ├── media.js        # NASA Image & Deep Space search engine
│           └── modal.js        # Lightbox image preview modal system
├── README.md                   # Complete repository documentation
└── .gitignore                  # Git ignore rules
```

---

## 🎨 Design System & Aesthetics

- **Theme**: NASA Light Operational Theme (`#f8fafc` background, crisp `#cbd5e1` borders, high-contrast NASA Navy `#061938` typography).
- **Typography**: Inter (Google Fonts) with system fallback stack.
- **Icons**: Scalable inline SVG vector icons across navigation, telemetry metrics, player controls, and data tables.
- **Performance**: Preconnect link headers for NASA CDN domains, asynchronous image decoding (`decoding="async"`), lazy loading (`loading="lazy"`), and Map pre-buffering for instant 60fps Earth rotation time-lapses.

---

## 🛠️ Getting Started

### Local Setup
No build steps or dependencies required! Open `index.html` in any web browser or serve with a local dev server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx serve
npx serve .
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🛰️ NASA APIs Utilized

- **APOD API**: `https://api.nasa.gov/planetary/apod`
- **NEO Feed API**: `https://api.nasa.gov/neo/rest/v1/feed`
- **DONKI Space Weather API**: `https://api.nasa.gov/DONKI/notifications`
- **EPIC Earth Camera API**: `https://api.nasa.gov/EPIC/api/natural`
- **EONET API**: `https://eonet.gsfc.nasa.gov/api/v3/events`
- **NASA Image & Video Library API**: `https://images-api.nasa.gov/search`

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE). Data provided courtesy of NASA Open APIs.
