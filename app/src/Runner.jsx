import React, { Component } from 'react' ;
import Button from '@material-ui/core/Button';

import RollingImage from './RollingImage'


class Runner extends Component {

    getTitle() {
        if (this.props.data) {
            return '#'+this.props.data.ids.join("+")
        } else {
            return 'Loading...' ;
        }
    }

    renderButton() {
        if (this.props.data) {
            return (<Button size="large" variant="contained"
                            color="primary"
                            onClick={this.props.vote}
                            style={{fontWeight:'bold'}}
                            disabled={this.props.voted}>
                        {this.props.data.name} WINS!
                    </Button>) ;
        } else {
            return "" ;
        }
    }

    additionalClass() {
        if (this.props.isWinner) {
            return "vote-panel-winner" ;
        } else if (this.props.isLooser) {
            return "vote-panel-looser" ;
        } else {
            return "vote-panel-draw" ;
        }

    }

    render() {
        return (
            <div className={"vote-panel "+this.additionalClass()} >
                <div className="vote-panel-title">
                    {this.getTitle()}
                </div>
                <div className="vote-panel-name">
                    {this.props.data?this.props.data.name:""}
                </div>
                <div className="vote-panel-avatar">
                    <RollingImage data={this.props.data?this.props.data.ids:[]} size={100}/>
                </div>
                <div className="vote-panel-text">
                    <span style={{whiteSpace: 'pre-wrap'}}>
                        {this.props.data?this.props.data.text:""}
                    </span>
                </div>
                <div className="vote-panel-action">
                    {this.renderButton()}
                </div>
            </div>
        ) ;
    }

}

export default Runner;