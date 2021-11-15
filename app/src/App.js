import React, { Component } from 'react' ;
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container' ;

import NavBar from './NavBar' ;
import Vote from './Vote' ;

const theme = createTheme({
  typography: {
    fontFamily: 'Monospace'
  },
  palette: {
    primary: green
  }
});


class App extends Component {

  renderPage() {
    return <Vote />
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
         <div>
            <NavBar />
            <Container style={{marginTop:'25px'}}>
                {this.renderPage()}
            </Container>
         </div>
      </ThemeProvider>
    )
  }
}
export default App


