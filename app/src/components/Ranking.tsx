import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'

import RankingTable from './RankingTable'
import Runner from './Runner'

class Ranking extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRunner: null,
    }
  }

  select = runner => () => {
    this.setState({ selectedRunner: runner })
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item lg={7} sm={12}>
          <RankingTable
            data={this.props.data}
            lastUpdateTimestamp={this.props.lastUpdateTimestamp}
            runnerClicked={this.select}
          />
        </Grid>
        <Grid item lg={5} sm={12}>
          {this.state.selectedRunner ? <Runner runner={this.state.selectedRunner} mode="view" /> : ''}
        </Grid>
      </Grid>
    )
  }
}
export default Ranking
