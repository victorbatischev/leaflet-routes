import React, { useState, useEffect, useRef } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocationIcon from '@mui/icons-material/MyLocation'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import Map from './Map'

import { dataUrl } from '../Constants'

const MapContainer = () => {
  const [orders, setOrders] = useState(null)
  const [dates, setDates] = useState(null)
  const [ordersByDate, setOrdersByDate] = useState(null)
  const [ordersByDriver, setOrdersByDriver] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [totalDistance, setTotalDistance] = useState(0)

  const inputNumber = useRef(null)

  const searchOrders = (number) => {
    fetch(dataUrl + (number ? `?carNumber=${number}` : ''))
      .then((response) => response.json())
      .then((responseJson) => {
        setOrders(responseJson)
        console.log(responseJson)
      })
      .catch((e) => {
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
        return uniqueDrivers.map((driver) =>
          orders.filter((order) => order.driver.id === driver)
        )
      })

      setOrdersByDriver(filteredOrders)
      console.log(filteredOrders)
    }
  }, [ordersByDate])

  const OrdersList = ({ orders }) => {
    return dates.slice(0, orders.length).map((item, index) => (
      <Accordion key={index.toString()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}bh-content`}
          id={`panel${index}bh-header`}
        >
          <Typography sx={{ width: '33%', flexShrink: 0 }}>
            {new Date(item).toLocaleDateString('ru')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {orders[index]?.map((el, idx) => (
            <Accordion key={`inner-${idx}`}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${idx}bh-content-inner`}
                id={`panel${idx}bh-header-inner`}
              >
                <Typography sx={{ width: '100%', flexShrink: 0 }}>
                  <Button endIcon={<LocationIcon />}>
                    {el[0].driver.name}
                  </Button>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {el.map((order, id) => (
                    <ListItem disablePadding key={id.toString()}>
                      <ListItemButton>
                        <ListItemText primary={order.address} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    ))
  }

  return (
    <Container>
      <Box style={{ marginTop: 30 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              id='outlined-name'
              label='Номер автомобиля'
              inputRef={inputNumber}
            />
          </Grid>
          <Grid item xs={12} sm={2} md={2} xl={1}>
            <Button
              onClick={() => {
                searchOrders(inputNumber.current.value)
              }}
              variant='contained'
              size='medium'
            >
              Поиск
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              onClick={() => {
                searchOrders()
              }}
              variant='outlined'
              size='medium'
            >
              Сбросить
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            {ordersByDriver ? (
              <OrdersList orders={ordersByDriver} />
            ) : (
              <div>Загрузка...</div>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <div>
              Водитель: <b>{selectedDriver}</b>
            </div>
            <div>
              Дата: <b>{selectedDate}</b>
            </div>
            <Map />
            <div>
              Километраж: <b>{totalDistance}</b> км
            </div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default MapContainer
