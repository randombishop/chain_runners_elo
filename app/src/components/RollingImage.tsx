import React, { Component } from 'react'

import { BASE_RUNNER_IMG_URL, EMPTY_IMG_URL } from '../utils'

const TIME_TO_ROLL = 1000

interface RollingImageProps {
  size: number
  data: number[] | string[]
}

interface RollingImageState {
  counter: number
  current: string
}

// TODO: Convert this to hooks/functional component
class RollingImage extends Component<RollingImageProps, RollingImageState> {
  private loop?: NodeJS.Timer

  constructor(props: RollingImageProps) {
    super(props)
    this.state = {
      counter: 0,
      current: EMPTY_IMG_URL,
    }
  }

  componentDidMount = () => {
    const self = this
    this.loop = setInterval(self.roll, TIME_TO_ROLL)
  }

  componentDidUpdate(prevProps: RollingImageProps) {
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
    if (!this.props.data || this.props.data.length === 0) {
      return this.setState({
        counter: 0,
        current: EMPTY_IMG_URL,
      })
    }

    const counter = (this.state.counter + 1) % this.props.data.length

    this.setState({
      counter,
      current: `${BASE_RUNNER_IMG_URL}${this.props.data[counter]}.png`,
    })
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
