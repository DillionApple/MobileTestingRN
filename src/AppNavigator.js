import React from 'react'

import {createStackNavigator} from 'react-navigation'

import HomeScreen from "./screens/HomeScreen"
import NetworkTestScreen from "./screens/NetworkTestScreen"
import MapTestNavigator from "./screens/MapTestCases/MapTestNavigator"
import UITestScreen from "./screens/UITest/UITestScreen"
import VideoTestNavigator from "./screens/VideoTest/VideoTestNavigator"
import FileDownloader from "./screens/FileDownloaderTest/FileDownloader"

const rootRouteConfigMap = {
    Home: {screen: HomeScreen}
};

export const routeConfigMap = {
    NetworkTest: {screen: NetworkTestScreen},
    MapTest: {screen: MapTestNavigator},
    UITest: {screen: UITestScreen},
    VideoTest: {screen: VideoTestNavigator},
    FileDownloaderTest: {screen: FileDownloader}
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