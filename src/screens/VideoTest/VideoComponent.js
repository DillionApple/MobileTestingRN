import React from 'react'

import { View, StyleSheet, Dimensions, Animated } from 'react-native'

import Video from 'react-native-video'

class VideoComponent extends React.Component {

    intervals = [];
    player = null;
    duration = 0;
    windowWidth = Dimensions.get('window').width;

    intervalActions = [this.__togglePaused, this.__seekRandomly, this.__changeSpeedRandomly, this.__changeSizeRandomly]

    mounted = true;

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
        vm.setState({paused: !vm.state.paused});
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
                toValue: Math.random(),
                duration: 500,
            }
        ).start();
    }

    __intervalHandler(vm, type) {
        if (! vm.mounted) {
            for (let interval in vm.intervals) {
                clearInterval(interval)
            }
            return
        }
        vm.intervalActions[type](vm)
    }



    componentDidMount(): void {
        this.intervals.concat(setInterval(this.__intervalHandler, 1300, this, 0));
        this.intervals.concat(setInterval(this.__intervalHandler, 2300, this, 1));
        this.intervals.concat(setInterval(this.__intervalHandler, 2900, this, 2));
        this.intervals.concat(setInterval(this.__intervalHandler, 4700, this, 3));
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

export default VideoComponent

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