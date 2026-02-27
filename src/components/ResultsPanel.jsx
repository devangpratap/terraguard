import RiskGauge from './RiskGauge'

const statusColor = {
  Good: 'text-green-400',
  Warning: 'text-yellow-400',
  Critical: 'text-red-400',
}

const statusBg = {
  Good: 'bg-green-400/10 border-green-400/20',
  Warning: 'bg-yellow-400/10 border-yellow-400/20',
  Critical: 'bg-red-400/10 border-red-400/20',
}

export default function ResultsPanel({ result, rawData }) {
  if (!result) return null

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-green-100">Degradation Risk</h2>
          <p className="text-xs text-green-700 mt-0.5">
            Time horizon: <span className="text-green-400">{result.timeHorizon}</span>
          </p>
        </div>
        <RiskGauge score={result.riskScore} level={result.riskLevel} />
      </div>

      {/* Summary */}
      <p className="text-sm text-green-200 leading-relaxed border-l-2 border-green-700 pl-3">
        {result.summary}
      </p>

      {/* Factors */}
      <div>
        <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Contributing Factors</h3>
        <div className="flex flex-col gap-2">
          {result.factors?.map((f, i) => (
            <div key={i} className={`rounded-lg border px-3 py-2 ${statusBg[f.status]}`}>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-green-100">{f.name}</span>
                <span className={`text-xs font-bold ${statusColor[f.status]}`}>{f.status}</span>
              </div>
              <p className="text-xs text-green-400 mt-1">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">Recommendations</h3>
        <ol className="flex flex-col gap-2">
          {result.recommendations?.map((r, i) => (
            <li key={i} className="flex gap-3 text-xs text-green-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-800 text-green-200 flex items-center justify-center font-bold text-xs">
                {i + 1}
              </span>
              <span className="leading-relaxed">{r}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Raw Data */}
      {rawData && (
        <details className="text-xs">
          <summary className="text-green-700 cursor-pointer hover:text-green-500 transition-colors">
            Raw sensor data
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-1 text-green-500 font-mono">
            {Object.entries({
              'pH': rawData.soil.ph,
              'Org. Carbon': `${rawData.soil.organicCarbon} g/kg`,
              'Clay': `${rawData.soil.clay}%`,
              'Sand': `${rawData.soil.sand}%`,
              'Nitrogen': `${rawData.soil.nitrogen} g/kg`,
              'Bulk Density': `${rawData.soil.bulkDensity} g/cm³`,
              'Rainfall': `${rawData.climate.annualRainfallMm?.toFixed(0)} mm/yr`,
              'Avg Temp': `${rawData.climate.avgTempC?.toFixed(1)} °C`,
              'Humidity': `${rawData.climate.avgHumidityPct?.toFixed(0)}%`,
              'Wind': `${rawData.climate.avgWindSpeedMs?.toFixed(1)} m/s`,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between bg-[#111a11] rounded px-2 py-1">
                <span className="text-green-700">{k}</span>
                <span>{v ?? '—'}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
