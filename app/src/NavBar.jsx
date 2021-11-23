import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import RollingImage from './RollingImage'

class NavBar extends Component {
  connect = () => {}

  renderAddress = () => {
    if (this.props.address) {
      return this.props.address.substr(0, 6) + '...'
    } else {
      return ''
    }
  }

  renderDeepStyleButton() {
    if (!this.props.isFirefox) return null
    return (
      <React.Fragment>
        <Button size="large" variant="contained" color="primary" onClick={this.props.navigate('style')}>
          <span className="navbar-button">Style</span>
        </Button>
        &nbsp;&nbsp;&nbsp;
      </React.Fragment>
    )
  }

  render() {
    return (
      <Grid container spacing={3} className="navbar-grid">
        <Grid item sm={12} lg={6} className="navbar-box">
          <img src="chain_runners_logo.svg" alt="Logo" height="60" />
          <br />
          <span className="h1a">ELO</span>&nbsp;
          <span className="h1a">R</span>
          <span className="h1b">ating</span>&nbsp;
          <span className="h1a">S</span>
          <span className="h1b">ystem</span>
        </Grid>
        <Grid item sm={12} lg={6} className="navbar-box">
          <br />
          <br />
          <Button size="large" variant="contained" color="primary" onClick={this.props.navigate('vote')}>
            <span className="navbar-button">Vote</span>
          </Button>
          &nbsp;&nbsp;&nbsp;
          <Button size="large" variant="contained" color="primary" onClick={this.props.navigate('ranking')}>
            <span className="navbar-button">Ranking</span>
          </Button>
          &nbsp;&nbsp;&nbsp;
          {this.renderDeepStyleButton()}
          <Button
            size="large"
            variant="contained"
            color="secondary"
            onClick={this.props.connect}
            disabled={this.props.address != null}
          >
            <span className="navbar-button">
              {this.props.address == null ? 'Connect' : this.renderAddress()}
              &nbsp;
              <RollingImage data={this.props.ownedRunners} size={28} />
            </span>
          </Button>
        </Grid>
      </Grid>
    )
  }
}
export default NavBar
