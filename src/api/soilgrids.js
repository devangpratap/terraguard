// SoilGrids REST API by ISRIC — no auth required
// Docs: https://rest.isric.org/soilgrids/v2.0/docs

export async function fetchSoilData(lat, lon) {
  const properties = ['phh2o', 'soc', 'clay', 'sand', 'nitrogen', 'bdod'].join(',')
  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=${properties}&depth=0-30cm&value=mean`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`SoilGrids error: ${res.status}`)
  const data = await res.json()

  const extract = (name) => {
    const layer = data.properties?.layers?.find(l => l.name === name)
    const depth = layer?.depths?.find(d => d.label === '0-30cm')
    return depth?.values?.mean ?? null
  }

  return {
    ph: extract('phh2o') !== null ? extract('phh2o') / 10 : null,     // stored as x10
    organicCarbon: extract('soc') !== null ? extract('soc') / 10 : null, // dg/kg -> g/kg
    clay: extract('clay') !== null ? extract('clay') / 10 : null,     // g/kg -> %
    sand: extract('sand') !== null ? extract('sand') / 10 : null,
    nitrogen: extract('nitrogen') !== null ? extract('nitrogen') / 100 : null,
    bulkDensity: extract('bdod') !== null ? extract('bdod') / 100 : null, // cg/cm³ -> g/cm³
  }
}
