import React from 'react';
import {Dimensions, View, Image, StyleSheet} from 'react-native';
import Timeout from 'await-timeout';

class ImageViewTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressure: false,
            imageListStyle: [],
            deviceWidth: Dimensions.get('window').width,
            deviceHeight: Dimensions.get('window').height
        };
    }

    componentDidMount() {
        this.mounted = true;
        this.timerHandle = new Timeout();
        this.start();
    }

    componentWillUnmount() {
        this.mounted = false;
        if (this.timerHandle) {
            this.timerHandle.clear();
        }
    }

    // [0,max)
    randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    async start() {
        let choices = [styles.small, styles.middle, styles.large, styles.extraLarge];
        for (const i of Array(5).keys()) {
            this.setState({imageListStyle: []});
            if (i < 3) {
                const elementsCount = this.randomInt(5) + 1;
                for (const j of Array(elementsCount).keys()) {
                    await this.timerHandle.set(300);
                    let list = this.state.imageListStyle;
                    list.push(choices[this.randomInt(3)]);
                    this.setState({imageListStyle: list})
                }
            } else {
                this.setState({pressure: true});
                const elementsCount = 300;
                for (const j of Array(elementsCount).keys()) {
                    await this.timerHandle.set(1);
                    let list = this.state.imageListStyle;
                    list.push(choices[3]);
                    this.setState({imageListStyle: list});
                }
            }
        }
        this.props.navigation.state.params.onGoBack(this.mounted);
    }

    render() {
        const imageList = [];
        if (this.state.pressure === false) {
            for (let i in this.state.imageListStyle) {
                let imageStyle = this.state.imageListStyle[i];
                imageList.push(
                    <Image
                        style={imageStyle}
                        source={require('../../../assets/images/scenery.jpeg')}
                        key={i}
                    />
                )
            }
        } else {
            for (let i in this.state.imageListStyle) {
                let imageStyle = this.state.imageListStyle[i];
                imageList.push(
                    <Image
                        style={imageStyle}
                        source={require('../../../assets/images/largepicture.jpg')}
                        key={i}
                    />
                )
            }
        }


        return (
            <View style={styles.container}>{imageList}</View>
        );
    }
}

const styles = StyleSheet.create({
        container: {
            flexDirection: 'column',
            flex: 1,
            margin: 10
        },
        small: {width: 150, height: 100},
        middle: {width: 200, height: 150},
        large: {width: 250, height: 200},
        extraLarge: {
            position: 'relative',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 300,
            height: 100,
            flex: 1
        }
    })
;
export default ImageViewTest;