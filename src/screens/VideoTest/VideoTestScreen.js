import React from 'react'

import { View, StyleSheet, Dimensions, Text } from 'react-native'

import Video from 'react-native-video'



class VideoTestScreen extends React.Component {
    static navigationOptions = {
        title: 'Map Test',
    };

    constructor(props) {
        super(props);
        this.state = {
            aspectRatio: 0,
        }
    }

    onVideoLoad(response) {
        this.setState({aspectRatio: aspectRatio})
    }

    render() {
        return (
            <View style={styles.container}>
                <Video
                    repeat={true}
                    controls={true}
                    style={{
                        width: "100%",
                        aspectRatio: this.state.aspectRatio,
                        transform: [{rotate: '90deg'}],
                    }}
                    onLoad={response => {
                        const { width, height }= response.naturalSize;
                        const aspectRatio = width / height;
                        this.setState({aspectRatio: aspectRatio})
                    }}
                    source={require('./assets/test_video.mov')}/>
            </View>
        )
    }
}

export default VideoTestScreen

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#AAAAAA",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
})