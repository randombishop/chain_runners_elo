import React, { Component } from 'react' ;
import Grid from '@material-ui/core/Grid';


import Runner from './Runner' ;

class Vote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            runner1: null,
            runner2: null
        }
    }

    componentDidMount = () => {
        this.loadRunners() ;
    }

    loadRunners = () => {
        this.loadRunner(18,'runner1') ;
        this.loadRunner(19,'runner2') ;
    }

    loadRunner = (id, slot) => {
       let self = this ;
       fetch('lore/'+id+'.json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
       }).then(response => response.json())
          .then(result => {self.loadRunner2(result, slot);})
          .catch((error) => {alert('Error:', error);});
    }

    loadRunner2 = (data, slot) => {
        let state = {} ;
        state[slot] = data ;
        this.setState(state) ;
    }

    render() {
        return (
            <Grid container spacing={0}>
                <Grid item xs={5} >
                    <Runner data={this.state.runner1}/>
                </Grid>
                <Grid item xs={2} style={{textAlign:'center', marginTop:'150px'}}>
                    <img src="versus.png"  alt="versus" width="200px" height="200px"/>
                </Grid>
                <Grid item xs={5} >
                    <Runner data={this.state.runner2}/>
                </Grid>
            </Grid>
        ) ;
    }

}
export default Vote;