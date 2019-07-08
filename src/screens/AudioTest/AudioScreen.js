import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Platform,
    FlatList
} from 'react-native';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import Sound from 'react-native-sound';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import AudioClipItem from './AudioClip'

class AudioScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0.0,
            recording: false,
            paused: false,
            stoppedRecording: false,
            finished: false,
            audioPath: AudioUtils.DocumentDirectoryPath + '/test' + this.randInt(1000, 9999) + '.aac',
            hasPermission: undefined,
            audioList: []
        };
        this._loadAudioClipDir();
    }

    randInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    prepareRecordingPath(audioPath) {
        AudioRecorder.prepareRecordingAtPath(audioPath, {
            SampleRate: 22050,
            Channels: 1,
            AudioQuality: "Low",
            AudioEncoding: "aac",
            AudioEncodingBitRate: 32000
        });
    }

    _loadAudioClipDir() {
        this.RNFS = require('react-native-fs');
        this.RNFS.readDir(this.RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                // console.log(result);
                let fileArray = [];
                for (let file of result) {
                    if (file.name.includes('.aac')) {
                        fileArray.push(file);
                    }
                }
                this.setState({
                    audioList: fileArray
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    componentDidMount() {
        AudioRecorder.requestAuthorization().then((isAuthorised) => {
            this.setState({hasPermission: isAuthorised});

            if (!isAuthorised) return;

            // this.prepareRecordingPath(this.state.audioPath);

            AudioRecorder.onProgress = (data) => {
                this.setState({currentTime: Math.floor(data.currentTime)});
            };

            AudioRecorder.onFinished = (data) => {
                // Android callback comes in the form of a promise instead.
                if (Platform.OS === 'ios') {
                    this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
                }
            };
        });
    }

    _renderButton(title, onPress, active) {
        let style = (active) ? styles.activeButtonText : styles.buttonText;

        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    _renderPauseButton(onPress, active) {
        let style = (active) ? styles.activeButtonText : styles.buttonText;
        let title = this.state.paused ? "|-RESUME-|" : "|-PAUSE-|";
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={style}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    }

    async _pause() {
        if (!this.state.recording) {
            console.warn('Can\'t pause, not recording!');
            return;
        }

        try {
            const filePath = await AudioRecorder.pauseRecording();
            this.setState({paused: true});
        } catch (error) {
            console.error(error);
        }
    }

    async _resume() {
        if (!this.state.paused) {
            console.warn('Can\'t resume, not paused!');
            return;
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({paused: false});
        } catch (error) {
            console.error(error);
        }
    }

    async _stop() {
        if (!this.state.recording) {
            console.warn('Can\'t stop, not recording!');
            return;
        }

        this.setState({stoppedRecording: true, recording: false, paused: false});

        try {
            const filePath = await AudioRecorder.stopRecording();

            if (Platform.OS === 'android') {
                this._finishRecording(true, filePath);
            }
            this._loadAudioClipDir();
            return filePath;
        } catch (error) {
            console.error(error);
        }
    }

    async _randomDelete(){
        let audioList = this.state.audioList;
        if (audioList.length !== 0){
            let randPath = audioList[this.randInt(0, audioList.length - 1)].path;
            this._onDeleteClip(randPath);
        }
    }

    async _record() {
        if (this.state.recording) {
            console.warn('Already recording!');
            return;
        }

        if (!this.state.hasPermission) {
            console.warn('Can\'t record, no permission granted!');
            return;
        }

        if (this.state.stoppedRecording) {
            this.prepareRecordingPath(this.state.audioPath);
        }

        this.setState({recording: true, paused: false});

        try {
            const path = AudioUtils.DocumentDirectoryPath + '/test' + this.randInt(1000, 9999) + '.aac';
            this.setState({
                audioPath: path
            })
            this.prepareRecordingPath(path);
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.error(error);
        }
    }

    _finishRecording(didSucceed, filePath, fileSize) {
        this.setState({finished: didSucceed});
        console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and size of ${fileSize || 0} bytes`);
    }

    _keyExtractor = (item, index) => item.name;

    _renderItem = ({item}) => (
        <AudioClipItem
            id={item.name}
            onPlay={this._onPlayClip}
            onDelete={this._onDeleteClip}
            path={item.path}
            title={item.name}
        />
    );
    _onPlayClip = (path) => {
        this.props.navigation.navigate('AudioPlay', {'title': path, 'filepath': path});
    };

    _onDeleteClip = (path) => {
        console.log(path);
        this.RNFS.unlink(path)
            .then(() => {
                console.log('FILE DELETED');
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log(err.message);
            });
        this._loadAudioClipDir();
    };

    slotRender() {
        return (
            <View style={styles.container}>
                <View style={styles.controls}>
                    {this._renderButton("|-RECORD-|", () => {
                        this._record()
                    }, this.state.recording)}
                    {this._renderButton("|-STOP-|", () => {
                        this._stop()
                    })}
                    {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
                    {this._renderPauseButton(() => {
                        this.state.paused ? this._resume() : this._pause()
                    })}
                    {this._renderButton("|-RANDDEL-|", () => {
                        this._randomDelete()
                    })}
                    <Text style={styles.progressText}>{this.state.currentTime}s</Text>
                </View>
                <View>
                    <FlatList data={this.state.audioList} renderItem={this._renderItem}
                              keyExtractor={this._keyExtractor}/>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: "#2b608a"
    },
    controls: {
        height: 50,
        flexDirection: 'row'
    },
    button: {
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressText: {
        fontSize: 35,
        color: "#fff"
    },
    disabledButtonText: {
        color: '#eee'
    },
    buttonText: {
        fontSize: 18,
        color: "#fff"
    },
    activeButtonText: {
        fontSize: 20,
        color: "#B81F00"
    }

});

export default AudioScreen