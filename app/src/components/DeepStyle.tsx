import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import About from './About'

import { BASE_RUNNER_IMG_URL } from '../utils'

const STYLES = {
  cubitus: 'Cubot',
  modern: 'Modbot',
  liquid: 'Lavabot',
  dark: 'Darkbot',
  geom: 'Epsibot',
  manga: 'Mangabot',
} as const

const DeepStyle: React.FC = () => {
  const [imgData1, setImgData1] = useState<string | null>(null)
  const [imgData2, setImgData2] = useState<string | null>(null)
  const [runnerNumber, setRunnerNumber] = useState<number | null>(null)
  const [runnerTextInput, setRunnerTextInput] = useState('')
  const [style, setStyle] = useState<keyof typeof STYLES>('cubitus')
  const [workInProgress, setWorkInProgress] = useState(false)

  const selectRunner = () => {
    const number = parseInt(runnerTextInput)
    if (number === null || isNaN(number)) {
      alert('Please input a valid runner #')
    } else {
      setRunnerNumber(number)
      fillCanvas()
    }
  }

  const fillCanvas = () => {
    if (workInProgress) return

    const url = `${BASE_RUNNER_IMG_URL}${runnerNumber}.png`

    const canvas = document.getElementById('originalimage') as HTMLCanvasElement | null

    if (!canvas) return console.error("Couldn't find #originalimage in the document")

    const ctx = canvas.getContext('2d')

    if (!ctx) return console.error("Couldn't get 2d context")

    let img = new Image()
    img.src = url
    img.onload = () => {
      const hRatio = canvas.width / img.width
      const vRatio = canvas.height / img.height
      const ratio = Math.min(hRatio, vRatio)

      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio)

      const data = canvas.toDataURL()
      setImgData1(data)
    }
  }

  const runDeepStyle = () => {
    if (workInProgress) return
    if (!imgData1) return alert('Please load your runner image first.')

    setWorkInProgress(true)

    setImgData2(null)

    // @ts-expect-error TODO What's this?
    window.TF_GLOBAL_POINTER.callback = finishDeepStyle

    // @ts-expect-error TODO What's this?
    window.stylize(imgData1, style)
  }

  const finishDeepStyle = () => {
    const canvas = document.getElementById('stylize-canvas') as HTMLCanvasElement | null

    setWorkInProgress(false)

    if (!canvas) return

    setImgData2(canvas.toDataURL())
  }

  return (
    <Grid container spacing={1}>
      <Grid item lg={6} sm={12}>
        <div className="deep-style-panel">
          <div className="deep-style-panel-title">Runner</div>
          <div className="deep-style-panel-inputs">
            <label>Runner #</label>
            <br />
            <input
              type="text"
              style={{ height: '20px', width: '260px', color: 'darkblue' }}
              value={runnerTextInput}
              onChange={event => {
                setRunnerTextInput(event.target.value)
              }}
            />
            <br />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Button size="small" variant="contained" onClick={selectRunner} disabled={workInProgress}>
                Select
              </Button>
            </div>
          </div>
          <div className="deep-style-panel-main">
            <div style={{ width: '250px', height: '250px', padding: 0, marginInline: 'auto' }}>
              <canvas id="originalimage" width="250" height="250" />
            </div>
          </div>
        </div>
      </Grid>
      <Grid item lg={6} sm={12}>
        <div className="deep-style-panel">
          <div className="deep-style-panel-title">Style</div>
          <div className="deep-style-panel-inputs">
            <label>AI Style</label>
            <br />
            <select
              style={{ width: '260px', color: 'darkblue' }}
              value={style}
              onChange={event => {
                setStyle(event.target.value as keyof typeof STYLES)
              }}
            >
              {Object.keys(STYLES).map(key => {
                return (
                  <option key={key} value={key}>
                    {STYLES[key]}
                  </option>
                )
              })}
            </select>
            <br />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Button size="small" variant="contained" onClick={runDeepStyle} disabled={workInProgress}>
                GO
              </Button>
            </div>
          </div>
          <div className="deep-style-panel-main">
            {imgData2 && <img src={imgData2} width="250" height="250" alt="styled" />}
          </div>
          <div className="deep-style-panel-footer">
            {workInProgress && 'This can sometimes take a while, please be patient.'}
          </div>
        </div>
      </Grid>
      <Grid item lg={12} sm={12}>
        <About />
      </Grid>
    </Grid>
  )
}

export default DeepStyle
