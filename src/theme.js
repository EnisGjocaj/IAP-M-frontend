
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002F6C', // Dark Blue
    },
    secondary: {
      main: '#F7E03C', // Yellow
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

export default theme;
