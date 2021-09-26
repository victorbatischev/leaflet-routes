import { useState, useEffect } from 'react'

import MapContainer from './components/MapContainer'
import Auth from './components/Auth'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('AUTH_TOKEN')) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  if (isLoggedIn === null) {
    return <div>Загрузка...</div>
  }

  return isLoggedIn ? <MapContainer /> : <Auth setIsLoggedIn={setIsLoggedIn} />
}
