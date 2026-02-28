import Groq from 'groq-sdk'

let client = null
function getClient() {
  if (!client) {
    client = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  }
  return client
}

export async function analyzeSoilRisk({ location, soil, climate, vegetation }) {
  const hasRealData = Object.values(soil).some(v => v !== null)
    || Object.values(climate).some(v => v !== null)

  const prompt = `You are a senior soil scientist at the FAO with 30 years of field experience across every continent. You are analyzing soil degradation risk for a specific location.

LOCATION: ${location.name} (${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})

SENSOR DATA:
- Soil pH: ${soil.ph ?? 'unavailable'}
- Organic Carbon: ${soil.organicCarbon ?? 'unavailable'} g/kg
- Clay: ${soil.clay ?? 'unavailable'}%
- Sand: ${soil.sand ?? 'unavailable'}%
- Nitrogen: ${soil.nitrogen ?? 'unavailable'} g/kg
- Bulk Density: ${soil.bulkDensity ?? 'unavailable'} g/cm³
- Annual Rainfall: ${climate.annualRainfallMm ?? 'unavailable'} mm/yr
- Avg Temp: ${climate.avgTempC ?? 'unavailable'} °C
- Humidity: ${climate.avgHumidityPct ?? 'unavailable'}%
- Wind Speed: ${climate.avgWindSpeedMs ?? 'unavailable'} m/s
- NDVI: ${vegetation.ndvi ?? 'unavailable'}

${!hasRealData ? `SENSOR FEEDS OFFLINE: Base your assessment entirely on your expert knowledge of this specific region. Use documented FAO/IPCC data for this geography.` : ''}

SCORING RUBRIC (use this to calibrate):
- 5-15: Pristine (untouched boreal/tropical forests, protected reserves — e.g. Amazon core, Siberian taiga)
- 16-30: Low risk (sustainably managed land, healthy grasslands — e.g. Scandinavia, New Zealand)
- 31-50: Moderate (conventional farmland with some management — e.g. US Midwest, Western Europe)
- 51-70: High (degraded agricultural land, drought-stressed, overfarmed — e.g. parts of India, China's north)
- 71-85: Very High (severe erosion, deforestation pressure, arid stress — e.g. Sub-Saharan Africa, Haiti)
- 86-100: Critical (near-total degradation, desertification underway — e.g. Sahel, Aral Sea basin)

RULES:
1. Score must reflect this SPECIFIC location's documented conditions — not a global average
2. Urban areas should score higher (50+) due to soil sealing and contamination
3. Active agricultural zones score based on intensity and management practices
4. Consider: land use history, erosion rates, climate stress, deforestation, population pressure
5. Output ONLY valid JSON, no other text

{
  "riskScore": <integer calibrated to rubric above>,
  "riskLevel": "<Low | Moderate | High | Critical>",
  "summary": "<2-3 sentences grounded in this region's specific documented environmental conditions>",
  "factors": [
    { "name": "<factor>", "status": "<Good|Warning|Critical>", "detail": "<cite specific regional conditions>" }
  ],
  "recommendations": [
    "<recommendation specific to this region's land use and culture>",
    "<recommendation>",
    "<recommendation>"
  ],
  "timeHorizon": "<realistic timeline based on documented degradation rates for this region>"
}`

  const response = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 1024,
  })

  const content = response.choices[0]?.message?.content ?? ''
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq returned invalid JSON')
  return JSON.parse(jsonMatch[0])
}
