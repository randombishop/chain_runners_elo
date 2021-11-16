import React, { Component } from 'react' ;
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


class NavBar extends Component {

    connect = () => {

    }

    render() {
        return (
            <Grid container spacing={3} style={{height:'120px', padding:'10px', backgroundColor:'rgba(32, 64, 32, 0.6)'}}>
                <Grid item xs={2}>
                    <div className="navbar-title">
                        <span className="h1a">ELO</span><br/>
                        <span className="h1a">R</span><span className="h1b">ating</span><br/>
                        <span className="h1a">S</span><span className="h1b">ystem</span>
                    </div>
                </Grid>
                <Grid item xs={3} className="navbar-box">
                    <img src="chain_runners_logo.svg" alt="Logo" height="80"/>
                </Grid>
                <Grid item xs={5} className="navbar-box">
                    <Button size="large" variant="contained" color="primary" onClick={this.props.navigate('vote')}>
                        Vote
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button  size="large" variant="contained" color="primary" onClick={this.props.navigate('ranking')}>
                        Ranking
                    </Button>
                </Grid>
                <Grid item xs={2} className="navbar-box">
                    <Button size="large" variant="contained" onClick={this.connect}>
                        Connect
                    </Button>
                </Grid>
            </Grid>
        ) ;
    }

}
export default NavBar;