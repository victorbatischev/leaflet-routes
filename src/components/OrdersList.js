import { useState } from 'react'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocationIcon from '@mui/icons-material/MyLocation'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const OrdersList = ({
  orders,
  dates,
  showRouteOnMap,
  setSelectedDate,
  setSelectedDriver,
  setOrders
}) => {
  const [expanded, setExpanded] = useState(null)
  const [expandedInner, setExpandedInner] = useState(null)

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : null)
  }

  const handleChangeInner = (index) => (event, isExpanded) => {
    setExpandedInner(isExpanded ? index : null)
  }

  function onDragEnd(result) {
    if (!result.destination) {
      let shouldRemove = window.confirm(
        'Вы действительно хотите удалить данный адрес из списка?'
      )
      if (shouldRemove) {
        const tempOrders = [...orders]
        tempOrders[expanded][expandedInner].splice(result.source.index, 1)
        setOrders([...tempOrders])
        return window.alert('Адрес успешно удалён!')
      }
    } else if (
      result.destination.index === result.source.index ||
      result.destination.index === 0
    ) {
    } else {
      const tempOrders = [...orders]
      const [removed] = tempOrders[expanded][expandedInner].splice(
        result.source.index,
        1
      )
      tempOrders[expanded][expandedInner].splice(
        result.destination.index,
        0,
        removed
      )
      setOrders([...tempOrders])
    }
  }

  const AddressList = ({ addresses }) =>
    addresses.map((order, id) => (
      <Draggable
        draggableId={order.id}
        index={id}
        key={id.toString()}
        isDragDisabled={id === 0}
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={`${id}. ${order.address}`} />
              </ListItemButton>
            </ListItem>
          </div>
        )}
      </Draggable>
    ))

  return dates.slice(0, orders.length).map((item, index) => (
    <Accordion
      key={index.toString()}
      expanded={expanded === index}
      onChange={handleChange(index)}
    >
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
          <Accordion
            expanded={expandedInner === idx}
            onChange={handleChangeInner(idx)}
            key={`inner-${idx}`}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${idx}bh-content-inner`}
              id={`panel${idx}bh-header-inner`}
            >
              <Typography sx={{ width: '100%', flexShrink: 0 }}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDate(new Date(item).toLocaleDateString('ru'))
                    setSelectedDriver(el[0].driver.name)
                    showRouteOnMap(el)
                  }}
                  endIcon={<LocationIcon />}
                  style={{
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    textAlign: 'left'
                  }}
                >
                  {el[0].driver.name}
                </Button>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId='list'>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <AddressList addresses={el} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </AccordionDetails>
          </Accordion>
        ))}
      </AccordionDetails>
    </Accordion>
  ))
}

export default OrdersList
