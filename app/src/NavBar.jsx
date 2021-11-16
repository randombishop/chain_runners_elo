import React, { Component } from 'react' ;
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


class NavBar extends Component {

    connect = () => {

    }

    renderAddress = () => {
        if (this.props.address) {
            return this.props.address.substr(0,6)+'...' ;
        } else {
            return "" ;
        }
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
                        <span className="navbar-button">Vote</span>
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button  size="large" variant="contained" color="primary" onClick={this.props.navigate('ranking')}>
                        <span className="navbar-button">Ranking</span>
                    </Button>
                </Grid>
                <Grid item xs={2} className="navbar-box">
                    <Button size="large"
                            variant="contained"
                            color="secondary"
                            onClick={this.props.connect}
                            disabled={this.props.address!=null}>
                        <span className="navbar-button">
                        {this.props.address==null?'Connect':this.renderAddress()}
                        </span>
                    </Button>
                </Grid>
            </Grid>
        ) ;
    }

}
export default NavBar;