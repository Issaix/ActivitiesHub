import { Box, Container, CssBaseline } from '@mui/material'
import NavBar from './NavBar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'

function App() {
  return (
    <Box sx={{ bgcolor: '#eeeee', minHeight: '100vh' }}>
      <CssBaseline />
      <NavBar />
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <ActivityDashboard />
      </Container>
    </Box>
  )
}

export default App
