import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#175ee2' },
    secondary: { main: '#7d2ae8' },
  },
  shape: { borderRadius: 14 },
  typography: { fontFamily: 'Inter, system-ui, Segoe UI, Roboto' },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 18 } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 700 } } },
  },
})
