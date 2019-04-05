import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

class ImageViewTest extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.small}
                    source={require('../../../assets/images/react_logo.png')}
                />
                <Image
                    style={styles.middle}
                    source={require('../../../assets/images/react_logo.png')}
                />
                <Image
                    style={styles.large}
                    source={require('../../../assets/images/react_logo.png')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'red',
        flexDirection: 'row'
    },
    small: {width: 10, height: 10},
    middle: {width: 30, height: 30},
    large:{width: 100, height: 100}
});
export default ImageViewTest;