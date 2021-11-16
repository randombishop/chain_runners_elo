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
        if (this.props.data && this.props.data.length>0) {
            let n = this.props.data.length ;
            let counter = (this.state.counter+1)%n ;
            let state = {
                counter: counter,
                current: BASE_URL+this.props.data[counter]
            }
            this.setState(state) ;
        } else {
            this.setState({
                counter: 0,
                current: LOADING_URL
            }) ;
        }
    }

    render() {
        return (<img src={this.state.current} width={this.props.size} height={this.props.size}  alt="avatar"/>) ;
    }

}

export default RollingImage;