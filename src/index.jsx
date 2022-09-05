import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core';
import GlobalStyle from './styles/GlobalStyle';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['"Montserrat"', 'sans-serif'].join(',')
   }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <GlobalStyle/>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root')
);
