// SoilGrids REST API by ISRIC — no auth required
// Docs: https://rest.isric.org/soilgrids/v2.0/docs

export async function fetchSoilData(lat, lon) {
  // API requires repeated property params, not comma-separated
  const properties = ['phh2o', 'soc', 'clay', 'sand', 'nitrogen', 'bdod']
  const params = new URLSearchParams()
  params.append('lon', lon)
  params.append('lat', lat)
  properties.forEach(p => params.append('property', p))
  params.append('depth', '0-5cm')
  params.append('value', 'mean')

  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?${params.toString()}`

  const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
  if (!res.ok) throw new Error(`SoilGrids error: ${res.status}`)
  const data = await res.json()

  const extract = (name) => {
    const layer = data.properties?.layers?.find(l => l.name === name)
    const depth = layer?.depths?.find(d => d.label === '0-5cm')
    return depth?.values?.mean ?? null
  }

  return {
    ph: extract('phh2o') !== null ? extract('phh2o') / 10 : null,
    organicCarbon: extract('soc') !== null ? extract('soc') / 10 : null,
    clay: extract('clay') !== null ? extract('clay') / 10 : null,
    sand: extract('sand') !== null ? extract('sand') / 10 : null,
    nitrogen: extract('nitrogen') !== null ? extract('nitrogen') / 100 : null,
    bulkDensity: extract('bdod') !== null ? extract('bdod') / 100 : null,
  }
}
