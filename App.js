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
import UITestScreen from "./src/screens/UITest/UITestScreen"
import MapTestScreen from "./src/screens/MapTestCases/MapTestScreen"

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  NetworkTest: {screen: NetworkTestScreen},
  UITest: {screen: UITestScreen},
  MapTest: {screen: MapTestScreen},
});

const App = createAppContainer(MainNavigator)

export default App

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
