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

import { getRoute } from '../Utils'

// указываем путь к файлам marker
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.5.0/dist/images/'

const MapView = ({
  path,
  bounds,
  coords,
  setPath,
  setBounds,
  setTotalDistance
}) => {
  const [map, setMap] = useState(null)
  const [position, setPosition] = useState(center)

  const markerRef = useRef(null)

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const tempPosition = Object.values(marker.getLatLng()).map((item) =>
            item.toFixed(6).toString()
          )
          setPosition(tempPosition)
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

  useEffect(() => {
    setPosition(center)
  }, [coords])

  useEffect(() => {
    if (coords && coords.length && position) {
      let tempCoords = [...coords]
      tempCoords[0] = position
      tempCoords = tempCoords.map((item) => item.reverse())
      console.log(tempCoords)

      async function getData() {
        const { polyline, bounds, distance } = await getRoute(tempCoords)
        setPath(polyline)
        setBounds(bounds)
        setTotalDistance(distance)
      }

      getData()
    } // eslint-disable-next-line
  }, [position])

  var greenIcon = L.icon({
    iconUrl:
      'https://upload.wikimedia.org/wikipedia/commons/f/f2/678111-map-marker-512.png',
    iconSize: [40, 40],
    tooltipAnchor: [15, -10],
    popupAnchor: [0, -20]
  })

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
        {coords &&
          coords.map((item, index) =>
            index === 0 ? (
              <Marker
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}
                draggable
                riseOnHover
                key={index.toString()}
                icon={greenIcon}
              >
                <Popup>{position.join('; ')}</Popup>
                <Tooltip
                  permanent
                  direction={'top'}
                  offset={{ x: -15, y: -10 }}
                >
                  <b style={{ fontSize: 14 }}>0</b>
                </Tooltip>
              </Marker>
            ) : (
              <Marker position={item} riseOnHover key={index.toString()}>
                <Popup>{item.join('; ')}</Popup>
                <Tooltip
                  permanent
                  direction={'top'}
                  offset={{ x: -15, y: -10 }}
                >
                  <b style={{ fontSize: 14 }}>{index}</b>
                </Tooltip>
              </Marker>
            )
          )}
        <Polyline positions={path} />
      </MapContainer>
    </div>
  )
}

export default MapView
