import { YANDEX_KEY, ROUTES_KEY } from './Constants'

var polyline = require('@mapbox/polyline')

const getCoordinate = (address) => {
  if (address === 'МКАД 0км') return ['37.842919', '55.777142']

  return fetch(
    `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${YANDEX_KEY}&geocode=${address}`
  )
    .then((response) => response.json())
    .then((responseJson) => {
      let address =
        responseJson.response.GeoObjectCollection.featureMember[0].GeoObject
          .Point.pos
      let lng = address.split(' ')[0]
      let lat = address.split(' ')[1]

      return [lng, lat]
    })
}

const getRoute = (coords) => {
  return fetch(
    'https://api.openrouteservice.org/v2/directions/driving-car/json',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ROUTES_KEY
      },
      body: JSON.stringify({ coordinates: coords })
    }
  )
    .then((response) => response.json())
    .then((responseJson) => {
      var result = responseJson.routes[0]
      var bbox = responseJson.bbox.reverse()
      return {
        polyline: polyline.decode(result.geometry),
        bounds: [bbox.splice(0, 2), bbox.splice(-2)],
        coordinates: coords,
        distance: result.summary.distance
          ? (result.summary.distance / 1000).toFixed(1)
          : 0
      }
    })
}

export const drawRoutes = (items) => {
  // Преобразуем каждый URL в промис, возвращённый fetch
  let requests = items.map((item) => getCoordinate(item.address))

  // Promise.all будет ожидать выполнения всех промисов
  return Promise.all(requests).then((responses) => {
    console.log(responses)
    return getRoute(responses)
  })
}
