import React from 'react'
import BaseScreenComponent from "../../components/BaseScreenComponent";
import AudioPlayScreen from 'react-native-sound-playerview'

class AudioPlay extends BaseScreenComponent {

    slotRender() {
        return (
            <AudioPlayScreen title={this.props.title} filepath={this.props.filepath}/>
        )
    }
}


export default AudioPlay