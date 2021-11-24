import React, { Component } from 'react'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { green } from '@material-ui/core/colors'
import Container from '@material-ui/core/Container'
import { ethers } from 'ethers'

import NavBar from './NavBar'
import Vote from './Vote'
import Ranking from './Ranking'
import DeepStyle from './components/DeepStyle'
import { getBackend, CHAIN_RUNNERS_CONTRACT, CHAIN_RUNNERS_ABI, THE23_CONTRACT, THE23_ABI } from './utils'

const theme = createTheme({
  typography: {
    fontFamily: 'Monospace',
  },
  palette: {
    primary: green,
  },
})

const MAX_OFFSET = 100

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 'vote',
      ranking: null,
      lastUpdateTimestamp: null,
      runner1: null,
      runner2: null,
      voted: false,
      winner: 0,

      address: null,
      nonce: Date.now(),
      signature: null,
      numOwnedRunners: 0,
      ownedRunners: [],
      lookupOwners: true,

      isFirefox: false,
    }
  }

  componentDidMount = () => {
    this.checkFirefox()
    this.loadRanking()
    this.loadLastUpdateTimestamp()
  }

  checkFirefox = () => {
    let f = navigator.userAgent.search('Firefox')
    let state = {
      isFirefox: f > -1,
    }
    this.setState(state)
  }

  connect = () => {
    let state = {
      address: null,
      nonce: Date.now(),
      signature: null,
      numOwnedRunners: 0,
      ownedRunners: [],
      lookupOwners: true,
    }
    this.setState(state, this.doConnect)
  }

  doConnect = () => {
    let self = this
    self.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    self.provider.send('eth_requestAccounts', []).then(() => {
      self.signer = self.provider.getSigner()
      self.signer
        .getAddress()
        .then(address => {
          self.contractChainRunners = new ethers.Contract(
            CHAIN_RUNNERS_CONTRACT,
            CHAIN_RUNNERS_ABI,
            self.signer
          )
          self.contractThe23 = new ethers.Contract(THE23_CONTRACT, THE23_ABI, self.signer)
          self.setState({ address: address }, self.oneTimeSignature)
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  oneTimeSignature = () => {
    let self = this
    let message = "Hi, I'd like to login into datascience.art\n"
    message += 'Timestamp: ' + this.state.nonce
    self.signer
      .signMessage(message)
      .then(signature => {
        self.setState({ signature: signature }, self.checkNFTs)
        self.loadOwnedRunners()
      })
      .catch(error => {
        console.error(error)
      })
  }

  loadOwnedRunners = () => {
    let self = this
    if (self.state.lookupOwners) {
      self.contractChainRunners
        .tokenOfOwnerByIndex(self.state.address, self.state.numOwnedRunners)
        .then(result => {
          result = parseInt(result)
          console.log('tokenOfOwnerByIndex returned ' + result)
          let numOwnedRunners = self.state.numOwnedRunners + 1
          let ownedRunners = self.state.ownedRunners
          ownedRunners.push(result)
          let state = {
            numOwnedRunners: numOwnedRunners,
            ownedRunners: ownedRunners,
          }
          self.setState(state, self.loadOwnedRunners)
        })
        .catch(error => {
          console.log('tokenOfOwnerByIndex returned none')
          self.setState({ lookupOwners: false })
        })
    }
  }

  loadRanking = () => {
    let self = this
    fetch(getBackend() + '/ranking', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => {
        self.receiveRanking(result)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }
  loadLastUpdateTimestamp = () => {
    let self = this
    fetch(getBackend() + '/last_update_timestamp', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => {
        self.setState({ lastUpdateTimestamp: result })
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  receiveRanking = result => {
    result.sort((a, b) => b.rating - a.rating)
    let rank = 0
    let currentRating = null
    for (let i = 0; i < result.length; i++) {
      if (currentRating == null || currentRating > result[i].rating) {
        rank++
      }
      result[i].rank = rank
      currentRating = result[i].rating
    }
    this.setState({ ranking: result }, this.pickRunners)
  }

  pickRunners = () => {
    if (this.state.ranking == null) {
      return
    }
    let n = this.state.ranking.length
    let random1 = Math.floor(Math.random() * n)
    let direction = Math.random() > 0.5 ? 1 : -1
    let offset = Math.floor(Math.random() * MAX_OFFSET)
    let random2 = random1 + direction * offset
    random2 = Math.abs(random2) % n
    if (random1 === random2) {
      random2 = (random1 + direction) % n
    }
    let state = {
      voted: false,
      winner: 0,
      runner1: this.state.ranking[random1],
      runner2: this.state.ranking[random2],
    }
    this.setState(state)
  }

  navigate = page => () => {
    if (page === 'style' && !this.state.isFirefox) {
      alert('Sorry, this feature only works on Firefox.')
      return
    }
    this.setState({ page: page })
  }

  vote = winner => () => {
    let self = this
    let address = this.state.address
    let nonce = this.state.nonce
    let signature = this.state.signature
    let numOwnedRunners = this.state.numOwnedRunners
    if (address == null || signature == null || nonce == null || numOwnedRunners === 0) {
      alert(
        'Sorry, you can only vote after connecting your wallet, and you need to own at least one chain runner.'
      )
      return
    }

    let data = {
      runner1: this.state.runner1.id,
      runner2: this.state.runner2.id,
      result: winner,
      address: address,
      nonce: nonce,
      signature: signature,
    }
    fetch(getBackend() + '/submit_vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        self.voted(winner, result)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  voted = (winner, result) => {
    if (result.status === 'ok') {
      this.setState({ voted: true, winner: winner })
    } else {
      console.error(result.status)
    }
  }

  renderPage() {
    switch (this.state.page) {
      case 'vote':
        return (
          <Vote
            runner1={this.state.runner1}
            runner2={this.state.runner2}
            vote={this.vote}
            voted={this.state.voted}
            winner={this.state.winner}
            next={this.pickRunners}
          />
        )
      case 'ranking':
        return <Ranking data={this.state.ranking} lastUpdateTimestamp={this.state.lastUpdateTimestamp} />
      case 'style':
        return <DeepStyle />
      default:
        return ''
    }
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div>
          <NavBar
            navigate={this.navigate}
            address={this.state.address}
            connect={this.connect}
            ownedRunners={this.state.ownedRunners}
            isFirefox={this.state.isFirefox}
          />
          <Container style={{ marginTop: '25px' }}>{this.renderPage()}</Container>
        </div>
      </ThemeProvider>
    )
  }
}
export default App
