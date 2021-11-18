import React, { Component } from 'react' ;
import Button from '@material-ui/core/Button';


import RollingImage from './RollingImage' ;
import {getBackend} from './utils' ;


const DASH_LINE = '---------------------------------------' ;


class Runner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'lore',
            runner: null,
            history: null
        }
    }

    componentDidMount = () => {
        this.loadData() ;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.runner !== this.props.runner) {
            this.loadData() ;
        }
    }

    loadData() {
        this.loadRunner() ;
        this.loadHistory() ;
    }

    loadRunner = () => {
       if (this.props.runner==null) {
         return ;
       }
       let id = this.props.runner.id ;
       let self = this ;
       fetch('lore/'+id+'.json', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
       }).then(response => response.json())
          .then(result => {self.loadRunner2(result);})
          .catch((error) => {alert('Error:', error);});
    }

    loadRunner2 = (data) => {
        let state = {
            runner: data
        } ;
        this.setState(state) ;
    }

    loadHistory = () => {
       if (this.props.runner==null) {
         return ;
       }
       if (this.props.mode==='view') {
           let id = this.props.runner.id ;
           let self = this ;
           fetch(getBackend()+'/runner_history/'+id, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
           }).then(response => response.json())
              .then(result => {self.setState({history:result});})
              .catch((error) => {alert('Error:', error);});
           }
    }

    getTitle() {
        if (this.state.runner) {
            return '#'+this.state.runner.ids.join("+")
        } else {
            return 'Loading...' ;
        }
    }

    renderLore() {
        return (
            <span style={{whiteSpace: 'pre-wrap'}}>
                {this.state.runner?this.state.runner.text:""}
            </span>
        ) ;
    }

    renderScore(result) {
        if (result===0) {
            return "0 - 0" ;
        } else if (result===1) {
            return "1 - 0" ;
        } else if (result===2) {
            return "0 - 1" ;
        } else {
            return "" ;
        }
    }

    renderVoteItem(i, result) {
        return (
            <div className="runner-panel-result" key={i}>
                {result.address} <br/>
                {result.time} <br/>
                {result.runner1} - {result.runner2}<br/>
                {this.renderScore(result.result)} <br/>
                {DASH_LINE}
            </div>
        ) ;
    }

    renderVoteLog() {
        let ans = [] ;
        for (let i=0 ; i<this.state.history.length ; i++) {
            ans.push(this.renderVoteItem(i, this.state.history[i])) ;
        }
        return ans ;
    }
    renderResults() {
        if (this.state.history) {
            return (
                <React.Fragment>
                    <span className="my-green">
                        <b>Votes: {this.state.history.length}</b>
                    </span>
                    <br/>
                    {DASH_LINE}
                    <br/>
                    {this.renderVoteLog()}
                </React.Fragment>
            ) ;
        } else {
            return "" ;
        }
    }

    renderBody() {
        switch (this.state.tab) {
            case 'lore': return this.renderLore() ;
            case 'results': return this.renderResults() ;
            default: return "" ;
        }
    }

    renderVotingButton() {
        return (<Button size="large" variant="contained"
                            color="primary"
                            onClick={this.props.vote}
                            style={{fontWeight:'bold'}}
                            disabled={this.props.voted}>
                        {this.state.runner.name} WINS!
                    </Button>) ;
    }

    renderViewButtons() {
        return (<React.Fragment>
                    <Button size="large" variant="contained"
                            color={this.state.tab==='lore'?'primary':'default'}
                            onClick={() => this.setState({tab:'lore'})}
                            style={{fontWeight:'bold'}}>
                        Lore
                    </Button>
                    &nbsp;&nbsp;&nbsp;
                    <Button size="large" variant="contained"
                            color={this.state.tab==='results'?'primary':'default'}
                            onClick={() => this.setState({tab:'results'})}
                            style={{fontWeight:'bold'}}>
                        Results
                    </Button>
                </React.Fragment>) ;
    }

    renderButtons() {
        if (this.state.runner) {
            switch (this.props.mode) {
                case 'vote': return this.renderVotingButton() ;
                case 'view': return this.renderViewButtons() ;
                default: return "" ;
            }
        } else {
            return "" ;
        }
    }

    additionalClass() {
        if (this.props.isWinner) {
            return "runner-panel-winner" ;
        } else if (this.props.isLooser) {
            return "runner-panel-looser" ;
        } else {
            return "runner-panel-draw" ;
        }

    }

    render() {
        return (
            <div className={"runner-panel "+this.additionalClass()} >
                <div className="runner-panel-title">
                    {this.getTitle()}
                </div>
                <div className="runner-panel-name">
                    {this.state.runner?this.state.runner.name:""}
                </div>
                <div className="runner-panel-avatar">
                    <RollingImage data={this.state.runner?this.state.runner.ids:[]} size={100}/>
                </div>
                <div className="runner-panel-text">
                    {this.renderBody()}
                </div>
                <div className="runner-panel-action">
                    {this.renderButtons()}
                </div>
            </div>
        ) ;
    }

}

export default Runner;