import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import theme from './common/theme/themes';
import AppRouter from './routes/AppRouter';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon */}
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
