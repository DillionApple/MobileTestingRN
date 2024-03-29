import React from "react";
import BaseScreenComponent from "../../components/BaseScreenComponent";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Easing, Platform
} from 'react-native';

import ModelView from 'react-native-gl-model-view';
import log_performance_origin from "../../components/LogDecorator";

let log_performance = log_performance_origin("WebGLScreen");

const AnimatedModelView = Animated.createAnimatedComponent(ModelView);


class WebGLScreen extends BaseScreenComponent {
    REPEAT_COUNT = 1;

    constructor() {
        super();
        this.state = {
            turns: 0,
            zoom: -3,

            rotateX: new Animated.Value(0),
            rotateZ: new Animated.Value(0),
            translateZ: new Animated.Value(-20),

            fromXY: undefined,
            valueXY: undefined,
            uiPosition: new Animated.Value(50)
        };
        Object.keys(this.state).forEach(key =>
            this.state[key] instanceof Animated.Value &&
            this.state[key].__makeNative()
        );
    }

    onMoveEnd = () => {
        this.setState({
            fromXY: undefined,
        });
    };

    onMove = (e) => {
        let {pageX, pageY} = e.nativeEvent,
            {rotateX, rotateZ, fromXY, valueXY} = this.state;
        if (!this.state.fromXY) {
            this.setState({
                fromXY: [pageX, pageY],
                valueXY: [
                    rotateZ.__getValue(),
                    rotateX.__getValue()
                ]
            });
        } else {
            rotateZ.setValue(valueXY[0] + (pageX - fromXY[0]) / 2);
            rotateX.setValue(valueXY[1] + (Platform.OS === 'ios' ? 1 : -1) * (pageY - fromXY[1]) / 2);
        }
    };
    @log_performance
    zoomIn(action) {

        let {zoom, translateZ} = this.state;

        this.state.zoom += action;
        // repeater mark
        for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
            Animated.timing(
                translateZ, {
                    toValue: zoom, useNativeDriver: true, duration: 300
                }
            ).start();
        }

    };
    @log_performance
    zoomOut(action) {
        action = -action;

        let {zoom, translateZ} = this.state;

        this.state.zoom += action;
        // repeater mark
        for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
            Animated.timing(
                translateZ, {
                    toValue: zoom, useNativeDriver: true, duration: 300
                }
            ).start();
        }

    };
    @log_performance
    goCrazy() {

        let {rotateZ, rotateX, translateZ} = this.state;

        const crazy = (value, toValue) =>
            Animated.timing(value, {
                toValue, useNativeDriver: true, duration: Math.random() * 10000, easing: Easing.elastic(4)
            });
        // repeater mark
        for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
            Animated.parallel([
                crazy(rotateX, Math.random() * 1000),
                crazy(translateZ, -2 - Math.random() * 3),
                crazy(rotateZ, Math.random() * 1000),
            ]).start();
        }

    };
    @log_performance
    turnAround() {

        let {turns, rotateZ} = this.state;

        this.state.turns += 1;
        // repeater mark
        for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
            Animated.timing(
                rotateZ, {
                    toValue: turns * 180, useNativeDriver: true, duration: 500
                }
            ).start();
        }

    };

    componentDidMount() {
        Animated.parallel([
            Animated.sequence([
                Animated.timing(
                    this.state.translateZ, {
                        toValue: this.state.zoom,
                        useNativeDriver: true,
                        duration: 3500,
                        easing: Easing.elastic(1)
                    }
                ),
                Animated.timing(
                    this.state.uiPosition,
                    {toValue: 0, useNativeDriver: true, duration: 300}
                )
            ]),
            Animated.timing(
                this.state.rotateX, {
                    toValue: 270,
                    useNativeDriver: true,
                    duration: 5000,
                    easing: Easing.elastic(5)
                }
            )
        ]).start();
    }

    renderButton(label, method) {
        return (
            <TouchableOpacity onPress={method}>
                <Text style={styles.button}>{label}</Text>
            </TouchableOpacity>
        );
    }

    slotRender() {
        let {rotateZ, rotateX, translateZ, uiPosition} = this.state;

        return (
            <View style={styles.container}>
                <AnimatedModelView
                    model={{
                        uri: 'demon.model',
                    }}
                    texture={{
                        uri: 'demon.png',
                    }}
                    tint={{r: 1.0, g: 1.0, b: 1.0, a: 1.0}}
                    onStartShouldSetResponder={() => true}
                    onResponderRelease={this.onMoveEnd}
                    onResponderMove={this.onMove}
                    animate
                    flipTexture={false}

                    scale={0.01}
                    translateZ={translateZ}

                    rotateX={rotateX}
                    rotateZ={rotateZ}

                    style={styles.view}
                />
                <Animated.View style={[styles.buttons, {transform: [{translateY: uiPosition}]}]}>
                    {this.renderButton('|-zoom in-|', this.zoomIn.bind(this, 0.8))}
                    {this.renderButton('|-zoom out-|', this.zoomOut.bind(this, 0.8))}
                    {this.renderButton('|-turn around-|', this.turnAround.bind(this))}
                    {this.renderButton('|-random move-|', this.goCrazy.bind(this))}
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#99CCFF'
    },
    view: {
        flex: 1,
        backgroundColor: '#99CCFF'
    },
    buttons: {
        height: 50,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    button: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 12
    }
});

export default WebGLScreen
