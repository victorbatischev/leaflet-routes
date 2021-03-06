import React, { useState, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import MapView from './MapView'
import OrdersList from './OrdersList'
import Loader from './Loader'

import { dataUrl, data } from '../Constants'
import { drawRoutes } from '../Utils'

const MapContainer = () => {
  const [orders, setOrders] = useState(null)
  const [dates, setDates] = useState(null)
  const [ordersByDate, setOrdersByDate] = useState(null)
  const [ordersByDriver, setOrdersByDriver] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [totalDistance, setTotalDistance] = useState(0)
  const [path, setPath] = useState([])
  const [bounds, setBounds] = useState(null)
  const [coordinates, setCoordinates] = useState([])

  const inputNumber = useRef(null)

  const searchOrders = (number) => {
    fetch(dataUrl + (number ? `?carNumber=${number}` : ''))
      .then((response) => response.json())
      .then((responseJson) => {
        setOrders(responseJson)
        console.log(responseJson)
      })
      .catch((e) => {
        setOrders(data)
        console.error(e)
      })
  }

  // получаем массив всех заказов
  useEffect(() => {
    searchOrders()
  }, [])

  // получаем массив уникальных дат
  useEffect(() => {
    if (orders && orders.length) {
      const uniqueDates = [...new Set(orders.map((item) => item.date))]
      uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      setDates(uniqueDates)
    }
  }, [orders])

  // фильтруем исходный массив заказов по датам
  useEffect(() => {
    if (dates && dates.length) {
      const filteredOrders = dates.map((date) =>
        orders.filter((order) => order.date === date)
      )
      setOrdersByDate(filteredOrders)
    } // eslint-disable-next-line
  }, [dates])

  // полученный массив фильтруем по водителю
  useEffect(() => {
    if (ordersByDate && ordersByDate.length) {
      const filteredOrders = ordersByDate.map((orders) => {
        // получаем массив уникальных водителей по каждой дате
        const uniqueDrivers = [...new Set(orders.map((item) => item.driver.id))]
        // получаем массив заказов, отфильтрованный по водителю
        return uniqueDrivers.map((driver) => {
          const orderMapArray = [
            ...new Map(
              orders
                .filter((order) => order.driver.id === driver)
                .map((item) => [item.address, item])
            ).values()
          ]
          orderMapArray.unshift({
            ...orderMapArray[0],
            id: orderMapArray[0].id + '-init',
            address: 'МКАД 0км'
          })
          return orderMapArray
        })
      })

      setOrdersByDriver(filteredOrders)
      console.log(filteredOrders)
    }
  }, [ordersByDate])

  const showRouteOnMap = async (el) => {
    setPath([])
    setCoordinates([])
    setTotalDistance(0)
    const { polyline, bounds, distance, coordinates } = await drawRoutes(el)
    setPath(polyline)
    setBounds(bounds)
    setTotalDistance(distance)
    setCoordinates(coordinates)
  }

  return (
    <Container style={{ padding: 0, marginLeft: 50, maxWidth: '95vw' }}>
      <Box style={{ marginTop: 30 }}>
        <Grid container spacing={4} marginBottom={6}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id='outlined-name'
              label='Номер автомобиля'
              inputRef={inputNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} sm={6} marginTop={-2}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Button
                onClick={() => searchOrders(inputNumber.current.value)}
                variant='contained'
                size='large'
                style={{ marginRight: 20 }}
              >
                Поиск
              </Button>
              <Button
                onClick={() => {
                  setSelectedDate('')
                  setSelectedDriver('')
                  setTotalDistance(0)
                  setPath([])
                  setBounds(null)
                  searchOrders()
                }}
                variant='outlined'
                size='large'
              >
                Сбросить
              </Button>
            </div>
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            {ordersByDriver ? (
              <OrdersList
                orders={ordersByDriver}
                dates={dates}
                setSelectedDate={setSelectedDate}
                setSelectedDriver={setSelectedDriver}
                showRouteOnMap={showRouteOnMap}
                setOrders={setOrdersByDriver}
              />
            ) : (
              <div>Загрузка...</div>
            )}
          </Grid>
          <Grid item xs={12} sm={6} marginTop={'-160px'}>
            {selectedDriver && !coordinates.length && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1000
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    position: 'absolute',
                    top: 200,
                    padding: 50,
                    width: '75%',
                    background: '#0008'
                  }}
                >
                  <h3 style={{ color: '#f8f8f8' }}>
                    Подождите, пожалуйста, идёт построение маршрута...
                  </h3>
                  <Loader />
                </div>
              </div>
            )}
            <div>
              Водитель: <b>{selectedDriver || 'Не выбран'}</b>
            </div>
            <div style={{ marginBottom: 20 }}>
              <span>
                Дата: <b>{selectedDate || 'Не выбрана'}</b>
              </span>
              <span style={{ marginLeft: 20 }}>
                Итоговое расстояние: <b>{totalDistance}</b> км
              </span>
            </div>
            <MapView
              path={path}
              bounds={bounds}
              coords={coordinates}
              setPath={setPath}
              setBounds={setBounds}
              setTotalDistance={setTotalDistance}
            />
            <div style={{ height: 20 }} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default MapContainer
