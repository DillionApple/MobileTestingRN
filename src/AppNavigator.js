import React from 'react'

import {Platform} from 'react-native'

import {createStackNavigator} from 'react-navigation'

import HomeScreen from "./screens/HomeScreen"
import NetworkTestScreen from "./screens/NetworkTestScreen"
import MapTestNavigator from "./screens/MapTestCases/MapTestNavigator"
import UITestScreen from "./screens/UITest/UITestScreen"
import VideoTestNavigator from "./screens/VideoTest/VideoTestNavigator"
import FileSystemScreen from "./screens/FileSystemTest/FileSystemScreen"
import FileDownloaderNavigator from "./screens/FileDownloaderTest/FileDownloaderNavigator"
import CameraScreen from "./screens/CameraTest/CameraScreen"
import AudioScreen from "./screens/AudioTest/AudioScreen"
import AudioPlayScreen from 'react-native-sound-playerview'
import ImageViewerScreen from "./screens/ImageViewerTest/ImageViewerScreen";
import DBScreen from "./screens/DBTest/DBScreen";
import WebGLScreen from "./screens/WebGLTest/WebGLScreen";

const rootRouteConfigMap = {
    Home: {screen: HomeScreen},
    AudioPlay:{screen: AudioPlayScreen},
};

export const routeConfigMap = {
    //NetworkTest: {screen: NetworkTestScreen},
    UITest: {screen: UITestScreen},
    ImageViewerTest: {screen: ImageViewerScreen},
    CameraScreen: {screen: CameraScreen},
    VideoTest: {screen: VideoTestNavigator},
    AudioTest: {screen: AudioScreen},
    MapTest: {screen: MapTestNavigator},
    FileSystemScreen: {screen: FileSystemScreen},
    FileDownloaderTest: {screen: FileDownloaderNavigator},
    DBScreen: {screen: DBScreen},
};

if (Platform.OS === 'android') {
    routeConfigMap.WebGLScreen = {screen: WebGLScreen}
}


const AppNavigator = createStackNavigator(
    {
        ...rootRouteConfigMap,
        ...routeConfigMap,
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
);

export default AppNavigator