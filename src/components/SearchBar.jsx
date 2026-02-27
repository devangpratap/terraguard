import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    // Geocode using Nominatim (OpenStreetMap, no auth)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const results = await res.json()
    if (!results.length) {
      alert('Location not found. Try a more specific search.')
      return
    }
    const { lat, lon, display_name } = results[0]
    onSearch({ lat: parseFloat(lat), lon: parseFloat(lon), name: display_name })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a location, farm, or address..."
        className="flex-1 bg-[#111a11] border border-[#2d4a2d] rounded-lg px-4 py-3 text-sm text-green-100 placeholder-green-900 focus:outline-none focus:border-green-500 transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  )
}
