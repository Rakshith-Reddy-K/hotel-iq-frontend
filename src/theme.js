import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { 
      main: "#1e293b",      // Dark slate from Guest Portal sidebar
      dark: "#0f172a",      // Darker slate for hover states
      light: "#334155",     // Lighter slate
      contrastText: "#ffffff"
    },
    secondary: { 
      main: "#2563eb",      // Light blue for logo, chatbot, pricing
      dark: "#1d4ed8",
      light: "#3b82f6"
    },
    warning: {
      main: "#FFA726",      // Yellow/orange for star ratings
      dark: "#F57C00",
      light: "#FFB74D"
    },
    background: {
      default: "#f5f5f5",   // Light gray background
      paper: "#ffffff"
    },
    text: {
      primary: "#1e293b",   // Dark slate for text
      secondary: "#64748b"  // Gray for secondary text
    }
  },
  shape: { 
    borderRadius: 12 
  },
  components: {
    MuiPaper: { 
      defaultProps: { 
        elevation: 1 
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px'
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',  // Dark slate like Guest Portal sidebar
          borderRadius: 0
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500
        }
      }
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 700
    },
    h6: {
      fontWeight: 700
    }
  }
});

export default theme;