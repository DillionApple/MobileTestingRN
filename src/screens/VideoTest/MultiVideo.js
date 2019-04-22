import React from 'react'

import { View, Text } from 'react-native'

import VideoComponent from "./VideoComponent";

class MultiVideo extends React.Component {

    static navigationOptions = {
        title: 'Multi Video',
    };

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