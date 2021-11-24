import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

import RollingImage from './RollingImage'

export interface NavbarProps {
  address?: string
  navigate: (...args: any[]) => any
  connect: (...args: any[]) => any
  ownedRunners: any // TODO: Type this
}

const NavBar: React.FC<NavbarProps> = props => {
  // const connect = () => {}

  const renderAddress = () => {
    if (!props.address) return ''

    return `${props.address.substr(0, 6)}...`
  }

  const renderDeepStyleButton = () => {
    return (
      <React.Fragment>
        <Button size="large" variant="contained" color="primary" onClick={props.navigate('style')}>
          <span className="navbar-button">Style</span>
        </Button>
        &nbsp;&nbsp;&nbsp;
      </React.Fragment>
    )
  }

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
        <Button size="large" variant="contained" color="primary" onClick={props.navigate('vote')}>
          <span className="navbar-button">Vote</span>
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button size="large" variant="contained" color="primary" onClick={props.navigate('ranking')}>
          <span className="navbar-button">Ranking</span>
        </Button>
        &nbsp;&nbsp;&nbsp;
        {renderDeepStyleButton()}
        <Button
          size="large"
          variant="contained"
          color="secondary"
          onClick={props.connect}
          disabled={props.address !== null}
        >
          <span className="navbar-button">
            {props.address == null ? 'Connect' : renderAddress()}
            &nbsp;
            <RollingImage data={props.ownedRunners} size={28} />
          </span>
        </Button>
      </Grid>
    </Grid>
  )
}

export default NavBar
