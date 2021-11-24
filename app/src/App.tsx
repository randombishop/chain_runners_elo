import React, { useCallback, useEffect, useState } from 'react'
import { createTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { green } from '@material-ui/core/colors'
import Container from '@material-ui/core/Container'
import { ethers } from 'ethers'

import NavBar from './components/NavBar'
import Vote, { VoteNumber } from './components/Vote'
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
import { RunnerType } from 'types/runners'

const theme = createTheme({
  typography: {
    fontFamily: 'Monospace',
  },
  palette: {
    primary: green,
  },
})

export type PageType = 'vote' | 'ranking' | 'style'

interface PageContentProps {
  page: PageType
  ranking?: RunnerType[]
  lastUpdateTimestamp?: string
  runner1?: RunnerType
  runner2?: RunnerType
  sendVote: (winner) => () => any
  voted: boolean
  winner: VoteNumber
  pickRunners: () => any
}

const PageContent: React.FC<PageContentProps> = props => {
  const { page, runner1, runner2, sendVote, voted, winner, pickRunners, ranking, lastUpdateTimestamp } = props

  switch (page) {
    case 'vote':
      return !runner1 || !runner2 ? (
        <React.Fragment></React.Fragment>
      ) : (
        <Vote
          runner1={runner1}
          runner2={runner2}
          vote={sendVote}
          voted={voted}
          winner={winner}
          next={pickRunners}
        />
      )
    case 'ranking':
      return <Ranking data={ranking} lastUpdateTimestamp={lastUpdateTimestamp} />
    case 'style':
      return <DeepStyle />
    default:
      return <React.Fragment></React.Fragment>
  }
}

let contractChainRunners: ethers.Contract | null
let contractThe23: ethers.Contract | null

const App = () => {
  const [page, setPage] = useState<PageType>('vote')
  const [ranking, setRanking] = useState<RunnerType[] | undefined>(undefined)
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<string | undefined>(undefined)
  const [runner1, setRunner1] = useState<RunnerType | undefined>(undefined)
  const [runner2, setRunner2] = useState<RunnerType | undefined>(undefined)
  const [voted, setVoted] = useState(false)
  const [winner, setWinner] = useState<VoteNumber>(0)
  const [address, setAddress] = useState<string | null>(null)
  const [nonce, setNonce] = useState(Date.now())
  const [signature, setSignature] = useState<string | null>(null)
  const [numOwnedRunners, setNumOwnedRunners] = useState(0)
  const [ownedRunners, setOwnedRunners] = useState([]) // TODO: Type this
  const [lookupOwners, setLookupOwners] = useState(true)
  const [isFirefox, setIsFirefox] = useState(false)

  // equivalent to componentDidMount
  useEffect(() => {
    setIsFirefox(navigator.userAgent.search('Firefox') > -1)

    const receiveRanking = (result: RunnerType[]) => {
      result.sort((a, b) => b.rating - a.rating)
      let rank = 0
      let currentRating: number | undefined = undefined

      for (let i = 0; i < result.length; i++) {
        if (currentRating === undefined || currentRating > result[i].rating) {
          rank++
        }
        result[i].rank = rank
        currentRating = result[i].rating
      }
      setRanking(result)

      const { random1, random2 } = getRandomRunners(result)

      setVoted(false)
      setWinner(0)
      setRunner1(result[random1])
      setRunner2(result[random2])
    }

    const loadRanking = () => {
      fetch(`${backendPrefix}/ranking`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          receiveRanking(result)
        })
        .catch(error => console.error('Error:', error))
    }

    const loadLastUpdateTimestamp = () => {
      fetch(`${backendPrefix}/last_update_timestamp`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          setLastUpdateTimestamp(result)
        })
        .catch(error => console.error('Error:', error))
    }

    loadRanking()
    loadLastUpdateTimestamp()
  }, [])

  useEffect(() => {
    if (address && lookupOwners && contractChainRunners) {
      contractChainRunners
        .tokenOfOwnerByIndex(address, numOwnedRunners)
        .then(result => {
          result = parseInt(result)
          console.log('tokenOfOwnerByIndex returned ' + result)

          setNumOwnedRunners(numOwnedRunners + 1)
          setOwnedRunners(ownedRunners.concat(result))
        })
        .catch(error => {
          console.log('tokenOfOwnerByIndex returned none for address: ' + address)
          debugger
          setLookupOwners(false)
        })
    }
  }, [address])

  const oneTimeSignature = async (signer: ethers.providers.JsonRpcSigner) => {
    const message = `Hi, I'd like to login into datascience.art\nTimestamp: ${nonce}`

    const signature = await signer.signMessage(message)

    setSignature(signature)

    // checkNFTs() // this didn't exist?
    // loadOwnedRunners()
  }

  const doConnect = async () => {
    const provider = new ethers.providers.Web3Provider(
      // @ts-expect-error
      window.ethereum,
      'any'
    )

    await provider.send('eth_requestAccounts', [])

    const signer = provider.getSigner()

    contractChainRunners = new ethers.Contract(CHAIN_RUNNERS_CONTRACT, CHAIN_RUNNERS_ABI, signer)
    contractThe23 = new ethers.Contract(THE23_CONTRACT, THE23_ABI, signer)

    const address = await signer.getAddress()

    console.log({ address })

    setAddress(address)
    await oneTimeSignature(signer)
  }

  const connect = async () => {
    // setAddress(null)
    setNonce(Date.now())
    // setSignature(null)
    // setOwnedRunners([])
    setLookupOwners(true)

    await doConnect()
  }

  const pickRunners = useCallback(() => {
    if (!ranking) return

    const { random1, random2 } = getRandomRunners(ranking)

    setVoted(false)
    setWinner(0)
    setRunner1(ranking[random1])
    setRunner2(ranking[random2])
  }, [ranking])

  const navigate = useCallback(
    (page: PageType) => () => {
      if (page === 'style' && !isFirefox) {
        return alert('Sorry, this feature only works on Firefox.')
      }
      setPage(page)
    },
    [isFirefox]
  )

  const sendVote = useCallback(
    (winner: VoteNumber) => () => {
      if (address === null || signature === null || nonce === null || numOwnedRunners === 0) {
        debugger
        return alert(
          'Sorry, you can only vote after connecting your wallet, and you need to own at least one chain runner.'
        )
      }

      if (!runner1 || !runner2) return console.error('Missing runner1 or runner2 data')

      const data = {
        runner1: runner1.id,
        runner2: runner2.id,
        result: winner,
        address,
        nonce,
        signature,
      }

      debugger

      fetch(`${backendPrefix}/submit_vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(result => {
          if (result.status === 'ok') {
            setVoted(true)
            setWinner(winner)
          } else {
            console.error(result.status)
          }
        })
        .catch(error => console.error('Error:', error))
    },
    [address, nonce, numOwnedRunners, runner1, runner2, signature]
  )

  return (
    <ThemeProvider theme={theme}>
      <div>
        <NavBar navigate={navigate} address={address || ''} connect={connect} ownedRunners={ownedRunners} />
        <Container style={{ marginTop: '25px' }}>
          <PageContent
            page={page}
            runner1={runner1}
            runner2={runner2}
            sendVote={sendVote}
            voted={voted}
            winner={winner}
            pickRunners={pickRunners}
            ranking={ranking}
            lastUpdateTimestamp={lastUpdateTimestamp}
          />
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App
