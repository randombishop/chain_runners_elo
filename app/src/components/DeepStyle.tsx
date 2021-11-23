import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import { BASE_RUNNER_IMG_URL } from '../utils/utils'

const STYLES = {
  cubitus: 'Cubot',
  modern: 'Modbot',
  liquid: 'Lavabot',
  dark: 'Darkbot',
  geom: 'Epsibot',
  manga: 'Mangabot',
}

class DeepStyle extends Component {
  constructor(props) {
    super(props)
    this.state = {
      runnerTextInput: '',
      runnerNumber: null,
      style: 'cubitus',
      workInProgress: false,
      imgData1: null,
    }
  }

  selectRunner = () => {
    this.setState({ original: null }, () => {
      let text = this.state.runnerTextInput
      let number = parseInt(text)
      if (number == null || isNaN(number)) {
        alert('Please input a valid runner #')
      } else {
        this.setState({ runnerNumber: number }, this.fillCanvas)
      }
    })
  }

  fillCanvas = () => {
    if (this.state.workInProgress) {
      return
    }
    let self = this
    let number = this.state.runnerNumber
    let url = BASE_RUNNER_IMG_URL + number + '.png'
    let canvas = document.getElementById('originalimage')
    let ctx = canvas.getContext('2d')
    let img = new Image()
    img.src = url
    img.onload = function () {
      var hRatio = canvas.width / img.width
      var vRatio = canvas.height / img.height
      var ratio = Math.min(hRatio, vRatio)
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio)
      let data = canvas.toDataURL()
      self.setState({ imgData1: data })
    }
  }

  runDeepStyle = () => {
    if (this.state.workInProgress) {
      return
    }
    let self = this
    let style = this.state.style
    let data = this.state.imgData1
    if (data == null) {
      alert('Please load your runner image first.')
      return
    }
    this.setState({ workInProgress: true, imgData2: null }, () => {
      window.TF_GLOBAL_POINTER.callback = self.finishDeepStyle
      window.stylize(data, style)
    })
  }

  finishDeepStyle = () => {
    let canvas = document.getElementById('stylize-canvas')
    let imgData = canvas.toDataURL()
    this.setState({ workInProgress: false, imgData2: imgData })
  }

  renderOptions = () => {
    let ans = []
    for (let key in STYLES) {
      let option = STYLES[key]
      ans.push(
        <option key={key} value={key}>
          {option}
        </option>
      )
    }
    return ans
  }

  render() {
    return (
      <Grid container spacing={1}>
        <Grid item lg={4} sm={12}>
          <div className="deep-style-panel">
            <div className="deep-style-panel-title">Runner</div>
            <div className="deep-style-panel-inputs">
              <label>Runner #</label>
              <br />
              <input
                type="text"
                style={{ height: '20px', width: '260px', color: 'darkblue' }}
                value={this.state.runnerTextInput}
                onChange={event => {
                  this.setState({ runnerTextInput: event.target.value })
                }}
              />
              <br />
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={this.selectRunner}
                  disabled={this.state.workInProgress}
                >
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
        <Grid item lg={4} sm={12}>
          <div className="deep-style-panel">
            <div className="deep-style-panel-title">Style</div>
            <div className="deep-style-panel-inputs">
              <label>AI Style</label>
              <br />
              <select
                style={{ width: '260px', color: 'darkblue' }}
                value={this.state.style}
                onChange={event => {
                  this.setState({ style: event.target.value })
                }}
              >
                {this.renderOptions()}
              </select>
              <br />
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={this.runDeepStyle}
                  disabled={this.state.workInProgress}
                >
                  GO
                </Button>
              </div>
            </div>
            <div className="deep-style-panel-main">
              {this.state.imgData2 ? (
                <img src={this.state.imgData2} width="250" height="250" alt="styled" />
              ) : (
                ''
              )}
            </div>
            <div className="deep-style-panel-footer">
              {this.state.workInProgress ? 'This can sometimes take a while, please be patient.' : ''}
            </div>
          </div>
        </Grid>
        <Grid item lg={4} sm={12}>
          <div className="about-panel">
            <div className="about-panel-title">About</div>
            <div className="about-panel-text">
              If you'd like to support our work, please mint a piece of our collection at{' '}
              <a target="blank" href="https://www.the23.wtf" className="my-green">
                the23.wtf
              </a>
              <br />
              <br />
              It's a limited collection of 100 pieces of shit to record rug pulls, scams, and all kind of
              crazy shit happening in Ethereum blockchain.
              <br />
              <br />
              We're also working on a Pacman like network game where chain runners will run from Somnus and
              have fun; and of course, holding pieces of shit will give the runners super poop powers.
              <br />
              <br />
              Also, all runners are welcome to our{' '}
              <a target="blank" href="https://discord.com/invite/CmVmWV8K7h" className="my-green">
                discord server
              </a>
            </div>
          </div>
        </Grid>
      </Grid>
    )
  }
}
export default DeepStyle
