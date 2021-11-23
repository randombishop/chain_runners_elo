import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import Runner from './Runner'

class Vote extends Component {
  renderVersus() {
    if (this.props.voted) {
      switch (this.props.winner) {
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
          return ''
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
            onClick={this.props.vote(0)}
          >
            DRAW!
          </Button>
        </React.Fragment>
      )
    }
  }

  renderNext() {
    if (this.props.voted) {
      return (
        <Button size="large" variant="contained" style={{ fontWeight: 'bold' }} onClick={this.props.next}>
          NEXT MATCH!
        </Button>
      )
    } else {
      return ''
    }
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item lg={5} sm={12}>
          <Runner
            runner={this.props.runner1}
            mode="vote"
            vote={this.props.vote(1)}
            voted={this.props.voted}
            isWinner={this.props.winner === 1}
            isLooser={this.props.winner === 2}
          />
        </Grid>
        <Grid item lg={2} sm={12} style={{ textAlign: 'center', paddingTop: '150px' }}>
          {this.renderVersus()}
          <br />
          <br />
          <br />
          {this.renderNext()}
        </Grid>
        <Grid item lg={5} sm={12}>
          <Runner
            runner={this.props.runner2}
            mode="vote"
            vote={this.props.vote(2)}
            voted={this.props.voted}
            isWinner={this.props.winner === 2}
            isLooser={this.props.winner === 1}
          />
        </Grid>
      </Grid>
    )
  }
}
export default Vote
