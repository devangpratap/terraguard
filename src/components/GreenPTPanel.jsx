const potentialColor = {
  'Low':       'text-red-400',
  'Moderate':  'text-yellow-400',
  'High':      'text-green-400',
  'Very High': 'text-emerald-400',
}

export default function GreenPTPanel({ data }) {
  if (!data) return (
    <div className="text-xs text-green-800 text-center py-6">
      GreenPT analysis unavailable for this location.
    </div>
  )

  const potColor = potentialColor[data.carbonSequestrationPotential] ?? 'text-green-400'

  return (
    <div className="flex flex-col gap-5">
      {/* Powered by badge */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-600 font-medium">Powered by GreenPT · green-r-raw model</span>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#111a11] border border-[#1a2e1a] rounded-lg px-3 py-3">
          <p className="text-xs text-green-700 mb-1">Sustainability Score</p>
          <p className="text-2xl font-bold text-emerald-400">{data.sustainabilityScore}<span className="text-sm text-green-700">/100</span></p>
        </div>
        <div className="bg-[#111a11] border border-[#1a2e1a] rounded-lg px-3 py-3">
          <p className="text-xs text-green-700 mb-1">Carbon Sequestration</p>
          <p className={`text-lg font-bold ${potColor}`}>{data.carbonSequestrationPotential}</p>
        </div>
      </div>

      {/* Carbon stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[#0d150d] border border-[#1a2e1a] rounded-lg px-3 py-2">
          <p className="text-xs text-green-700">Current Storage</p>
          <p className="text-sm font-semibold text-green-300 mt-0.5">{data.carbonTonnesPerHectare}</p>
        </div>
        <div className="bg-[#0d150d] border border-[#1a2e1a] rounded-lg px-3 py-2">
          <p className="text-xs text-green-700">If Restored</p>
          <p className="text-sm font-semibold text-emerald-300 mt-0.5">{data.co2ImpactIfRestored}</p>
        </div>
      </div>

      {/* Restoration potential */}
      <div className="bg-[#111a11] border border-emerald-900/40 rounded-lg px-4 py-3">
        <p className="text-xs text-emerald-700 uppercase tracking-wider font-semibold mb-1">Restoration Potential</p>
        <p className="text-sm text-emerald-300 leading-relaxed">{data.restorationPotential}</p>
      </div>

      {/* Regenerative practices */}
      <div>
        <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-2">Regenerative Practices</p>
        <div className="flex flex-col gap-2">
          {data.regenerativePractices?.map((p, i) => (
            <div key={i} className="flex gap-3 text-xs text-green-300 bg-[#0d150d] rounded-lg px-3 py-2 border border-[#1a2e1a]">
              <span className="text-emerald-600 font-bold flex-shrink-0">↺</span>
              <span className="leading-relaxed">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
