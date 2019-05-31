import React from 'react'
import {View, Button, Text, StyleSheet} from 'react-native'

import BaseScreenComponent from '../../components/BaseScreenComponent'

import ImageViewer from 'react-native-image-zoom-viewer'

export default class ImageViewerScreen extends BaseScreenComponent {

    images = [{
        url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
    }, {
        url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
    }, {
        url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
    }];

    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0
        }
    }

    renderArrowLeft() {
        return (
            <Text style={styles.buttonText}> {"|-<-|"} </Text>
        )
    }

    renderArrowRight() {
        return (
            <Text style={styles.buttonText}> {"|->-|"} </Text>
        )
    }

    slotRender() {
        return (
            <View style={styles.container}>
                <ImageViewer
                    imageUrls={this.images}
                    renderArrowLeft={this.renderArrowLeft}
                    renderArrowRight={this.renderArrowRight}
                    enableSwipeDown={true}
                    enablePreload={true}
                />
            </View>
        )
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonText: {
        backgroundColor: "#00DDDD",
        fontSize: 20
    }
});