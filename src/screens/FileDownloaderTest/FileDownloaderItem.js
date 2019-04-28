import React from 'react'

import { View, Text, Button, Dimensions, StyleSheet } from 'react-native'

import * as Progress from 'react-native-progress'
import RNFetchBlob from "rn-fetch-blob";


class FileDownloaderItem extends React.Component {

    filename = null;
    downloadUrl = null;
    downloadDest = null;
    promise = null;

    lastTimestamp = 0;
    lastLoaded = 0;

    constructor(props) {
        super(props);
        this.downloadUrl = this.props.downloadUrl;
        this.filename = this.props.filename;
        this.downloadDest = `${RNFetchBlob.fs.dirs.DocumentDir}/${this.filename}`;
        this.state = {
            downloadProgress: 0,
            loaded: 0,
            total: 0,
            finished: false,
            paused: true,
            speed: "",
        };
        RNFetchBlob.fs.unlink(this.downloadDest).catch((err) => {})
    }

    componentWillUnmount() {
        this.deleteClicked()
    }

    startClicked() {
        if (this.state.finished) {
            return
        }
        this.state.paused = false;
        RNFetchBlob.fs.exists(this.downloadDest).then(
            (exist) => {
                if (exist) {
                    return RNFetchBlob.fs.stat(this.downloadDest).then((stat) => stat)
                } else {
                    return Promise.resolve({size: 0})
                }
            }
        ).then((stat) => {
            this.promise = RNFetchBlob
                .config({
                    path: this.downloadDest,
                    overwrite: false,
                })
                .fetch("GET", this.downloadUrl, {
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
                let timestamp = Date.now();
                let duration = (timestamp - this.lastTimestamp) / 1000;
                let increase = (this.state.loaded - this.lastLoaded) / 1024 / 1024;
                let speed = (increase / duration).toFixed(2);
                if (speed >= 0) {
                    this.setState({speed: `${speed}MB/S`});
                }
                this.lastTimestamp = timestamp;
                this.lastLoaded = this.state.loaded;
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

    pauseClicked() {
        if (this.promise) {
            this.setState({paused: true, speed: ""});
            this.promise.cancel((err) => {})
        }
    }

    deleteClicked() {
        this.pauseClicked();
        RNFetchBlob.fs.unlink(this.downloadDest).catch((err) => {});
        this.setState({
            loaded: 0,
            total: 0,
            downloadProgress: 0,
            finished: false,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text>{this.filename}</Text>
                    <Text>{(this.state.loaded/1024/1024).toFixed(2)}MB / {(this.state.total/1024/1024).toFixed(2)}MB</Text>
                </View>
                <Progress.Bar style={styles.progressBar} progress={this.state.downloadProgress} height={20}/>
                <View style={styles.footerContainer}>
                    <Text>{this.state.speed}</Text>
                    <View style={styles.footerButtons}>
                        <Button style={styles.button} title="|-Start-|" onPress={() => {this.startClicked()}} />
                        <Button style={styles.button} title="|-Pause-|" onPress={() => {this.pauseClicked()}} />
                        <Button style={styles.button} title="|-Delete-|" onPress={() => {this.deleteClicked()}} />
                    </View>
                </View>
            </View>
        )
    }

}

export default FileDownloaderItem

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    progressBar: {
        width: null,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        //backgroundColor: 'green',
    },
    button: {
        margin: 2
    }
});