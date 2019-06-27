import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import {AudioRecorder, AudioUtils} from 'react-native-audio';

class AudioScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    slotRender() {

    }

    recordAudio = async function () {
        try {
            let audioPath = AudioUtils.DocumentDirectoryPath + '/MobileTesting/audio.aac';
            if (this.state.isAudioRecording) {
                console.warn('Already recording!');
                return;
            } else {
                AudioRecorder.prepareRecordingAtPath(audioPath, {
                    SampleRate: 22050,
                    Channels: 1,
                    AudioQuality: "Low",
                    AudioEncoding: "aac",
                    AudioEncodingBitRate: 32000
                });
            }

            this.setState({isAudioRecording: true});
            const filePath = await AudioRecorder.startRecording();
        } catch (error) {
            console.log(`err : ${err}`);f
        }
    };

    stopRecordingAudio = async function () {
        try {
            if (!this.state.isAudioRecording) {
                console.warn('Can\'t stop, not recording!');
                return;
            }
            this.setState({isAudioRecording: false});
            const filePath = await AudioRecorder.stopRecording();
            return filePath;
        } catch (error) {
            console.log(`err : ${err}`);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

export default AudioScreen