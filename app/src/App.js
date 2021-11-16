import React, { Component } from 'react' ;
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import Container from '@material-ui/core/Container' ;
import { ethers } from "ethers";


import NavBar from './NavBar' ;
import Vote from './Vote' ;
import Ranking from './Ranking' ;


const theme = createTheme({
  typography: {
    fontFamily: 'Monospace'
  },
  palette: {
    primary: green
  }
});


const BACKEND_URL = "http://localhost:3001" ;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        page: 'vote',
        ranking: null,
        address: null
    }
  }

  componentDidMount = () => {
    this.loadRanking() ;
  }

  loadRanking = () => {
       let self = this ;
       fetch(BACKEND_URL+'/ranking', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
       }).then(response => response.json())
          .then(result => {self.receiveRanking(result);})
          .catch((error) => {alert('Error:', error);});
  }

  receiveRanking = (result) => {
    this.setState({ranking:result}) ;
  }

  connect = () => {
        let self = this ;
        self.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        self.provider.send("eth_requestAccounts", []).then(() => {
            self.signer = self.provider.getSigner() ;
            self.signer.getAddress().then((address) => {
                self.setState({address:address}) ;
            }).catch((error) => {
                alert(error) ;
            }) ;
        });
  }

  navigate = (page) => () => {
    this.setState({page:page}) ;
  }

  renderPage() {
    switch (this.state.page) {
        case 'vote': return <Vote /> ;
        case 'ranking': return <Ranking data={this.state.ranking} /> ;
        default: return "" ;
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
         <div>
            <NavBar navigate={this.navigate}
                    address={this.state.address}
                    connect={this.connect} />
            <Container style={{marginTop:'25px'}}>
                {this.renderPage()}
            </Container>
         </div>
      </ThemeProvider>
    )
  }
}
export default App


