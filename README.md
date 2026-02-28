# TerraGuard — Soil Degradation Risk Mapper

TerraGuard is a predictive soil degradation risk tool. Enter any location on Earth and get a real-time risk score based on actual soil composition, climate history, and satellite vegetation data — analyzed by two independent AI models. Built to give farmers and landowners an early warning before soil damage becomes irreversible.

**Live:** https://terraguard-five.vercel.app

---

## APIs Used

| API | Purpose |
|---|---|
| [SoilGrids v2.0 (ISRIC)](https://rest.isric.org) | Soil composition — pH, organic carbon, clay %, nitrogen, bulk density |
| [NASA POWER](https://power.larc.nasa.gov) | Climate data — 30yr rainfall, temperature, humidity, wind averages |
| [OpenLandMap](https://api.openlandmap.org) | NDVI vegetation index from MODIS/Sentinel satellite imagery |
| [Nominatim (OSM)](https://nominatim.openstreetmap.org) | Geocoding — converts location text to coordinates |
| [Groq — LLaMA 3.3 70B](https://groq.com) | AI risk synthesis — scores degradation risk and generates recommendations |
| [GreenPT — green-r-raw](https://greenpt.ai) | Sustainability scoring — carbon sequestration potential and regenerative practices |

---

## Stack

React · Vite · Tailwind CSS · Leaflet.js · Bun · Vercel
