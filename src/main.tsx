import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// MUI dark theme setup
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181c24',
      paper: '#23272f',
    },
    primary: {
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#e0e7ef',
    },
    secondary: {
      main: '#90caf9',
    },
  },
  shape: {
    borderRadius: 12,
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)