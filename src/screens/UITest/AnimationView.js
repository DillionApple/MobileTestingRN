import LottieView from "lottie-react-native";
import React from "react";
import {View, StyleSheet} from 'react-native';
import Timeout from 'await-timeout';

class AnimationView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.timerHandle = new Timeout();
        this.startPlay();
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.timerHandle) {
            this.timerHandle.clear();
        }
    }

    async startPlay() {
        this.animation.play();
        await this.timerHandle.set(2000);
        this.setState({current: 1});
        this.animation.play();
        await this.timerHandle.set(2000);
        this.setState({current: 2});
        this.animation.play();
        await this.timerHandle.set(2000);
        this.props.navigation.state.params.onGoBack(this.mounted);
    }

    render() {
        let source = [require('../../../assets/json/machine.json'), require('../../../assets/json/city.json'), require('../../../assets/json/drink.json')];
        return (
            <LottieView
                style={styles.container}
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