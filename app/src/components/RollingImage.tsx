import React, { Component } from 'react'

import { BASE_RUNNER_IMG_URL, EMPTY_IMG_URL } from './utils'

const TIME_TO_ROLL = 1000

class RollingImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0,
      current: EMPTY_IMG_URL,
    }
  }

  componentDidMount = () => {
    let self = this
    this.loop = setInterval(self.roll, TIME_TO_ROLL)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.roll()
    }
  }

  componentWillUnmount() {
    if (this.loop) {
      clearInterval(this.loop)
    }
  }

  roll = () => {
    if (this.props.data && this.props.data.length > 0) {
      let n = this.props.data.length
      let counter = (this.state.counter + 1) % n
      let state = {
        counter: counter,
        current: BASE_RUNNER_IMG_URL + this.props.data[counter] + '.png',
      }
      this.setState(state)
    } else {
      this.setState({
        counter: 0,
        current: EMPTY_IMG_URL,
      })
    }
  }

  render() {
    return (
      <img
        src={this.state.current}
        width={this.props.size}
        height={this.props.size}
        alt="-"
        style={{ verticalAlign: 'bottom' }}
      />
    )
  }
}

export default RollingImage
