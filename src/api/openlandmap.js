// OpenLandMap REST API — no auth required
// Returns NDVI and land cover data by lat/lon

export async function fetchVegetationData(lat, lon) {
  // NDVI mean annual (250m resolution, MODIS-based)
  const ndviUrl = `https://api.openlandmap.org/query/point?lat=${lat}&lon=${lon}&coll=sol_landcover_usgs.lc_p&depth=0&start=2010&end=2020`

  try {
    const res = await fetch(ndviUrl)
    if (!res.ok) throw new Error(`OpenLandMap error: ${res.status}`)
    const data = await res.json()

    // Also fetch NDVI separately
    const ndviRes = await fetch(
      `https://api.openlandmap.org/query/point?lat=${lat}&lon=${lon}&coll=veg_fapar.lc_p250m`
    )
    const ndviData = ndviRes.ok ? await ndviRes.json() : null

    return {
      landCoverCode: data?.data?.[0]?.value ?? null,
      ndvi: ndviData?.data?.[0]?.value ?? null,
    }
  } catch {
    // Non-critical — return nulls if this API fails
    return { landCoverCode: null, ndvi: null }
  }
}
