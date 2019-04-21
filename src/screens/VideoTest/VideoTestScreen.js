import React from 'react'

import { View, StyleSheet, Button, Dimensions, Animated } from 'react-native'
import Video from 'react-native-video'
import BaseScreenComponent from "../../components/BaseScreenComponent";

class VideoTestScreen extends BaseScreenComponent {

    NUMBER_OF_VIDEOS = 5;
    WINDOW_WIDTH = Dimensions.get('window').width;

    players = Array.apply(null, Array(this.NUMBER_OF_VIDEOS));
    durations = Array.apply(null, Array(this.NUMBER_OF_VIDEOS));

    constructor(props) {
        super(props);
        this.state = {
            aspectRatios: Array.apply(null, Array(this.NUMBER_OF_VIDEOS)).map(() => 0),
            pauseds: Array.apply(null, Array(this.NUMBER_OF_VIDEOS)).map(() => false),
            speeds: Array.apply(null, Array(this.NUMBER_OF_VIDEOS)).map(() => 1.0),
            widthAnims: Array.apply(null, Array(this.NUMBER_OF_VIDEOS)).map(() => new Animated.Value(this.WINDOW_WIDTH)),
            directionAnims: Array.apply(null, Array(this.NUMBER_OF_VIDEOS)).map(() => new Animated.Value(0)),
            topAnims: Array.apply(null, Array(this.NUMBER_OF_VIDEOS)).map(() => new Animated.Value(0)),
        }
    }

    pauseRandomly() {
        for (let i = 0; i < this.NUMBER_OF_VIDEOS; ++i) {
            if (Math.random() < 0.5) {
                this.state.pauseds[i] = !this.state.pauseds[i]
            }
        }
        this.setState({pauseds: this.state.pauseds})
    }

    seekRandomly() {
        for (let i = 0; i < this.NUMBER_OF_VIDEOS; ++i) {
            if (Math.random() < 0.5) {
                this.players[i].seek(Math.random() * this.durations[i])
            }
        }
    }

    changeSpeedRandomly() {
        for (let i = 0; i < this.NUMBER_OF_VIDEOS; ++i) {
            if (Math.random() < 0.5) {
                this.state.speeds[i] = Math.random() * 2.0
            }
        }
        this.setState({speeds: this.state.speeds})
    }

    changeSizeRandomly() {
        for (let i = 0; i < this.NUMBER_OF_VIDEOS; ++i) {
            if (Math.random() < 0.5) {
                let widthToValue = Math.random() * this.WINDOW_WIDTH;
                let direction = this.state.directionAnims[i]._value;
                let topToValue = (direction % 2 == 0) ? 0 : (widthToValue - widthToValue / this.state.aspectRatios[i]) / 2;
                Animated.parallel([
                    Animated.timing(
                        this.state.widthAnims[i],
                        {
                            toValue: widthToValue,
                            duration: 500,
                        }
                    ),
                    Animated.timing(
                        this.state.topAnims[i],
                        {
                            toValue: topToValue,
                        }
                    )
                ]).start()
            }
        }
    }

    rotateRandomly() {
        for (let i = 0; i < this.NUMBER_OF_VIDEOS; ++i) {
            if (Math.random() < 0.5) {
                let direction =  Math.floor(Math.random() * 4); // 0 1 2 3
                let topToValue = (direction % 2 == 0) ? 0 : (this.state.widthAnims[i]._value - this.state.widthAnims[i]._value / this.state.aspectRatios[i])  / 2
                let animations = [];
                Animated.parallel([
                    Animated.timing(
                        this.state.directionAnims[i],
                        {
                            toValue: direction,
                        }
                    ),
                    Animated.timing(
                        this.state.topAnims[i],
                        {
                            toValue: topToValue,
                        }
                    )
                ]).start()
            }
        }
    }

    slotRender() {
        return (
            <View style={styles.container}>
                {this.state.speeds.map((speed, index) => {

                    const rotateDegree = this.state.directionAnims[index].interpolate({
                        inputRange: [0, 1, 2, 3],
                        outputRange: ['0deg', '90deg', '180deg', '270deg'],
                    });

                    return (
                        <Animated.View
                            key={index}
                            style={{
                                position: 'absolute',
                                top: this.state.topAnims[index],
                                width: this.state.widthAnims[index],
                                aspectRatio: this.state.aspectRatios[index],
                                transform: [{rotate: rotateDegree}],
                            }}
                        >
                            <Video
                                ref={(ref) => {
                                    this.players[index] = ref
                                }}
                                repeat={true}
                                paused={this.state.pauseds[index]}
                                rate={this.state.speeds[index]}
                                style={{
                                    ...StyleSheet.absoluteFillObject,
                                    zIndex: -1,
                                }}
                                onLoad={response => {
                                    this.durations[index] = response.duration;
                                    const {width, height} = response.naturalSize;
                                    const aspectRatio = width / height;
                                    let aspectRatios = this.state.aspectRatios;
                                    aspectRatios[index] = aspectRatio;
                                    this.setState({aspectRatios: aspectRatios})
                                }}
                                source={require('./assets/test_video.mov')}/>
                        </Animated.View>
                    )
                })}
                <View style={styles.buttonsContainer}>
                    <Button title={'|-Pause-|'} onPress={() => {this.pauseRandomly()}}/>
                    <Button title={'|-Seek-|'} onPress={() => {this.seekRandomly()}}/>
                    <Button title={'|-Speed-|'} onPress={() => {this.changeSpeedRandomly()}}/>
                    <Button title={'|-Size-|'} onPress={() => {this.changeSizeRandomly()}}/>
                    <Button title={'|-Rotate-|'} onPress={() => {this.rotateRandomly()}}/>
                </View>
            </View>
        )
    }
}

export default VideoTestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#AAAAAA",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        alignItems:"center",
    },
    buttonsContainer: {
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between"
    },
});