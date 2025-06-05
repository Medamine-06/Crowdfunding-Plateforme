
import './index.css'
import AppRoutes from './AppRoutes'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  
  return (
    <>
      <NotificationProvider>
        <AppRoutes/>
      </NotificationProvider>
    </>
  )
}

export default App
