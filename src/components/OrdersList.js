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
  setSelectedDriver
}) => {
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
                <Button
                  onClick={() => {
                    setSelectedDate(new Date(item).toLocaleDateString('ru'))
                    setSelectedDriver(el[0].driver.name)
                    showRouteOnMap(el)
                  }}
                  endIcon={<LocationIcon />}
                >
                  {el[0].driver.name}
                </Button>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DragDropContext onDragEnd={() => {}}>
                <Droppable droppableId='list'>
                  {(provided) => (
                    <div ref={provided.innerRef}>
                      {el.map((order, id) => (
                        <Draggable
                          draggableId={order.id}
                          index={id}
                          key={id.toString()}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ListItem disablePadding>
                                <ListItemButton>
                                  <ListItemText
                                    primary={`${id}. ${order.address}`}
                                  />
                                </ListItemButton>
                              </ListItem>
                            </div>
                          )}
                        </Draggable>
                      ))}
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
