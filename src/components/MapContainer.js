import React, { useState, useEffect } from 'react'

import Map from './Map'

import { dataUrl, data } from '../Constants'

const MapContainer = () => {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    fetch(dataUrl)
      .then((response) => response.json())
      .then((responseJson) => {
        setOrders(responseJson)
        console.log(responseJson)
      })
      .catch((e) => {
        setOrders(data)
        console.error(e)
      })
  }, [])

  return (
    <div>
      <Map />
    </div>
  )
}

export default MapContainer
