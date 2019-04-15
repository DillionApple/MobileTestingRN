import React from 'react'

import { View, Text } from 'react-native'

import VideoComponent from "./VideoComponent";

class MultiVideo extends React.Component {

    static navigationOptions = {
        title: 'Multi Video',
    };

    timeoutHandler(vm) {
        vm.props.testFinish()
    }

    componentDidMount(): void {
        setTimeout(this.timeoutHandler, 5 * 60 * 1000, this);
    }

    render() {
        return (
            <View>
                <VideoComponent></VideoComponent>
                <VideoComponent></VideoComponent>
                <VideoComponent></VideoComponent>
                <VideoComponent></VideoComponent>
                <VideoComponent></VideoComponent>
                <VideoComponent></VideoComponent>
                <VideoComponent></VideoComponent>
                <VideoComponent></VideoComponent>
            </View>
        )
    }
}

export default MultiVideo