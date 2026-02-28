// GreenPT API — sustainability & carbon sequestration analysis
// Uses green-r-raw, GreenPT's proprietary environmental model

export async function fetchSustainabilityScore({ location, soil, climate }) {
  const prompt = `You are an environmental sustainability expert. Assess the carbon sequestration potential and sustainability outlook for this location.

LOCATION: ${location.name} (${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})

SOIL DATA:
- Organic Carbon: ${soil.organicCarbon ?? 'unavailable'} g/kg
- pH: ${soil.ph ?? 'unavailable'}
- Clay: ${soil.clay ?? 'unavailable'}%
- Bulk Density: ${soil.bulkDensity ?? 'unavailable'} g/cm³

CLIMATE:
- Annual Rainfall: ${climate.annualRainfallMm ?? 'unavailable'} mm/yr
- Avg Temp: ${climate.avgTempC ?? 'unavailable'} °C

Respond with ONLY valid JSON:
{
  "sustainabilityScore": <integer 0-100, higher = more sustainable/recoverable>,
  "carbonSequestrationPotential": "<Low | Moderate | High | Very High>",
  "carbonTonnesPerHectare": "<estimated current carbon storage, e.g. '45-60 tC/ha'>",
  "restorationPotential": "<1-2 sentences on how much this soil can recover and how>",
  "regenerativePractices": [
    "<specific regenerative agriculture practice for this region>",
    "<practice>",
    "<practice>"
  ],
  "co2ImpactIfRestored": "<estimated CO2 that could be sequestered if soil health is restored, e.g. '2-4 tCO2/ha/yr'>"
}`

  const res = await fetch('https://api.greenpt.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GREENPT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'green-r-raw',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800,
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`GreenPT error: ${res.status}`)
  const data = await res.json()
  const content = data.choices?.[0]?.message?.content ?? ''
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('GreenPT returned invalid JSON')
  return JSON.parse(jsonMatch[0])
}
