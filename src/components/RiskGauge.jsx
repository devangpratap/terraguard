export default function RiskGauge({ score, level }) {
  const color = {
    Low: '#22c55e',
    Moderate: '#eab308',
    High: '#f97316',
    Critical: '#ef4444',
  }[level] ?? '#6b7280'

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#1a2e1a" strokeWidth="12" />
        <circle
          cx="70" cy="70" r="54"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="70" y="65" textAnchor="middle" fill={color} fontSize="28" fontWeight="bold" fontFamily="system-ui">
          {score}
        </text>
        <text x="70" y="85" textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="system-ui">
          / 100
        </text>
      </svg>
      <span
        className="text-sm font-bold px-3 py-1 rounded-full"
        style={{ background: `${color}22`, color }}
      >
        {level} Risk
      </span>
    </div>
  )
}
