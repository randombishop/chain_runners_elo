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


const BACKEND_URL = "" ;
const MAX_OFFSET = 100 ;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        page: 'vote',
        ranking: null,
        address: null,
        runner1: null,
        runner2: null,
        voted:false,
        winner:0
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
    result.sort((a,b) => a.rating - b.rating) ;
    let rank = 0 ;
    let currentRating = null ;
    for (let i=0 ; i<result.length ; i++) {
        if (currentRating==null || currentRating>result[i].rating) {
            rank++ ;
        }
        result[i].rank = rank ;
        currentRating = result[i].rating ;
    }
    this.setState({ranking:result}, this.pickRunners) ;
  }

  pickRunners = () => {
    if (this.state.ranking==null) {
        return ;
    }
    let n = this.state.ranking.length ;
    console.log('n', n) ;
    let random1 = Math.floor(Math.random() * n);
    let direction =  (Math.random()>0.5)?1:(-1) ;
    let offset = Math.floor(Math.random() * MAX_OFFSET);
    let random2 = (random1 + (direction*offset));
    random2 = Math.abs(random2)%n ;
    if (random1===random2) {
        random2 = (random1 + direction)%n ;
    }
    let state = {
        voted:false,
        winner:0,
        runner1: this.state.ranking[random1],
        runner2: this.state.ranking[random2]
    }
    this.setState(state) ;
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

  vote = (winner) => () => {
    let self=this;
    let data = {
        address: this.state.address,
        runner1: this.state.runner1.id,
        runner2: this.state.runner2.id,
        result: winner
    } ;
    fetch(BACKEND_URL+'/submit_vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
       }).then(response => response.json())
          .then(result => {self.voted(winner,result);})
          .catch((error) => {alert('Error:', error);});
  }

  voted = (winner, result) => {
    if (result.status==='ok') {
        this.setState({voted:true,winner:winner}) ;
    } else {
        alert(result.status) ;
    }
  }

  renderPage() {
    switch (this.state.page) {
        case 'vote': return <Vote runner1={this.state.runner1}
                                  runner2={this.state.runner2}
                                  vote={this.vote}
                                  voted={this.state.voted}
                                  winner={this.state.winner}
                                  next={this.pickRunners}
                            /> ;
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


