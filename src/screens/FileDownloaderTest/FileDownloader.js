import React from "react"
import { View, Text, Button, FlatList, StyleSheet } from "react-native"

import * as Progress from 'react-native-progress'

import BaseScreenComponent from "../../components/BaseScreenComponent"

import FileDownloaderItem from "./FileDownloaderItem"

class FileDownloader extends BaseScreenComponent {

    NUMBER_OF_DOWNLOADS = 0;

    items = null;

    DOWNLOAD_URL = "https://dl.google.com/dl/android/studio/install/3.4.0.18/android-studio-ide-183.5452501-mac.dmg";

    constructor(props) {
        super(props);
        this.NUMBER_OF_DOWNLOADS = this.props.navigation.getParam('numberOfDownloads', 0)
        this.items = Array.apply(null, Array(this.NUMBER_OF_DOWNLOADS)).map((value, index) => index);
    }

    slotRender() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.items}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({item}) =>
                        <View style={styles.fileDownloaderItem}>
                            <FileDownloaderItem
                                downloadUrl={this.DOWNLOAD_URL}
                                filename={`download_${item}`}
                            />
                        </View>
                    }
                />
            </View>
        )
    }

}

export default FileDownloader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DDDDDD"
    },
    fileDownloaderItem: {
        padding: 10,
        backgroundColor:"#FFFFFF",
        borderBottomColor: "#DDDDDD",
        borderBottomWidth: 2,
    }
});