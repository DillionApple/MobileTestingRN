import React from 'react'

import {createStackNavigator} from 'react-navigation'

import HomeScreen from "./screens/HomeScreen"
import NetworkTestScreen from "./screens/NetworkTestScreen"
import MapTestNavigator from "./screens/MapTestCases/MapTestNavigator"
import UITestScreen from "./screens/UITest/UITestScreen"
import VideoTestNavigator from "./screens/VideoTest/VideoTestNavigator"
import FileSystemScreen from "./screens/FileSystemTest/FileSystemScreen"
import FileDownloaderNavigator from "./screens/FileDownloaderTest/FileDownloaderNavigator"
import CameraScreen from "./screens/CameraTest/CameraScreen"

const rootRouteConfigMap = {
    Home: {screen: HomeScreen}
};

export const routeConfigMap = {
    //NetworkTest: {screen: NetworkTestScreen},
    MapTest: {screen: MapTestNavigator},
    UITest: {screen: UITestScreen},
    VideoTest: {screen: VideoTestNavigator},
    BGTaskScreen: {screen: FileSystemScreen},
    FileDownloaderTest: {screen: FileDownloaderNavigator},
    CameraScreen: {screen: CameraScreen}
};

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