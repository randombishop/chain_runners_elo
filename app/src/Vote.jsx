import React, { Component } from 'react' ;
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';


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

    componentDidUpdate(prevProps) {
        if ((prevProps.runner1 !== this.props.runner1) || (prevProps.runner2 !== this.props.runner2)) {
            this.loadRunners() ;
        }
    }

    loadRunners = () => {
        if (this.props.runner1!=null && this.props.runner2!=null) {
            let id1 = this.props.runner1.id ;
            let id2 = this.props.runner2.id ;
            console.log('id1', id1) ;
            console.log('id2', id2) ;
            this.loadRunner(id1,'runner1') ;
            this.loadRunner(id2,'runner2') ;
        }
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

    renderVersus() {
        if (this.props.voted)  {
            switch (this.props.winner) {
                case 0: return (<div>
                                    <img src="draw.png" alt="draw" className="vote-img-result"/>
                                    <br/>
                                    <div className="vote-txt-result">0 - 0</div>
                                </div>
                               ) ;
                case 1: return (<div>
                                    <img src="winner_left.png" alt="win" className="vote-img-result"/>
                                    <br/>
                                    <div className="vote-txt-result">1 - 0</div>
                                </div>
                               ) ;
                case 2: return (<div>
                                    <img src="winner_right.png" alt="win" className="vote-img-result"/>
                                    <br/>
                                    <div className="vote-txt-result">0 - 1</div>
                                </div>
                               ) ;
                default: return "" ;
            } ;
        } else {
            return (<div>
                        <img src="versus.png"  alt="versus" width="200px" height="200px"/>
                        <br/>
                        <Button size="large" variant="contained"
                            style={{fontWeight:'bold'}}
                            onClick={this.props.vote(0)}
                            >
                        DRAW!</Button>
                    </div>) ;
        }
    }

    renderNext() {
        if (this.props.voted)  {
            return (<Button size="large" variant="contained"
                            style={{fontWeight:'bold'}}
                            onClick={this.props.next}
                            >
                        NEXT MATCH!
                    </Button>) ;
        } else {
            return "" ;
        }
    }

    render() {
        return (
            <Grid container spacing={0}>
                <Grid item xs={5} >
                    <Runner data={this.state.runner1}
                            vote={this.props.vote(1)}
                            voted={this.props.voted}
                            isWinner={this.props.winner===1}
                            isLooser={this.props.winner===2} />
                </Grid>
                <Grid item xs={2} style={{textAlign:'center', marginTop:'150px'}}>
                    {this.renderVersus()}
                    <br/><br/><br/>
                    {this.renderNext()}
                </Grid>
                <Grid item xs={5} >
                    <Runner data={this.state.runner2}
                            vote={this.props.vote(2)}
                            voted={this.props.voted}
                            isWinner={this.props.winner===2}
                            isLooser={this.props.winner===1} />
                </Grid>
            </Grid>
        ) ;
    }

}
export default Vote;