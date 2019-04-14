import React from 'react'

import { View, StyleSheet, Dimensions, Text, Animated } from 'react-native'

import Video from 'react-native-video'



class VideoTestScreen extends React.Component {
    static navigationOptions = {
        title: 'Map Test',
    };

    intervals = [];
    player = null;
    duration = 0;
    windowWidth = Dimensions.get('window').width;

    constructor(props) {
        super(props);
        this.state = {
            intervalCount: 0,
            aspectRatio: 0,
            paused: false,
            rate: 1.0,
            widthAnim: new Animated.Value(this.windowWidth),
            rotateAnim: new Animated.Value(0),
        }
    }

    __togglePaused(vm) {
        vm.setState({paused: ! vm.state.paused});
    }

    __seekRandomly(vm) {
        vm.player.seek(Math.random() * vm.duration)
    }

    __changeSpeedRandomly(vm) {
        vm.setState({rate: Math.random() * 2.0})
    }

    __changeSizeRandomly(vm) {
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
                toValue: 0.25 - vm.state.rotateAnim._value,
                duration: 500,
            }
        ).start();
    }

    intervalHandler(vm) {
        //vm.__togglePaused(vm);
        //vm.__seekRandomly(vm);
        vm.__changeSpeedRandomly(vm);
        vm.__changeSizeRandomly(vm);
    }

    componentDidMount(): void {
        this.intervals.concat(setInterval(this.__togglePaused, 1300, this));
        this.intervals.concat(setInterval(this.__changeSpeedRandomly, 2300, this));
        this.intervals.concat(setInterval(this.__changeSizeRandomly, 2900, this));
        this.intervals.concat(setInterval(this.__seekRandomly, 4700, this));
    }

    componentWillUnmount(): void {
        for (let interval in this.intervals) {
            clearInterval(interval)
        }
    }

    render() {
        const rotateDegree = this.state.rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });
            return (
            <View style={styles.container}>
                <Animated.View
                style={{
                    width: this.state.widthAnim,
                    aspectRatio: this.state.aspectRatio,
                    transform: [{rotate: rotateDegree}],

                }}
            >
                <Video
                    ref={(ref) => {
                        this.player = ref
                    }}
                    repeat={true}
                    controls={true}
                    paused={this.state.paused}
                    rate={this.state.rate}
                    style={StyleSheet.absoluteFill}
                    onLoad={response => {
                        this.duration = response.duration;
                        const { width, height }= response.naturalSize;
                        const aspectRatio = width / height;
                        this.setState({aspectRatio: aspectRatio})
                    }}
                    source={require('./assets/test_video.mov')}/>
                </Animated.View>
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