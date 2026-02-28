const urgencyColor = {
  'Monitor':   { text: 'text-green-400',  bg: 'bg-green-400/10  border-green-400/30'  },
  'Act Soon':  { text: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
  'Act Now':   { text: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  'Emergency': { text: 'text-red-400',    bg: 'bg-red-400/10    border-red-400/30'    },
}

export default function FarmerPanel({ farmerImpact, location }) {
  if (!farmerImpact) return null

  const urgency = urgencyColor[farmerImpact.urgency] ?? urgencyColor['Monitor']

  return (
    <div className="flex flex-col gap-5">
      {/* Urgency banner */}
      <div className={`rounded-lg border px-4 py-3 flex items-center justify-between ${urgency.bg}`}>
        <div>
          <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Action Level</p>
          <p className={`text-lg font-bold mt-0.5 ${urgency.text}`}>{farmerImpact.urgency}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-600 uppercase tracking-wider font-semibold">Viable Years Left</p>
          <p className={`text-lg font-bold mt-0.5 ${urgency.text}`}>{farmerImpact.viableYearsRemaining}</p>
        </div>
      </div>

      {/* Yield impact */}
      <div className="bg-[#111a11] rounded-lg px-4 py-3 border border-[#1a2e1a]">
        <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-1">Projected Yield Impact</p>
        <p className="text-sm text-orange-300 font-semibold">{farmerImpact.cropYieldImpact}</p>
        <p className="text-xs text-green-700 mt-2">if current land management continues unchanged</p>
      </div>

      {/* Economic risk */}
      <div className="bg-[#111a11] rounded-lg px-4 py-3 border border-[#1a2e1a]">
        <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-1">Economic Risk</p>
        <p className="text-sm text-green-300 leading-relaxed">{farmerImpact.economicRisk}</p>
      </div>

      {/* Recommended crops */}
      <div>
        <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-2">Crops Suited to Current Soil</p>
        <div className="flex flex-wrap gap-2">
          {farmerImpact.recommendedCrops?.map((crop, i) => (
            <span key={i} className="bg-green-900/40 border border-green-800/50 text-green-300 text-xs px-3 py-1.5 rounded-full">
              {crop}
            </span>
          ))}
        </div>
      </div>

      {/* What to do */}
      <div className="bg-[#0d150d] rounded-lg border border-[#1a2e1a] px-4 py-3">
        <p className="text-xs text-green-600 uppercase tracking-wider font-semibold mb-2">What This Means For You</p>
        <ul className="flex flex-col gap-2 text-xs text-green-400">
          <li className="flex gap-2"><span className="text-green-700">▸</span> Get a soil test done to confirm these readings with a local agronomist</li>
          <li className="flex gap-2"><span className="text-green-700">▸</span> Check USDA NRCS or local agricultural extension office for subsidies on soil restoration</li>
          <li className="flex gap-2"><span className="text-green-700">▸</span> Consider crop rotation and cover cropping to rebuild organic matter</li>
        </ul>
      </div>
    </div>
  )
}
