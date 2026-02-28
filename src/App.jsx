import { useState } from 'react'
import SearchBar from './components/SearchBar'
import MapView from './components/MapView'
import ResultsPanel from './components/ResultsPanel'
import { fetchSoilData } from './api/soilgrids'
import { fetchClimateData } from './api/nasa'
import { fetchVegetationData } from './api/openlandmap'
import { analyzeSoilRisk } from './lib/groq'

export default function App() {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [rawData, setRawData] = useState(null)
  const [error, setError] = useState(null)
  const [step, setStep] = useState('')

  const handleSearch = async (loc) => {
    setLocation(loc)
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      setStep('Fetching soil composition data...')
      const soil = await fetchSoilData(loc.lat, loc.lon).catch(() => ({
        ph: null, organicCarbon: null, clay: null,
        sand: null, nitrogen: null, bulkDensity: null,
      }))

      setStep('Pulling NASA climate records...')
      const climate = await fetchClimateData(loc.lat, loc.lon).catch(() => ({
        annualRainfallMm: null, avgTempC: null, maxTempC: null,
        minTempC: null, avgHumidityPct: null, avgWindSpeedMs: null,
      }))

      setStep('Reading vegetation index...')
      const vegetation = await fetchVegetationData(loc.lat, loc.lon).catch(() => ({
        landCoverCode: null, ndvi: null,
      }))

      setStep('Running AI risk analysis...')
      const raw = { soil, climate, vegetation }
      setRawData(raw)

      const analysis = await analyzeSoilRisk({ location: loc, ...raw })
      setResult(analysis)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setStep('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0f0a] text-green-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-[#1a2e1a] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-green-800 flex items-center justify-center text-green-200 font-bold text-sm">
          TG
        </div>
        <div>
          <h1 className="text-sm font-bold text-green-100 leading-none">TerrаGuard</h1>
          <p className="text-xs text-green-700 mt-0.5">Soil Degradation Risk Mapper</p>
        </div>
        <div className="ml-auto">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView location={location} />

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 rounded-xl">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-green-300">{step}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !result && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <p className="text-green-800 text-sm font-medium">Search a location to begin analysis</p>
              <p className="text-green-900 text-xs">Uses real soil, climate, and satellite data</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-96 flex-shrink-0 border-l border-[#1a2e1a] overflow-y-auto p-5">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-sm text-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!result && !error && !loading && (
            <div className="flex flex-col gap-4 text-xs text-green-700">
              <p className="text-green-500 font-semibold text-sm">What is TerrаGuard?</p>
              <p className="leading-relaxed">
                TerrаGuard predicts soil degradation risk <strong className="text-green-400">before it happens</strong>.
                Enter any location to get a real-time risk score based on actual soil composition,
                climate patterns, and vegetation health data.
              </p>
              <div className="flex flex-col gap-2 mt-2">
                {[
                  ['SoilGrids (ISRIC)', 'pH, organic carbon, clay, nitrogen'],
                  ['NASA POWER', 'Rainfall, temperature, wind'],
                  ['OpenLandMap', 'NDVI, vegetation index'],
                  ['Groq / LLaMA 3.3', 'AI risk synthesis'],
                ].map(([src, desc]) => (
                  <div key={src} className="flex justify-between bg-[#111a11] rounded px-3 py-2">
                    <span className="text-green-400 font-medium">{src}</span>
                    <span className="text-green-800">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ResultsPanel result={result} rawData={rawData} />
        </div>
      </div>
    </div>
  )
}
