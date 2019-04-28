import React from "react"
import { View, Text, Button, StyleSheet } from "react-native"

import * as Progress from 'react-native-progress'
import RNFetchBlob from 'rn-fetch-blob'

import BaseScreenComponent from "../../components/BaseScreenComponent"

class FileDownloader extends BaseScreenComponent {

    STATUS_CANCELED = "CANCELED";
    STATUS_STARTED = "STARTED";
    STATUS_PAUSED = "PAUSED";
    STATUS_FINISHED = "FINISHED";

    //DOWNLOAD_URL = "https://dl.google.com/dl/android/studio/install/3.4.0.18/android-studio-ide-183.5452501-mac.dmg";
    DOWNLOAD_URL = "http://ipv4.download.thinkbroadband.com/5MB.zip";
    DOWNLOAD_DEST = RNFetchBlob.fs.dirs.DocumentDir + "/5MB.zip";
    promise = null;

    constructor(props) {
        super(props);
        this.state = {
            downloadProgress: 0,
            loaded: 0,
            total: 0,
            finished: false,
            paused: true,
        };
        RNFetchBlob.fs.unlink(this.DOWNLOAD_DEST).catch((err) => {})
    }

    componentDidMount() {

    }

    componentWillUnmount(): void {
        this.promise.cancel((err) => {alert("Canceled!")})
    }

    startClicked() {
        if (this.state.finished) {
            return
        }
        this.state.paused = false;
        RNFetchBlob.fs.exists(this.DOWNLOAD_DEST).then(
            (exist) => {
                if (exist) {
                    return RNFetchBlob.fs.stat(this.DOWNLOAD_DEST).then((stat) => stat)
                } else {
                    return Promise.resolve({size: 0})
                }
            }
        ).then((stat) => {
            this.promise = RNFetchBlob
                .config({
                    path: this.DOWNLOAD_DEST,
                    overwrite: false,
                })
                .fetch("GET", this.DOWNLOAD_URL, {
                    Range: `bytes=${stat.size}-`
                });
            this.promise.progress((loaded, total) => {
                loaded = parseInt(loaded);
                total = parseInt(total);
                if (this.state.total != 0) {

                    this.setState({
                        loaded: this.state.total - total + loaded,
                        downloadProgress: (this.state.total - total + loaded) / this.state.total
                    })
                } else {
                    this.setState({
                        loaded: loaded,
                        total: total,
                        downloadProgress: loaded / total
                    })
                }
            });
            this.promise
                .then((res) => {
                    if (this.state.paused == true) {
                        return;
                    }
                    this.setState({
                        finished: true,
                        loaded: this.state.total,
                        downloadProgress: 1,
                    })
                })
                .catch((err) => {})
        });

    }

    cancelClicked() {
        if (this.promise) {
            this.setState({paused: true});
            this.promise.cancel((err) => {alert("Canceled!")})
        }
    }

    deleteClicked() {
        if (this.promise) {
            this.setState({paused: true});
            this.promise.cancel((err) => {
                alert("Canceled!")
            });
            RNFetchBlob.fs.unlink(this.DOWNLOAD_DEST).catch((err) => {
            });
            this.setState({
                loaded: 0,
                total: 0,
                downloadProgress: 0,
                finished: false,
            })
        }
    }

    slotRender() {
        return (
            <View style={styles.container}>
                <Progress.Bar progress={this.state.downloadProgress} height={20}/>
                <Text>{(this.state.loaded/1024/1024).toFixed(2)}MB / {(this.state.total/1024/1024).toFixed(2)}MB</Text>
                <Button title="Start" onPress={() => {this.startClicked()}} />
                <Button title="Cancel" onPress={() => {this.cancelClicked()}} />
                <Button title="Delete" onPress={() => {this.deleteClicked()}} />
            </View>
        )
    }

}

export default FileDownloader

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});