import React from 'react'

import { View, StyleSheet } from 'react-native'
import SingleVideo from "./SingleVideo";
import BaseScreenComponent from "../../components/BaseScreenComponent";

class VideoTestScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
    }

    slotRender() {
        return (
            <SingleVideo/>
        )
    }
}

export default VideoTestScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#AAAAAA",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems:"center",
    },
});