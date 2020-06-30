import React from "react";
import BaseScreenComponent from "../../components/BaseScreenComponent";
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import log_performance_origin from "../../components/LogDecorator";

let log_performance = log_performance_origin("AudioPlayList");

class AudioPlayList extends BaseScreenComponent {
    REPEAT_COUNT = 1;

    constructor() {
        super();
        this.state = {
            audioList: [],
            isPlay: false,
            isPause: false,
        };
        this.Sound = require('react-native-sound');
        this.Sound.setCategory('Playback');
        this.curSound = null;
        this.soundDuration = 0;
        this.soundList = [
            require('../../../assets/A.mp3'),
            require('../../../assets/B.mp3'),
            require('../../../assets/C.mp3')
        ];
    }

    _renderButton = (title, onPress) => {
        return (
            <TouchableHighlight style={styles.button} onPress={onPress}>
                <Text style={styles.buttonText}>
                    {title}
                </Text>
            </TouchableHighlight>
        );
    };
    @log_performance
    _onPlay() {
        try {
            let index = 0;
            this.curSound = new this.Sound(this.soundList[index], (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                }
                this.soundDuration = this.curSound.getDuration();
                setTimeout(() => {
                    this.curSound && this.curSound.play((success) => {
                        if (success) {
                            console.log('successfully finished playing');
                            this.setState({'isPlay': true});
                            super.forceUpdate();
                        }
                    });
                }, 100)
            });
        } catch (e) {
            console.log(e);
        }
    };

    _onSetVolume = (volumeVal) => {
        try {
            let fixedVolumeVal = volumeVal > 1 ? 1 : volumeVal < 0 ? 0 : volumeVal;
            this.curSound.setVolume(fixedVolumeVal);
        } catch (e) {
            console.log(e);
        }
    };

    @log_performance
    _onPause() {
        try {
            this.setState({'isPause': true});
            this.forceUpdate();
            this.curSound.pause();
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this.curSound.play();
                this.curSound.pause();
            }
        } catch (e) {
            console.log(e);
        }
    };

    @log_performance
    _onResume() {
        try {
            this.curSound.play();
            this.setState({'isPause': false});
            this.forceUpdate();
        } catch (e) {
            console.log(e);
        }
    };

    _seek = (pos) => {
        try {
            this.curSound.setCurrentTime(pos);
        } catch (e) {
            console.log(e);
        }
    };

    @log_performance
    _forward(time) {
        try {
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this.curSound.getCurrentTime((seconds) => this._seek(seconds + time));
            }
        } catch (e) {
            console.log(e);
        }
    };

    @log_performance
    _backward(time) {
        try {
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this.curSound.getCurrentTime((seconds) => this._seek(seconds - time));
            }
        } catch (e) {
            console.log(e);
        }
    };

    @log_performance
    _onStop(){
        this.setState({'isPlay': false});
        this.forceUpdate();
        try {
            this.curSound.stop();
            this.curSound.release();
            this.curSound = null;
        } catch (e) {
            console.log(e);
        }
    };

    @log_performance
    _volumeUp() {
        try {
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this._onSetVolume(this.curSound.getVolume() + 0.1);
            }
        } catch (e) {
            console.log(e);
        }
    };

    @log_performance
    _volumeDown() {
        try {
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this._onSetVolume(this.curSound.getVolume() - 0.1);
            }
        } catch (e) {
            console.log(e);
        }
    };

    slotRender() {
        return (
            <View style={styles.container}>
                {!this.state.isPlay ? this._renderButton("|-Play-|", () => {
                        this._onPlay()
                    })
                    : this._renderButton("|-Stop-|", () => {
                        this._onStop()
                    })
                }
                {!this.state.isPause ? this._renderButton("|-Pause-|", () => {
                        this._onPause()
                    })
                    : this._renderButton("|-Pause-|", () => {
                        this._onResume()
                    })
                }
                {this._renderButton("|-Forward 5s-|", () => {
                    this._forward(5)
                })
                }
                {this._renderButton("|-Backward 5s-|", () => {
                    this._backward(5)
                })
                }
                {this._renderButton("|-Volume Up-|", () => {
                    this._volumeUp()
                })
                }
                {this._renderButton("|-Volume Down-|", () => {
                    this._volumeDown()
                })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    button: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 30
    }
});

export default AudioPlayList
