import React, { Component, useEffect, useState } from 'react'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { green } from '@material-ui/core/colors'
import Container from '@material-ui/core/Container'
import { ethers } from 'ethers'

import NavBar from './components/NavBar'
import Vote, { VoteNumber } from './components/Vote'
import Ranking from './components/Ranking'
import DeepStyle from './components/DeepStyle'
import { getBackend, CHAIN_RUNNERS_CONTRACT, CHAIN_RUNNERS_ABI, THE23_CONTRACT, THE23_ABI } from './utils'
import { RunnerType } from 'components/Runner'

const theme = createTheme({
  typography: {
    fontFamily: 'Monospace',
  },
  palette: {
    primary: green,
  },
})

const MAX_OFFSET = 100

const App = () => {
  const [page, setPage] = useState('vote')
  const [ranking, setRanking] = useState<any[] | null>(null) // TODO: Type this
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState(null)
  const [runner1, setRunner1] = useState<RunnerType | null>(null)
  const [runner2, setRunner2] = useState<RunnerType | null>(null)
  const [voted, setVoted] = useState(false)
  const [winner, setWinner] = useState<VoteNumber>(0)
  const [address, setAddress] = useState<string | null>(null)
  const [nonce, setNonce] = useState(Date.now())
  const [signature, setSignature] = useState<string | null>(null)
  const [numOwnedRunners, setNumOwnedRunners] = useState(0)
  const [ownedRunners, setOwnedRunners] = useState([])
  const [lookupOwners, setLookupOwners] = useState(true)
  const [isFirefox, setIsFirefox] = useState(false)

  const [contractChainRunners, setContractChainRunners] = useState<ethers.Contract | null>(null)
  const [contractThe23, setContractThe23] = useState<ethers.Contract | null>(null)

  // equivalent to componentDidMount

  useEffect(() => {
    setIsFirefox(navigator.userAgent.search('Firefox') > -1)
    loadRanking()
    loadLastUpdateTimestamp()
  }, [])

  const connect = () => {
    setAddress(null)
    setNonce(Date.now())
    setSignature(null)
    setNumOwnedRunners(numOwnedRunners)
    setOwnedRunners([])
    setLookupOwners(true)

    doConnect()
  }

  const doConnect = () => {
    const provider = new ethers.providers.Web3Provider(
      // @ts-expect-error
      window.ethereum,
      'any'
    )

    provider.send('eth_requestAccounts', []).then(() => {
      const signer = provider.getSigner()
      signer
        .getAddress()
        .then(address => {
          setContractChainRunners(new ethers.Contract(CHAIN_RUNNERS_CONTRACT, CHAIN_RUNNERS_ABI, signer))
          setContractThe23(new ethers.Contract(THE23_CONTRACT, THE23_ABI, signer))

          setAddress(address)

          oneTimeSignature(signer)
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  const oneTimeSignature = (signer: ethers.providers.JsonRpcSigner) => {
    let message = `Hi, I'd like to login into datascience.art\nTimestamp: ${nonce}`

    signer
      .signMessage(message)
      .then(signature => {
        setSignature(signature)
        // checkNFTs() // this didn't exist?
        loadOwnedRunners()
      })
      .catch(error => console.error(error))
  }

  const loadOwnedRunners = () => {
    if (lookupOwners && contractChainRunners) {
      contractChainRunners
        .tokenOfOwnerByIndex(address, numOwnedRunners)
        .then(result => {
          result = parseInt(result)
          console.log('tokenOfOwnerByIndex returned ' + result)

          setNumOwnedRunners(numOwnedRunners + 1)
          setOwnedRunners(ownedRunners.concat(result))
          loadOwnedRunners()
        })
        .catch(error => {
          console.log('tokenOfOwnerByIndex returned none')
          setLookupOwners(false)
        })
    }
  }

  const loadRanking = () => {
    let self = this
    fetch(`${getBackend()}/ranking`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => {
        receiveRanking(result)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const loadLastUpdateTimestamp = () => {
    let self = this
    fetch(`${getBackend()}/last_update_timestamp`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(result => {
        setLastUpdateTimestamp(result)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const receiveRanking = result => {
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
    setRanking(result)
    pickRunners()
  }

  const pickRunners = () => {
    if (ranking === null) return

    let n = ranking.length
    let random1 = Math.floor(Math.random() * n)
    let direction = Math.random() > 0.5 ? 1 : -1
    let offset = Math.floor(Math.random() * MAX_OFFSET)
    let random2 = random1 + direction * offset
    random2 = Math.abs(random2) % n
    if (random1 === random2) {
      random2 = (random1 + direction) % n
    }

    setVoted(false)
    setWinner(0)
    setRunner1(ranking[random1])
    setRunner2(ranking[random2])
  }

  const navigate = page => () => {
    if (page === 'style' && !isFirefox) {
      return alert('Sorry, this feature only works on Firefox.')
    }
    setPage(page)
  }

  const vote = winner => () => {
    if (address === null || signature === null || nonce === null || numOwnedRunners === 0) {
      return alert(
        'Sorry, you can only vote after connecting your wallet, and you need to own at least one chain runner.'
      )
    }

    if (!runner1 || !runner2) return console.error('Missing runner1 or runner2 data')

    let data = {
      runner1: runner1.id,
      runner2: runner2.id,
      result: winner,
      address,
      nonce,
      signature,
    }
    fetch(`${getBackend()}/submit_vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        handleVote(winner, result)
      })
      .catch(error => {
        console.error('Error:', error)
      })
  }

  const handleVote = (winner, result) => {
    if (result.status === 'ok') {
      setVoted(true)
      setWinner(winner)
    } else {
      console.error(result.status)
    }
  }

  const renderPage = () => {
    switch (page) {
      case 'vote':
        return !runner1 || !runner2 ? (
          <React.Fragment></React.Fragment>
        ) : (
          <Vote
            runner1={runner1}
            runner2={runner2}
            vote={handleVote}
            voted={voted}
            winner={winner}
            next={pickRunners}
          />
        )
      case 'ranking':
        // @ts-expect-error
        return <Ranking data={ranking} lastUpdateTimestamp={lastUpdateTimestamp} />
      case 'style':
        return <DeepStyle />
      default:
        return <React.Fragment></React.Fragment>
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div>
        <NavBar navigate={navigate} address={address || ''} connect={connect} ownedRunners={ownedRunners} />
        <Container style={{ marginTop: '25px' }}>{renderPage()}</Container>
      </div>
    </ThemeProvider>
  )
}

export default App
