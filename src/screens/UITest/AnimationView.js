import LottieView from "lottie-react-native";
import React from "react";
import {View, StyleSheet} from 'react-native';

class AnimationView extends React.Component {
    componentDidMount() {
        this.animation.play();
        // Or set a specific startFrame and endFrame with:
        this.animation.play(30, 120);
    }

    render() {
        return (
            <LottieView
                ref={animation => {
                    this.animation = animation;
                }}
                source={require('../../../assets/json/drink.json')}
            />
        );
    }
}

const styles = StyleSheet.create({});
export default AnimationView;