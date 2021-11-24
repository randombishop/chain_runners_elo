import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'

import RollingImage from './RollingImage'
import { backendPrefix } from '../utils'
import { VoteNumber } from './Vote'
import { RunnerType } from 'types/runners'

const DASH_LINE = '------------------------------------------'

export type Tab = 'lore' | 'results'

export type Result = {
  runner1: number
  runner2: number
  address: string
  time: string
  result: VoteNumber
}

export interface RunnerProps {
  runner: RunnerType
  mode: 'view' | 'vote'
  vote?: () => any
  voted?: boolean
  isWinner?: boolean
  isLoser?: boolean
}

const getScore = (result: VoteNumber) => {
  if (result === 0) return '0 - 0'
  if (result === 1) return '1 - 0'
  if (result === 2) return '0 - 1'
}

const VoteItem: React.FC<{ result: Result }> = props => {
  return (
    <div className="runner-panel-result">
      {props.result.address} <br />
      {props.result.time} <br />
      {props.result.runner1} - {props.result.runner2}
      <br />
      {getScore(props.result.result)} <br />
      {DASH_LINE}
    </div>
  )
}

const Results: React.FC<{ history: Result[] }> = props => {
  if (!props.history.length) return null

  return (
    <React.Fragment>
      <span className="my-green">
        <b>Votes: {props.history.length}</b>
      </span>
      <br />
      {DASH_LINE}
      <br />
      {props.history.map((result, i) => (
        <VoteItem result={result} key={i} />
      ))}
    </React.Fragment>
  )
}

const Lore: React.FC<{ runner?: RunnerType }> = props => {
  return <span style={{ whiteSpace: 'pre-wrap' }}>{props.runner ? props.runner.text : ''}</span>
}

const Runner: React.FC<RunnerProps> = props => {
  const [tab, setTab] = useState<Tab>('lore')
  const [runner, setRunner] = useState<RunnerType | undefined>(undefined)
  const [history, setHistory] = useState<Result[]>([])

  // Equivalent of componentDidMount and componentDidUpdate
  useEffect(() => {
    if (props.runner === null) return

    const loadRunner = () => {
      fetch(`lore/${props.runner.id}.json`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then((result: RunnerType) => {
          setRunner(result)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }

    const loadHistory = () => {
      if (props.mode !== 'view') return

      fetch(`${backendPrefix}/runner_history/${props.runner.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(result => {
          setHistory(result)
        })
        .catch(error => {
          console.error('Error:', error)
        })
    }

    loadRunner()
    loadHistory()
  }, [props.mode, props.runner])

  const getTitle = () => (runner ? `#${runner.ids.join('+')}` : 'Loading...')

  const renderVotingButton = () => {
    if (!runner) return null
    return (
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={props.vote}
        style={{ fontWeight: 'bold' }}
        disabled={props.voted}
      >
        {runner.name} WINS!
      </Button>
    )
  }

  const renderViewButtons = () => {
    return (
      <React.Fragment>
        <Button
          size="large"
          variant="contained"
          color={tab === 'lore' ? 'primary' : 'default'}
          onClick={() => setTab('lore')}
          style={{ fontWeight: 'bold' }}
        >
          Lore
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button
          size="large"
          variant="contained"
          color={tab === 'results' ? 'primary' : 'default'}
          onClick={() => setTab('results')}
          style={{ fontWeight: 'bold' }}
        >
          Results
        </Button>
      </React.Fragment>
    )
  }

  const renderButtons = () => {
    if (!runner) return null
    if (props.mode === 'vote') return renderVotingButton()
    if (props.mode === 'view') return renderViewButtons()
  }

  const additionalClass = () => {
    if (props.isWinner) return 'runner-panel-winner'
    if (props.isLoser) return 'runner-panel-loser'
    return 'runner-panel-draw'
  }

  return (
    <div className={'runner-panel ' + additionalClass()}>
      <div className="panel-title">{getTitle()}</div>
      <div className="runner-panel-name">{runner ? runner.name : ''}</div>
      <div className="runner-panel-avatar">
        <RollingImage data={runner ? runner.ids : []} size={100} />
      </div>
      <div className="runner-panel-text">
        {tab === 'lore' ? <Lore runner={runner} /> : <Results history={history} />}
      </div>
      <div className="runner-panel-action">{renderButtons()}</div>
    </div>
  )
}

export default Runner
