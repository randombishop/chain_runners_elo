import React, { Component } from 'react' ;
import Button from '@material-ui/core/Button';
import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from '@material-ui/icons/ArrowBack';


import RollingImage from './RollingImage'


const NUM_ITEMS_PER_PAGE = 10 ;


class Ranking extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page:0,
            numPages:0
        }
    }

    componentDidMount = () => {
        this.updatePagination() ;
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.data !== this.props.data) {
            this.updatePagination() ;
        }
    }

    updatePagination = () => {
        if (this.props.data) {
            let n = this.props.data.length ;
            let numPages = Math.ceil(n/NUM_ITEMS_PER_PAGE) ;
            this.setState({
                page:0,
                numPages:numPages
            }) ;
        } else {
            this.setState({
                page:0,
                numPages:0,
            }) ;
        }
    }

    back = () => {
        if (this.state.page>0) {
            this.setState({page:(this.state.page-1)}) ;
        }
    }

    next = () => {
        if (this.state.page<(this.state.numPages-1)) {
            this.setState({page:(this.state.page+1)}) ;
        }
    }

    renderItem(item) {
        return (<tr key={item.id} className="ranking-table-row">
                  <td align="right" className="ranking-table-important">#{item.rank}</td>
                  <td align="center"><RollingImage data={item.nfts} size={36}/></td>
                  <td align="left"><b>{item.name}</b></td>
                  <td align="center">{item.rating}</td>
                  <td align="center">{item.won}</td>
                  <td align="center">{item.draw}</td>
                  <td align="center">{item.lost}</td>
                </tr>) ;
    }

    renderItems(list) {
        let ans = [] ;
        for (let i=0 ; i<list.length ; i++) {
            ans.push(this.renderItem(list[i])) ;
        }
        return ans ;
    }

    renderList() {
        if (this.props.data) {
            let indexFrom = this.state.page*NUM_ITEMS_PER_PAGE ;
            let indexTo = indexFrom+NUM_ITEMS_PER_PAGE ;
            if (indexTo>this.props.data.length) {
                indexTo = this.props.data.length ;
            }
            let list = this.props.data.slice(indexFrom, indexTo) ;
            return (<table style={{width:'100%'}}>
                        <thead>
                          <tr>
                            <th align="right">Rank</th>
                            <th align="center">Runner</th>
                            <th align="left">Name</th>
                            <th align="center">Rating</th>
                            <th align="center">Won</th>
                            <th align="center">Draw</th>
                            <th align="center">Lost</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.renderItems(list)}
                        </tbody>
                    </table>) ;
        } else {
            return "" ;
        }
    }

    renderButtons() {
        if (this.props.data) {
            return (
                <div style={{display:'flex'}}>
                    <div>
                        <Button color="inherit"
                                disabled={this.state.page===0}
                                onClick={this.back}>
                            <ArrowBack />
                        </Button>
                    </div>
                    <div style={{textAlign:'center'}}>
                        Page<br/>
                        {this.state.page+1} / {this.state.numPages}
                    </div>
                    <div>
                        <Button color="inherit"
                                disabled={this.state.page===(this.state.numPages-1)}
                                onClick={this.next}>
                            <ArrowForward />
                        </Button>
                    </div>
                </div>) ;
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
                    {this.renderList()}
                </div>
                <div className="ranking-panel-info">
                    Last updated: <span className="my-green"><strong>N/A</strong></span><br/>
                    This table will be updated when we reach a few hundreds votes...
                </div>
                <div className="ranking-panel-action">
                    {this.renderButtons()}
                </div>
            </div>
        ) ;
    }

}
export default Ranking;