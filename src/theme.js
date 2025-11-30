import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" }, // blue like your design
    secondary: { main: "#f50057" }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: { defaultProps: { elevation: 1 } }
  }
});

export default theme;
