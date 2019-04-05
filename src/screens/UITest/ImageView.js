import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

class ImageViewTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageListStyle: []
        };
    }

    componentDidMount() {
        this.start();

    }

    // [0,max)
    randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    async start() {
        let choices = [styles.small, styles.middle, styles.large];
        for (const i of Array(10).keys()) {
            this.setState({imageListStyle: []});
            const elementsCount = this.randomInt(5) + 1;
            for (const j of Array(elementsCount).keys()) {
                await new Promise((resolve) => setTimeout(() => {
                    let list = this.state.imageListStyle;
                    list.push(choices[this.randomInt(3)]);
                    this.setState({imageListStyle: list});
                    resolve();
                }, 300));
            }
        }
        this.props.navigation.state.params.onGoBack();
    }

    render() {
        const imageList = [];
        for (let imageStyle of this.state.imageListStyle) {
            imageList.push(
                <Image
                    style={imageStyle}
                    source={require('../../../assets/images/scenery.jpeg')}
                />
            )
        }

        return (
            <View style={styles.container}>{imageList}</View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 10
    },
    small: {width: 150, height: 100},
    middle: {width: 200, height: 150},
    large: {width: 250, height: 200}
});
export default ImageViewTest;