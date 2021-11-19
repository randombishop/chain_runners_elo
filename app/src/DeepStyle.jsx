import React, { Component } from 'react' ;
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


class DeepStyle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            style: null
        }
    }

    render() {
        return (
            <Grid container spacing={1}>
                <Grid item lg={4} sm={12}>
                    <div className="deep-style-panel" >
                        <div className="deep-style-panel-title">
                            Runner
                        </div>
                        <div className="deep-style-panel-inputs">
                            <label>Runner #</label><br/>
                            <input type="text" style={{height:'20px',width:'260px',color:'darkblue'}}/><br/>
                            <div style={{textAlign:'center', marginTop:'10px'}}>
                                <Button size="small" variant="contained"
                                        color="primary"
                                        onClick={this.selectRunner}>
                                    Select
                                </Button>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item lg={4} sm={12}>
                    <div className="deep-style-panel" >
                        <div className="deep-style-panel-title">
                            Style
                        </div>
                    </div>
                </Grid>
                <Grid item lg={4} sm={12}>
                    <div className="deep-style-panel" >
                        <div className="deep-style-panel-title">
                            About
                        </div>
                    </div>
                </Grid>
            </Grid>
        ) ;
    }

}
export default DeepStyle;