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

    REPEAT_COUNT = 1000;

    constructor() {
        super();
        this.state = {
            audioList: [],
            isPlay: false,
            isPause: false,
        };
        this.logger = new MTLogger('AudioPlayList');
        this.Sound = require('react-native-sound');
        this.Sound.setCategory('Playback');
        this.curSound = null;
        this.soundDuration = 0;
        this.soundList = [
            require('../../../assets/A.mp3'),
            require('../../../assets/B.mp3'),
            require('../../../assets/C.mp3')
        ]
        this.logger = new MTLogger('AudioPlayList');
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
            // this.logger.start('_onPlay');
            // let index = Math.floor(Math.random() * this.soundList.length);
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
                        }
                        // this.logger.end('_onPlay');
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
            this.logger.start('_onPause');
            this.setState({'isPause': true});
            this.curSound.pause();
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this.curSound.play();
                this.curSound.pause();
            }
            this.logger.end('_onPause');
        } catch (e) {
            console.log(e);
        }
    };

    _onResume = () => {
        try {
            this.logger.start('_onResume');
            this.curSound.play();
            this.setState({'isPause': false});
            this.logger.end('_onResume');
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
            this.logger.start('_forward');
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this.curSound.getCurrentTime((seconds) => this._seek(seconds + time));
            }
            this.logger.end('_forward');
        } catch (e) {
            console.log(e);
        }
    };

    _backward = (time) => {
        try {
            this.logger.start('_backward');
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this.curSound.getCurrentTime((seconds) => this._seek(seconds - time));
            }
            this.logger.end('_backward');
        } catch (e) {
            console.log(e);
        }
    };

    _onStop = () => {
        this.logger.start('_onStop');
        this.setState({'isPlay': false});
        try {
            this.curSound.stop();
            this.curSound.release();
            this.curSound = null;
            this.logger.end('_onStop');
        } catch (e) {
            console.log(e);
        }
    };

    _volumeUp = () => {
        try {
            this.logger.start('_volumeUp');
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this._onSetVolume(this.curSound.getVolume() + 0.1);
            }
            this.logger.end('_volumeUp');
        } catch (e) {
            console.log(e);
        }
    };
    _volumeDown = () => {
        try {
            this.logger.start('_volumeDown');
            // repeater mark
            for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
                this._onSetVolume(this.curSound.getVolume() - 0.1);
            }
            this.logger.end('_volumeDown');
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