import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import ArrowForward from '@material-ui/icons/ArrowForward'
import ArrowBack from '@material-ui/icons/ArrowBack'

import RollingImage from './RollingImage'
import { TRunnerClickedFn, IRunner } from 'types'

const NUM_ITEMS_PER_PAGE = 10

interface ButtonsProps {
  page: number
  numPages: number
  back: () => void
  next: () => void
}

const Buttons: React.FC<ButtonsProps> = props => {
  const { page, numPages, back, next } = props

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <Button color="inherit" disabled={page === 0} onClick={back}>
          <ArrowBack />
        </Button>
      </div>
      <div style={{ textAlign: 'center' }}>
        Page
        <br />
        {page + 1} / {numPages}
      </div>
      <div>
        <Button color="inherit" disabled={page === numPages - 1} onClick={next}>
          <ArrowForward />
        </Button>
      </div>
    </div>
  )
}

interface ItemProps {
  item: IRunner
  runnerClicked: TRunnerClickedFn
}

const Item: React.FC<ItemProps> = props => {
  const { item, runnerClicked } = props

  return (
    <tr key={item.id} className="ranking-table-row" onClick={runnerClicked(item)}>
      <td align="right" className="ranking-table-important">
        #{item.rank}
      </td>
      <td align="center">
        <RollingImage data={item.nfts} size={36} />
      </td>
      <td align="left">
        <b>{item.name}</b>
      </td>
      <td align="center">{item.rating}</td>
      <td align="center">{item.won}</td>
      <td align="center">{item.draw}</td>
      <td align="center">{item.lost}</td>
    </tr>
  )
}

interface ItemListProps {
  data?: IRunner[]
  runnerClicked: TRunnerClickedFn
  page: number
}

const ItemList: React.FC<ItemListProps> = props => {
  const { data, page, runnerClicked } = props

  if (!data) return null

  const indexFrom = page * NUM_ITEMS_PER_PAGE

  let indexTo = indexFrom + NUM_ITEMS_PER_PAGE
  if (indexTo > data.length) {
    indexTo = data.length
  }

  const list = data.slice(indexFrom, indexTo)

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr style={{ lineHeight: '20px' }}>
          <th align="right"> </th>
          <th align="center"> </th>
          <th align="left"> </th>
          <th align="center">Rating</th>
          <th align="center">Won</th>
          <th align="center">Draw</th>
          <th align="center">Lost</th>
        </tr>
      </thead>
      <tbody>
        {list.map((x, i) => (
          <Item item={x} runnerClicked={runnerClicked} key={i} />
        ))}
      </tbody>
    </table>
  )
}

interface RankingTableProps {
  data?: IRunner[]
  runnerClicked: TRunnerClickedFn
  lastUpdateTimestamp?: string
}

const RankingTable: React.FC<RankingTableProps> = props => {
  const [page, setPage] = useState(0)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    if (props.data) {
      const n = props.data.length
      setNumPages(Math.ceil(n / NUM_ITEMS_PER_PAGE))
    } else {
      setNumPages(0)
    }

    setPage(0)
  }, [props.data])

  const back = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  const next = () => {
    if (page < numPages - 1) {
      setPage(page + 1)
    }
  }

  return (
    <div className="ranking-panel">
      <div className="panel-title">Ranking</div>
      <div className="ranking-panel-table">
        <ItemList data={props.data} runnerClicked={props.runnerClicked} page={page} />
      </div>
      <div className="ranking-panel-info">
        Last updated:{' '}
        <span className="my-green">
          <strong>{props.lastUpdateTimestamp}</strong>
        </span>
        <br />
        (Rating system uses ELO algorithm with the same parameters as MegaCity's Chess Organization)
      </div>
      <div className="ranking-panel-action">
        {props.data && <Buttons numPages={numPages} page={page} back={back} next={next} />}
      </div>
    </div>
  )
}

export default RankingTable
