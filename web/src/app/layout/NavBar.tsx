import { Group } from '@mui/icons-material'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  MenuItem,
  MenuList,
} from '@mui/material'
import { NavLink } from 'react-router'

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundImage: 'linear-gradient(90deg, #183D3B 0%, #146B70 100%)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <MenuList>
              <MenuItem
                component={NavLink}
                to="/"
                sx={{ display: 'flex', gap: 2 }}
              >
                <Group fontSize="large" />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Activities
                </Typography>
              </MenuItem>
            </MenuList>
            <MenuList disablePadding sx={{ display: 'flex' }}>
              <MenuItem
                component={NavLink}
                to="/createActivity"
                sx={{ fontSize: '1.2rem', textTransform: 'uppercase' }}
              >
                Create Activity
              </MenuItem>
              <MenuItem
                component={NavLink}
                to="/about"
                sx={{ fontSize: '1.2rem', textTransform: 'uppercase' }}
              >
                About
              </MenuItem>
              <MenuItem sx={{ fontSize: '1.2rem', textTransform: 'uppercase' }}>
                Contact
              </MenuItem>
            </MenuList>
            User Menu
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}
