import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import Runner from './Runner'
import { EVoteNumber, IRunner, TVoteFn } from 'types'

interface VoteProps {
  runner1: IRunner
  runner2: IRunner
  next: () => any
  vote: TVoteFn
  voted: boolean
  winner: EVoteNumber
}

const Vote: React.FC<VoteProps> = props => {
  const renderVersus = () => {
    if (props.voted) {
      switch (props.winner) {
        case 0:
          return (
            <React.Fragment>
              <img src="draw.png" alt="draw" className="vote-img-result" />
              <br />
              <div className="vote-txt-result">0 - 0</div>
            </React.Fragment>
          )
        case 1:
          return (
            <React.Fragment>
              <img src="winner_left.png" alt="win" className="vote-img-result" />
              <br />
              <div className="vote-txt-result">1 - 0</div>
            </React.Fragment>
          )
        case 2:
          return (
            <React.Fragment>
              <img src="winner_right.png" alt="win" className="vote-img-result" />
              <br />
              <div className="vote-txt-result">0 - 1</div>
            </React.Fragment>
          )
        default:
          return null
      }
    } else {
      return (
        <React.Fragment>
          <img src="versus.png" alt="versus" width="200px" height="200px" />
          <br />
          <Button
            size="large"
            variant="contained"
            style={{ fontWeight: 'bold' }}
            onClick={props.vote(EVoteNumber.ZERO)}
          >
            DRAW!
          </Button>
        </React.Fragment>
      )
    }
  }

  const renderNext = () => {
    if (!props.voted) return null
    return (
      <Button size="large" variant="contained" style={{ fontWeight: 'bold' }} onClick={props.next}>
        NEXT MATCH!
      </Button>
    )
  }

  return (
    <Grid container spacing={1}>
      <Grid item lg={5} sm={12}>
        <Runner
          runner={props.runner1}
          mode="vote"
          vote={props.vote(EVoteNumber.ONE)}
          voted={props.voted}
          isWinner={props.winner === 1}
          isLoser={props.winner === 2}
        />
      </Grid>
      <Grid item lg={2} sm={12} style={{ textAlign: 'center', paddingTop: '150px' }}>
        {renderVersus()}
        <br />
        <br />
        <br />
        {renderNext()}
      </Grid>
      <Grid item lg={5} sm={12}>
        <Runner
          runner={props.runner2}
          mode="vote"
          vote={props.vote(EVoteNumber.TWO)}
          voted={props.voted}
          isWinner={props.winner === 2}
          isLoser={props.winner === 1}
        />
      </Grid>
    </Grid>
  )
}

export default Vote
