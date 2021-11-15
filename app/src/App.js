import React, { Component } from 'react' ;
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';


import NavBar from './NavBar' ;


const theme = createTheme({
  typography: {
    fontFamily: 'Monospace'
  },
  palette: {
    primary: green
  }
});


class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
            <NavBar />
         </div>
      </ThemeProvider>
    )
  }
}
export default App


