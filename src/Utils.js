import { API_KEY } from './Constants'

export const getCoordinate = (address) => {
  fetch(
    `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${API_KEY}&geocode=${address}`
  ).then((response) => {
    // let address =
    //   response.data.response.GeoObjectCollection.featureMember[0].GeoObject
    //     .Point.pos
    // self.location.lat = address.split(' ')[1]
    // self.location.lng = address.split(' ')[0]
    console.log(response)
  })
}
