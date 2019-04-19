import React from 'react'

import {createStackNavigator} from 'react-navigation'

import HomeScreen from "./screens/HomeScreen"
import NetworkTestScreen from "./screens/NetworkTestScreen"
import MapTestNavigator from "./screens/MapTestCases/MapTestNavigator"
import UITestScreen from "./screens/UITest/UITestScreen"
import VideoTestScreen from "./screens/VideoTest/VideoTestScreen"

const rootRouteConfigMap = {
    Home: {screen: HomeScreen}
};

export const routeConfigMap = {
    NetworkTest: {screen: NetworkTestScreen},
    MapTest: {screen: MapTestNavigator},
    UITest: {screen: UITestScreen},
    VideoTest: {screen: VideoTestScreen},
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