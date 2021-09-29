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

const OrdersList = ({ orders, dates, drawRoutes }) => {
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
                  onClick={() => drawRoutes(el)}
                  endIcon={<LocationIcon />}
                >
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

export default OrdersList
