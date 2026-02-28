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

  const prompt = `You are an expert soil scientist and environmental analyst with deep knowledge of regional soil conditions worldwide.

LOCATION: ${location.name} (${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})

SENSOR DATA STATUS: ${hasRealData ? 'Partial real data available' : 'Live sensor APIs unavailable — use your expert knowledge of this specific region, its known soil types, agricultural history, climate patterns, and documented degradation risks to provide a realistic assessment.'}

SOIL DATA (SoilGrids / ISRIC):
- pH: ${soil.ph ?? 'unavailable'}
- Organic Carbon: ${soil.organicCarbon ?? 'unavailable'} g/kg
- Clay content: ${soil.clay ?? 'unavailable'}%
- Sand content: ${soil.sand ?? 'unavailable'}%
- Nitrogen: ${soil.nitrogen ?? 'unavailable'} g/kg
- Bulk Density: ${soil.bulkDensity ?? 'unavailable'} g/cm³

CLIMATE DATA (NASA POWER):
- Annual Rainfall: ${climate.annualRainfallMm ?? 'unavailable'} mm/year
- Avg Temperature: ${climate.avgTempC ?? 'unavailable'} °C
- Avg Humidity: ${climate.avgHumidityPct ?? 'unavailable'}%
- Avg Wind Speed: ${climate.avgWindSpeedMs ?? 'unavailable'} m/s

VEGETATION DATA:
- NDVI: ${vegetation.ndvi ?? 'unavailable'}
- Land Cover: ${vegetation.landCoverCode ?? 'unavailable'}

CRITICAL INSTRUCTIONS:
- Use available data where present. Where data is unavailable, draw on your knowledge of this exact region's documented soil conditions, land use history, deforestation trends, agricultural pressures, and climate.
- Risk scores MUST vary meaningfully by region. Sahel = high, Nordic forests = low, intensive farmland = moderate-high, etc.
- Never output 60 as a default. Be accurate to this specific location.
- Respond with ONLY valid JSON:

{
  "riskScore": <integer 0-100, must be accurate to this specific region>,
  "riskLevel": "<Low | Moderate | High | Critical>",
  "summary": "<2-3 sentences specific to this location's known environmental context>",
  "factors": [
    { "name": "<factor>", "status": "<Good|Warning|Critical>", "detail": "<specific to this region>" }
  ],
  "recommendations": [
    "<actionable recommendation specific to this region and its land use>",
    "<actionable recommendation>",
    "<actionable recommendation>"
  ],
  "timeHorizon": "<realistic estimate for this specific region>"
}`

  const response = await getClient().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 1024,
  })

  const content = response.choices[0]?.message?.content ?? ''
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq returned invalid JSON')
  return JSON.parse(jsonMatch[0])
}
