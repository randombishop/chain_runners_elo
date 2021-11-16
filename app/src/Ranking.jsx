import React, { Component } from 'react' ;
import Button from '@material-ui/core/Button';


class Ranking extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    renderButton() {
        if (this.props.data) {
            return (<Button size="large" variant="contained"
                            onClick={this.vote}
                            style={{fontWeight:'bold'}}>
                        Next
                    </Button>) ;
        } else {
            return "" ;
        }
    }

    render() {
        return (
            <div className="ranking-panel">
                <div className="ranking-panel-title">
                    Ranking
                </div>
                <div className="ranking-panel-table">
                    {JSON.stringify(this.props.data)}
                </div>
                <div className="ranking-panel-action">
                    {this.renderButton()}
                </div>
            </div>
        ) ;
    }

}
export default Ranking;