const stats = [
  { value: '70%', label: 'of Earth\'s topsoil could be gone within 60 years' },
  { value: '95%', label: 'of our food comes from soil' },
  { value: '1000yr', label: 'to form 1 inch of topsoil naturally' },
  { value: '$8T', label: 'annual economic cost of soil degradation globally' },
]

const impacts = [
  {
    title: 'Food Security',
    icon: '🌾',
    text: 'Degraded soil produces less food per acre. As topsoil erodes, crop yields drop — threatening food supply for the 10 billion people expected by 2050.',
  },
  {
    title: 'Climate Change',
    icon: '🌡️',
    text: 'Healthy soil stores more carbon than all the world\'s forests combined. When soil degrades, that stored CO₂ releases into the atmosphere, accelerating warming.',
  },
  {
    title: 'Water Cycles',
    icon: '💧',
    text: 'Topsoil acts like a sponge. Degraded soil can\'t absorb rainfall, causing floods, droughts, and contaminating groundwater with runoff.',
  },
  {
    title: 'Irreversibility',
    icon: '⏳',
    text: 'Topsoil loss is permanent on human timescales. Once gone, it takes hundreds to thousands of years to rebuild — making prevention the only real solution.',
  },
]

export default function WhyItMatters() {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-green-400 leading-relaxed border-l-2 border-green-700 pl-3">
        Soil degradation is the silent crisis underneath the climate emergency. Unlike CO₂ emissions,
        it has no global treaty, no Paris Agreement — yet it threatens the foundation of all terrestrial life.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#111a11] border border-[#1a2e1a] rounded-lg px-3 py-3">
            <p className="text-green-400 font-bold text-lg leading-none">{s.value}</p>
            <p className="text-green-700 text-xs mt-1 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Impact cards */}
      <div className="flex flex-col gap-3">
        {impacts.map((item, i) => (
          <div key={i} className="bg-[#111a11] border border-[#1a2e1a] rounded-lg px-4 py-3">
            <p className="text-sm font-semibold text-green-200 mb-1">{item.title}</p>
            <p className="text-xs text-green-500 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-green-800 text-center">
        Sources: FAO, IPCC, UN Convention to Combat Desertification
      </p>
    </div>
  )
}
