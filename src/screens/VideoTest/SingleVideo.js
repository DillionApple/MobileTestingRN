import React from 'react'

import VideoComponent from "./VideoComponent";

class SingleVideo extends React.Component {

    static navigationOptions = {
        title: 'Single Video',
    };

    render() {
        return (
            <VideoComponent></VideoComponent>
        )
    }
}

export default SingleVideo