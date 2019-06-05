import React from 'react'
import {View, Button, Text, StyleSheet} from 'react-native'

import BaseScreenComponent from '../../components/BaseScreenComponent'

import ImageViewer from 'react-native-image-zoom-viewer'

export default class ImageViewerScreen extends BaseScreenComponent {

    images = [{
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-desktop-v1.png',
    }, {
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-desktop-v2.png',
    }, {
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-desktop-v3.png',
    }, {
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-desktop-v4.png',
    }, {
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-Desktop-v1-White.png',
    }, {
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-Desktop-v2-Black.png',
    }, {
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-Desktop-v3-White.png',
    }, {
        url: 'https://media.idownloadblog.com/wp-content/uploads/2019/03/WWDC-2019-Wallpaper-AR72014-Desktop-v4-Black.png',
    }];

    constructor(props) {
        super(props);
        this.state = {
            imageIndex: 0
        }
    }

    renderArrowLeft() {
        return (
            <Text style={styles.buttonText}>{"|-previous-|"}</Text>
        )
    }

    renderArrowRight() {
        return (
            <Text style={styles.buttonText}>{"|-next-|"}</Text>
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
        backgroundColor: "rgba(200, 200, 200, 0.1)",
        fontSize: 20
    }
});