import { MapContainer, TileLayer, LayersControl, Polyline } from 'react-leaflet'
import L from 'leaflet'

import '../css/Map.css'

// указываем путь к файлам marker
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.5.0/dist/images/'

const center = [55.5, 37.5]

const Map = ({ path }) => {
  return (
    <div className='map'>
      <MapContainer center={center} zoom={3} scrollWheelZoom={true}>
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
        <Polyline positions={path} />
      </MapContainer>
    </div>
  )
}

export default Map
