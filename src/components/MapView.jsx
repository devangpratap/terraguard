import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import L from 'leaflet'

// Fix default marker icons broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function FlyTo({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.flyTo(position, 11, { duration: 1.5 })
  }, [position, map])
  return null
}

export default function MapView({ location }) {
  const position = location ? [location.lat, location.lon] : [20, 0]

  return (
    <MapContainer
      center={position}
      zoom={location ? 11 : 2}
      className="w-full h-full rounded-xl"
      style={{ background: '#0d1a0d' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {location && (
        <>
          <FlyTo position={[location.lat, location.lon]} />
          <Marker position={[location.lat, location.lon]}>
            <Popup>{location.name}</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  )
}
