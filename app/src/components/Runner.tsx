import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'

import RollingImage from './RollingImage'
import { backendPrefix } from '../utils'
import { VoteNumber } from './Vote'
import { RunnerType } from 'types/runners'

const DASH_LINE = '------------------------------------------'

export type Tab = 'lore' | 'results'

export type Result = {
  runner1: any
  runner2: any
  address: any
  time: any
  result: VoteNumber
}

export interface RunnerProps {
  runner: RunnerType
  mode: 'view' | 'vote'
  vote?: () => any
  voted?: boolean
  isWinner?: boolean
  isLooser?: boolean
}

const Runner: React.FC<RunnerProps> = props => {
  const [tab, setTab] = useState<Tab>('lore')
  const [runner, setRunner] = useState<RunnerType | null>(null)
  const [history, setHistory] = useState<Result[]>([]) // TODO: Type this

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
      if (props.mode === 'view') {
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
    }
    loadRunner()
    loadHistory()
  }, [props.mode, props.runner])

  const getTitle = () => {
    if (runner) return `#${runner.ids.join('+')}`
    return 'Loading...'
  }

  const renderLore = () => {
    return <span style={{ whiteSpace: 'pre-wrap' }}>{runner ? runner.text : ''}</span>
  }

  const renderScore = (result: VoteNumber) => {
    if (result === 0) return '0 - 0'
    if (result === 1) return '1 - 0'
    if (result === 2) return '0 - 1'
    return ''
  }

  const renderVoteItem = (i, result: Result) => {
    return (
      <div className="runner-panel-result" key={i}>
        {result.address} <br />
        {result.time} <br />
        {result.runner1} - {result.runner2}
        <br />
        {renderScore(result.result)} <br />
        {DASH_LINE}
      </div>
    )
  }

  const renderResults = () => {
    if (!history.length) return null

    return (
      <React.Fragment>
        <span className="my-green">
          <b>Votes: {history.length}</b>
        </span>
        <br />
        {DASH_LINE}
        <br />
        {history.map((value, i) => renderVoteItem(i, value))}
      </React.Fragment>
    )
  }

  const renderBody = () => {
    switch (tab) {
      case 'lore':
        return renderLore()
      case 'results':
        return renderResults()
      default:
        return ''
    }
  }

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

    switch (props.mode) {
      case 'vote':
        return renderVotingButton()
      case 'view':
        return renderViewButtons()
      default:
        return ''
    }
  }

  const additionalClass = () => {
    if (props.isWinner) {
      return 'runner-panel-winner'
    } else if (props.isLooser) {
      return 'runner-panel-looser'
    } else {
      return 'runner-panel-draw'
    }
  }

  return (
    <div className={'runner-panel ' + additionalClass()}>
      <div className="panel-title">{getTitle()}</div>
      <div className="runner-panel-name">{runner ? runner.name : ''}</div>
      <div className="runner-panel-avatar">
        <RollingImage data={runner ? runner.ids : []} size={100} />
      </div>
      <div className="runner-panel-text">{renderBody()}</div>
      <div className="runner-panel-action">{renderButtons()}</div>
    </div>
  )
}

export default Runner
