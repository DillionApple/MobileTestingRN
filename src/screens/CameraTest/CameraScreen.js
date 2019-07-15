import React from 'react';
import {Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import {AudioRecorder, AudioUtils} from 'react-native-audio';

class CameraScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            showFirstCamara: false,
            isTakingPicture: false,
            isRecording: false,
            isAudioRecording: false
        }
    }

    slotRender() {
        // setTimeout(() => {
        //     this.setState({showFirstCamara: false});
        // }, 2000);
        if (this.state.showFirstCamara) {
            return (
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    />
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                    />
                    <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
                        {!this.state.isTakingPicture ?
                            <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
                                <Text style={{fontSize: 10}}>|-SNAP-|</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={this.retakePicture.bind(this)} style={styles.capture}>
                                <Text style={{fontSize: 10}}>|-SNAP-|</Text>
                            </TouchableOpacity>}
                        {!this.state.isRecording ?
                            <TouchableOpacity onPress={this.recordVideo.bind(this)} style={styles.capture}>
                                <Text style={{fontSize: 10}}>|-RECORDING-|</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={this.stopRecordingVideo.bind(this)} style={styles.capture}>
                                <Text style={{fontSize: 10}}>|-RECORDING-|</Text>
                            </TouchableOpacity>}
                        {/*{!this.state.isAudioRecording ?*/}
                        {/*    <TouchableOpacity onPress={this.recordAudio.bind(this)} style={styles.capture}>*/}
                        {/*        <Text style={{fontSize: 10}}> |-AUDIOREC-| </Text>*/}
                        {/*    </TouchableOpacity> :*/}
                        {/*    <TouchableOpacity onPress={this.stopRecordingAudio.bind(this)} style={styles.capture}>*/}
                        {/*        <Text style={{fontSize: 10}}> |-STOPAUDIOREC-| </Text>*/}
                        {/*    </TouchableOpacity>}*/}
                    </View>
                </View>
            );
        }
    }

    takePicture = async function () {
        if (this.camera) {
            try {
                console.log(`function takePicture starts`);
                const options = {quality: 0.5, base64: true};
                this.setState({
                    isTakingPicture: true
                });
                const data = await this.camera.takePictureAsync(options);
                console.log(data.uri);
                this.camera.pausePreview();
            } catch (err) {
                console.log(`err : ${err}`);
            }
        }
    };
    retakePicture = async function () {
        if (this.camera) {
            try {
                this.setState({
                    isTakingPicture: false
                });
                this.camera.resumePreview();
            } catch (err) {
                console.log(`err : ${err}`);
            }
        }
    };
    recordVideo = async function () {
        if (this.camera) {
            try {
                console.log(`function recordVideo starts`);
                const options = {quality: 'RNCamera.Constants.VideoQuality.720p'};
                const options2 = {quality: 'RNCamera.Constants.VideoQuality.1080p'};
                this.setState({
                    isRecording: true
                });
                const data = await this.camera.recordAsync(options);
                const data2 = await this.camera.recordAsync(options2);
            } catch (err) {
                console.log(`err : ${err}`);
            }

        }
    };
    stopRecordingVideo = async function () {
        if (this.camera && this.state.isRecording) {
            try {
                this.setState({
                    isRecording: false
                });
                const data = await this.camera.stopRecording();
            } catch (err) {
                console.log(`err : ${err}`);
            }
        }
    };
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

export default CameraScreen