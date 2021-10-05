import { useState, useEffect, useRef, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Polyline,
  Marker,
  Popup,
  Tooltip
} from 'react-leaflet'
import L from 'leaflet'

import '../css/Map.css'

import { center } from '../Constants'

// указываем путь к файлам marker
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.5.0/dist/images/'

const MapView = ({ path, bounds }) => {
  const [map, setMap] = useState(null)
  const [position, setPosition] = useState(center)

  const markerRef = useRef(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          setPosition(marker.getLatLng())
        }
      }
    }),
    []
  )

  useEffect(() => {
    if (map && path && bounds) {
      map.flyToBounds(bounds)
    } // eslint-disable-next-line
  }, [path, bounds])

  return (
    <div className='map'>
      <MapContainer
        center={center}
        zoom={9}
        scrollWheelZoom={true}
        whenCreated={setMap}
      >
        <LayersControl position='topright'>
          <LayersControl.BaseLayer checked name='Satellite'>
            <TileLayer
              attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url='http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='Grey Canvas'>
            <TileLayer
              attribution='&copy; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
              url='http://{s}.sm.mapstack.stamen.com/(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='OpenStreetMap.Mapnik'>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Marker
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
          draggable
          riseOnHover
        >
          <Popup>{center.join('; ')}</Popup>
          <Tooltip permanent direction={'top'} offset={{ x: -15, y: -20 }}>
            МКАД 0км
          </Tooltip>
        </Marker>
        <Polyline positions={path} />
      </MapContainer>
    </div>
  )
}

export default MapView
