// NASA POWER API — no auth required
// Returns climate data (rainfall, temperature) for any lat/lon

export async function fetchClimateData(lat, lon) {
  const params = 'PRECTOTCORR,T2M,T2M_MAX,T2M_MIN,RH2M,WS10M'
  const end = new Date()
  const start = new Date()
  start.setFullYear(end.getFullYear() - 3)

  const fmt = (d) => d.toISOString().slice(0, 10).replace(/-/g, '')

  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=${params}&community=AG&longitude=${lon}&latitude=${lat}&format=JSON`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`NASA POWER error: ${res.status}`)
  const data = await res.json()

  const props = data.properties?.parameter ?? {}

  const annualAvg = (obj) => {
    if (!obj) return null
    const vals = Object.values(obj).filter(v => typeof v === 'number' && v !== -999)
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  }

  return {
    annualRainfallMm: annualAvg(props.PRECTOTCORR) !== null
      ? annualAvg(props.PRECTOTCORR) * 365
      : null,
    avgTempC: annualAvg(props.T2M),
    maxTempC: annualAvg(props.T2M_MAX),
    minTempC: annualAvg(props.T2M_MIN),
    avgHumidityPct: annualAvg(props.RH2M),
    avgWindSpeedMs: annualAvg(props.WS10M),
  }
}
