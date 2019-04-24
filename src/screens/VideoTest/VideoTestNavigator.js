import React from "react"

import { createStackNavigator } from "react-navigation";

import VideoTestRootScreen from "./VideoTestRootScreen"
import VideoActionAndAnimation from "./VideoActionAndAnimation"

const VideoTestNavigator = createStackNavigator(
    {
        VideoTestRootScreen: {screen: VideoTestRootScreen},
        VideoActionAndAnimation: {screen: VideoActionAndAnimation},
    },
    {
        headerMode: 'none',
    }
);

export default VideoTestNavigator