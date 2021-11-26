import React, { Component } from 'react'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { green } from '@material-ui/core/colors'
import Container from '@material-ui/core/Container'
import { ethers } from 'ethers'

import NavBar from './components/NavBar'
import Vote from './components/Vote'
import Ranking from './components/Ranking'
import DeepStyle from './components/DeepStyle'
import {
  CHAIN_RUNNERS_CONTRACT,
  CHAIN_RUNNERS_ABI,
  THE23_CONTRACT,
  THE23_ABI,
  backendPrefix,
  getRandomRunners,
} from './utils'
import { IRunner, IAppState, TNavigateFn, TVoteFn, EVoteNumber, TConnectFn } from 'types'

const theme = createTheme({
  typography: {
    fontFamily: 'Monospace',
  },
  palette: {
    primary: green,
  },
})

class App extends Component<{}, IAppState> {
  private contractChainRunners?: ethers.Contract
  private contractThe23?: ethers.Contract
  private provider?: ethers.providers.Web3Provider
  private signer?: ethers.providers.JsonRpcSigner

  constructor(props) {
    super(props)
    this.state = {
      page: 'vote',
      ranking: undefined,
      lastUpdateTimestamp: undefined,
      runner1: undefined,
      runner2: undefined,
      voted: false,
      winner: 0,

      address: undefined,
      nonce: Date.now(),
      signature: undefined,
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
    const f = navigator.userAgent.search('Firefox')
    const state = {
      isFirefox: f > -1,
    }
    this.setState(state)
  }

  connect: TConnectFn = () => {
    const state = {
      address: undefined,
      nonce: Date.now(),
      signature: undefined,
      numOwnedRunners: 0,
      ownedRunners: [],
      lookupOwners: true,
    }
    this.setState(state, this.doConnect)
  }

  doConnect = () => {
    const self = this

    // @ts-expect-error
    this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    // @ts-expect-error
    this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any')

    this.provider.send('eth_requestAccounts', []).then(() => {
      if (!self.provider) return

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
          self.setState({ address }, self.oneTimeSignature)
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  oneTimeSignature = () => {
    if (!this.signer) return

    const self = this
    const message = `Hi, I'd like to login into datascience.art\nTimestamp: ${this.state.nonce}`

    this.signer
      .signMessage(message)
      .then(signature => {
        self.setState({ signature })
        self.loadOwnedRunners()
      })
      .catch(error => {
        console.error(error)
      })
  }

  loadOwnedRunners = () => {
    if (!this.state.lookupOwners || !this.contractChainRunners) return

    const self = this

    if (this.state.lookupOwners) {
      this.contractChainRunners
        .tokenOfOwnerByIndex(self.state.address, self.state.numOwnedRunners)
        .then(result => {
          result = parseInt(result)
          console.log('tokenOfOwnerByIndex returned ' + result)
          const state = {
            numOwnedRunners: self.state.numOwnedRunners + 1,
            ownedRunners: self.state.ownedRunners.concat(result),
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
    const self = this
    fetch(backendPrefix + '/ranking', {
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
    const self = this
    fetch(backendPrefix + '/last_update_timestamp', {
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

  receiveRanking = (result: IRunner[]) => {
    result.sort((a, b) => b.rating - a.rating)

    let rank = 0
    let currentRating: number | null = null

    for (let i = 0; i < result.length; i++) {
      if (currentRating === null || currentRating > result[i].rating) {
        rank++
      }
      result[i].rank = rank
      currentRating = result[i].rating
    }
    this.setState({ ranking: result }, this.pickRunners)
  }

  pickRunners = () => {
    if (this.state.ranking == null) return

    const { random1, random2 } = getRandomRunners(this.state.ranking)

    const state = {
      voted: false,
      winner: 0,
      runner1: this.state.ranking[random1],
      runner2: this.state.ranking[random2],
    }

    this.setState(state)
  }

  navigate: TNavigateFn = page => () => {
    if (page === 'style' && !this.state.isFirefox) {
      alert('Sorry, this feature only works on Firefox.')
      return
    }
    this.setState({ page })
  }

  vote: TVoteFn = winner => () => {
    if (!this.state.runner1 || !this.state.runner2) return

    const self = this

    const { address, nonce, signature, numOwnedRunners } = this.state

    if (address == null || signature == null || nonce == null || numOwnedRunners === 0) {
      alert(
        'Sorry, you can only vote after connecting your wallet, and you need to own at least one chain runner.'
      )
      return
    }

    const data = {
      runner1: this.state.runner1.id,
      runner2: this.state.runner2.id,
      result: winner,
      address,
      nonce,
      signature,
    }
    fetch(backendPrefix + '/submit_vote', {
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

  voted = (winner: EVoteNumber, result: { status: string }) => {
    if (result.status === 'ok') {
      this.setState({ voted: true, winner })
    } else {
      console.error(result.status)
    }
  }

  renderPage() {
    switch (this.state.page) {
      case 'vote':
        return !this.state.runner1 || !this.state.runner2 ? (
          <React.Fragment></React.Fragment>
        ) : (
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
          />
          <Container style={{ marginTop: '25px' }}>{this.renderPage()}</Container>
        </div>
      </ThemeProvider>
    )
  }
}
export default App
