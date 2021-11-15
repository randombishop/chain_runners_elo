import React, { Component } from 'react' ;


const BASE_URL = "https://chain-runners-api.vercel.app/api/v1/img/" ;
const LOADING_URL = "empty.png" ;
const TIME_TO_ROLL = 1000 ;


class RollingImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            counter: 0,
            current: LOADING_URL
        }
    }

    componentDidMount = () => {
        let self=this ;
        this.loop = setInterval(self.roll, TIME_TO_ROLL);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.roll() ;
        }
    }

    componentWillUnmount() {
        if (this.loop) {
            clearInterval(this.loop);
        }
    }

    roll = () => {
        if (this.props.data) {
            let n = this.props.data.ids.length ;
            let counter = (this.state.counter+1)%n ;
            let state = {
                counter: counter,
                current: BASE_URL+this.props.data.ids[counter]
            }
            this.setState(state) ;
        } else {
            this.setState({
                counter: 0,
                current: LOADING_URL
            }) ;
        }
    }

    getUrl() {
        if (this.props.data) {
            return '#'+this.props.data.ids.join("+")
        } else {
            return 'Loading...' ;
        }
    }

    render() {
        return (<img src={this.state.current} width="100" height="100" alt="avatar"/>) ;
    }

}

export default RollingImage;