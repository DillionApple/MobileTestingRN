import React from "react";
import BaseScreenComponent from "../../components/BaseScreenComponent";
import {
    StyleSheet,
    View,
    Text,
    TouchableHighlight
} from 'react-native';
import MTLogger from "../../components/Logger";

class AudioPlayList extends BaseScreenComponent {

    constructor() {
        super();
        this.state = {
            audioList: [],
            isPlay: false,
            isPause: false,
        };
        this.logger = new MTLogger(this.constructor.name);
        this.Sound = require('react-native-sound');
        this.Sound.setCategory('Playback');
        this.curSound = null;
        this.soundDuration = 0;
        this.soundList = [
            require('../../../assets/A.mp3'),
            require('../../../assets/B.mp3'),
            require('../../../assets/C.mp3')
        ]
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

    _onPlay = () => {
        try {
            let index = Math.floor(Math.random() * this.soundList.length);
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

    _onPause = () => {
        try {
            this.setState({'isPause': true});
            this.curSound.pause();
        } catch (e) {
            console.log(e);
        }
    };

    _onResume = () => {
        try {
            this.curSound.play();
            this.setState({'isPause': false});
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

    _forward = (time) => {
        try {
            this.curSound.getCurrentTime((seconds) => this._seek(seconds + time));
        } catch (e) {
            console.log(e);
        }
    };

    _backward = (time) => {
        try {
            this.curSound.getCurrentTime((seconds) => this._seek(seconds + time));
        } catch (e) {
            console.log(e);
        }
    };

    _onStop = () => {
        this.setState({'isPlay': false});
        try {
            this.curSound.stop();
            this.curSound.release();
            this.curSound = null;
        } catch (e) {
            console.log(e);
        }
    };

    _volumeUp = () => {
        try {
            this._onSetVolume(this.curSound.getVolume() + 0.1);
        } catch (e) {
            console.log(e);
        }
    };
    _volumeDown = () => {
        try {
            this._onSetVolume(this.curSound.getVolume() - 0.1);
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
                    : this._renderButton("|-Resume-|", () => {
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