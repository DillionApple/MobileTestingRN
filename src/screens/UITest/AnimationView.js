import LottieView from "lottie-react-native";
import React from "react";
import {View, StyleSheet} from 'react-native';

class AnimationView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
    }

    componentDidMount() {
        this.start_play();
    }

    async start_play() {
        this.animation.play();
        await new Promise((resolve) => setTimeout(() => {
            this.setState({current: 1});
            this.animation.play();
            resolve();
        }, 2000));
        await new Promise((resolve) => setTimeout(() => {
            this.setState({current: 2});
            this.animation.play();
            resolve();
        }, 2000));
        this.props.navigation.state.params.onGoBack();
    }

    render() {
        let source = [require('../../../assets/json/machine.json'), require('../../../assets/json/city.json'), require('../../../assets/json/drink.json')];
        return (
            <LottieView
                style={styles.lottieView}
                ref={animation => {
                    this.animation = animation;
                }}
                source={source[this.state.current]}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    }
});
export default AnimationView;