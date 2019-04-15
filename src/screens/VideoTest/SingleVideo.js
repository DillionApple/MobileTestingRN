import React from 'react'

import VideoComponent from "./VideoComponent";

class SingleVideo extends React.Component {

    static navigationOptions = {
        title: 'Single Video',
    };

    timeoutHandler(vm) {
        vm.props.testFinish()
    }

    componentDidMount(): void {
        setTimeout(this.timeoutHandler, 5 * 60 * 1000, this);
    }

    render() {
        return (
            <VideoComponent></VideoComponent>
        )
    }
}

export default SingleVideo