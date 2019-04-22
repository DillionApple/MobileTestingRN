import React from 'react'

import { View, StyleSheet, Dimensions, Animated } from 'react-native'

import Video from 'react-native-video'

class VideoComponent extends React.Component {

    player = null;
    duration = 0;
    windowWidth = Dimensions.get('window').width;

    mounted = true;

    constructor(props) {
        super(props);
        this.state = {
            aspectRatio: 0,
            paused: false,
            rate: 1.0,
            widthAnim: new Animated.Value(this.windowWidth),
            rotateAnim: new Animated.Value(0),
        }
    }

    togglePausedRandomly() {
        this.setState({paused: !vm.state.paused});
    }

    seekRandomly() {
        this.player.seek(Math.random() * vm.duration)
    }

    changeSpeedRandomly(vm) {
        vm.setState({rate: Math.random() * 2.0})
    }

    changeSizeRandomly(vm) {
        Animated.timing(
            vm.state.widthAnim,
            {
                toValue: Math.random() * 2.0 * vm.windowWidth,
                duration: 500,
            }
        ).start();
        Animated.timing(
            vm.state.rotateAnim,
            {
                toValue: Math.random(),
                duration: 500,
            }
        ).start();
    }

    componentWillUnmount(): void {
        this.mounted = false
    }

    render() {
        const rotateDegree = this.state.rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
        return (
            <View style={styles.container}>

            </View>
        )
    }
}

export default VideoComponent

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#AAAAAA",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems:"center",
    },
});