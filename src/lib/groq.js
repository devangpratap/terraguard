import Groq from 'groq-sdk'

const client = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function analyzeSoilRisk({ location, soil, climate, vegetation }) {
  const prompt = `You are an expert soil scientist and environmental analyst. Analyze the following real sensor and satellite data for a specific location and provide a soil degradation risk assessment.

LOCATION: ${location.name} (${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})

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
- Max Temperature: ${climate.maxTempC ?? 'unavailable'} °C
- Avg Humidity: ${climate.avgHumidityPct ?? 'unavailable'}%
- Avg Wind Speed: ${climate.avgWindSpeedMs ?? 'unavailable'} m/s

VEGETATION DATA (OpenLandMap):
- NDVI: ${vegetation.ndvi ?? 'unavailable'}
- Land Cover Code: ${vegetation.landCoverCode ?? 'unavailable'}

Based on this data, respond with ONLY valid JSON in this exact structure:
{
  "riskScore": <integer 0-100>,
  "riskLevel": "<one of: Low | Moderate | High | Critical>",
  "summary": "<2-3 sentence plain-English summary of the soil's current health and trajectory>",
  "factors": [
    { "name": "<factor name>", "status": "<Good|Warning|Critical>", "detail": "<1 sentence explanation>" }
  ],
  "recommendations": [
    "<specific actionable recommendation>",
    "<specific actionable recommendation>",
    "<specific actionable recommendation>"
  ],
  "timeHorizon": "<how long before serious degradation if no action taken, e.g. '10-15 years'>"
}

Be precise, scientific, and specific to the actual data values. Do not be generic.`

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 1024,
  })

  const content = response.choices[0]?.message?.content ?? ''
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq returned invalid JSON')
  return JSON.parse(jsonMatch[0])
}
