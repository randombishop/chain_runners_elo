import React, { Component } from 'react' ;
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


class NavBar extends Component {

    vote = () => {

    }

    ratings = () => {

    }

    connect = () => {

    }

    render() {
        return (
            <Grid container spacing={3} style={{height:'120px', padding:'10px', backgroundColor:'rgba(64, 128, 64, 0.5)'}}>
                <Grid item xs={3} style={{lineHeight:'80px'}}>
                    <img src="chain_runners_logo.svg" alt="Logo" height="80"/>
                </Grid>
                <Grid item xs={6} style={{lineHeight:'80px'}}>
                    <Button size="large" variant="contained" color="primary" onClick={this.vote}>
                        Vote
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button  size="large" variant="contained" color="primary" onClick={this.vote}>
                        Ratings
                    </Button>
                </Grid>
                <Grid item xs={3} style={{lineHeight:'80px'}}>
                    <Button size="large" variant="contained" onClick={this.connect}>
                        Connect
                    </Button>
                </Grid>
            </Grid>
        ) ;
    }

}
export default NavBar;