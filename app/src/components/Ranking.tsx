import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'

import RankingTable from './RankingTable'
import Runner from './Runner'
import { RunnerType } from 'types/runners'

interface RankingProps {
  data?: RunnerType[]
  lastUpdateTimestamp?: string
}

const Ranking: React.FC<RankingProps> = props => {
  const [selectedRunner, setSelectedRunner] = useState<RunnerType | null>(null)

  const handleRunnerClicked = (runner: RunnerType) => () => {
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
    </Grid>
  )
}

export default Ranking
