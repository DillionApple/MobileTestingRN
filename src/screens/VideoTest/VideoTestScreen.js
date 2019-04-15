import React from 'react'

import { View, StyleSheet } from 'react-native'
import SingleVideo from "./SingleVideo";
import MultiVideo from "./MultiVideo";

class VideoTestScreen extends React.Component {
    static navigationOptions = {
        title: 'Video Test',
    };

    static testViews = [SingleVideo, MultiVideo]

    constructor(props) {
        super(props)
        this.state = {
            testViewIndex: 0
        }
    }

    childFinish() {
        if (this.state.testViewIndex + 1 < VideoTestScreen.testViews.length) {
            this.setState({testViewIndex: this.state.testViewIndex + 1});
            this.forceUpdate()
        }
    }

    render() {
        let Component = VideoTestScreen.testViews[this.state.testViewIndex]
        return (
            <View style={styles.container}>
                <Component testFinish={() => this.childFinish()}/>
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
        justifyContent: "center",
        alignItems:"center",
    },
});