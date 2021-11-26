import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'

import RankingTable from './RankingTable'
import Runner from './Runner'
import About from './About'
import { IRunner } from 'types'

interface RankingProps {
  data?: IRunner[]
  lastUpdateTimestamp?: string
}

const Ranking: React.FC<RankingProps> = props => {
  const [selectedRunner, setSelectedRunner] = useState<IRunner | null>(null)

  const handleRunnerClicked = (runner: IRunner) => () => {
    setSelectedRunner(runner)
  }

  return (
    <Grid container spacing={1}>
      <Grid item lg={7} sm={12}>
        <RankingTable
          data={props.data}
          lastUpdateTimestamp={props.lastUpdateTimestamp}
          runnerClicked={handleRunnerClicked}
        />
      </Grid>
      <Grid item lg={5} sm={12}>
        {selectedRunner ? <Runner runner={selectedRunner} mode="view" /> : ''}
      </Grid>
      <Grid item lg={12} sm={12}>
        <About />
      </Grid>
    </Grid>
  )
}

export default Ranking
