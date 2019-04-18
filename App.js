/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {createStackNavigator, createAppContainer} from "react-navigation"

import HomeScreen from "./src/screens/HomeScreen"
import NetworkTestScreen from "./src/screens/NetworkTestScreen"
import MapTestNavigator from "./src/screens/MapTestCases/MapTestNavigator"
import UITestScreen from "./src/screens/UITest/UITestScreen"
import VideoTestScreen from "./src/screens/VideoTest/VideoTestScreen"


const AppNavigator = createStackNavigator(
    {
      Home: {screen: HomeScreen},
      NetworkTest: {screen: NetworkTestScreen},
      MapTest: {screen: MapTestNavigator},
      UITest: {screen: UITestScreen},
      VideoTest: {screen: VideoTestScreen},
    },
    {
      mode: 'modal',
      headerMode: 'none',
    }
);

const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component<Props> {
  render() {
    return(
        <AppContainer/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
