/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import HomeScreen from "./src/screens/HomeScreen"
import NetworkTestScreen from "./src/screens/NetworkTestScreen"
import UITestScreen from "./src/screens/UITestScreen"
import MapTestScreen from "./src/screens/MapTestScreen"
import AnimatedMarkers from "./src/screens/MapTestCases/AnimatedMarkers";

import {createStackNavigator, createAppContainer} from "react-navigation"
import AnimatedNavigation from "./src/screens/MapTestCases/AnimatedNavigation";
import DisplayLatLng from "./src/screens/MapTestCases/DisplayLatLng";
import ViewsAsMarkers from "./src/screens/MapTestCases/ViewsAsMarkers";
import EventListener from "./src/screens/MapTestCases/EventListener";
import MarkerTypes from "./src/screens/MapTestCases/MarkerTypes";
import DraggableMarkers from "./src/screens/MapTestCases/DraggableMarkers";
import PolygonCreator from "./src/screens/MapTestCases/PolygonCreator";
import DefaultMarkers from "./src/screens/MapTestCases/DefaultMarkers";

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  NetworkTest: {screen: NetworkTestScreen},
  UITest: {screen: UITestScreen},
  MapTest: {screen: MapTestScreen},
  MapTest_AnimatedMarkers: {screen: AnimatedMarkers},
  MapTest_AnimatedNavigation: {screen: AnimatedNavigation},
  MapTest_DisplayLatLng: {screen: DisplayLatLng},
  MapTest_ViewsAsMarkers: {screen: ViewsAsMarkers},
  MapTest_EventListener: {screen: EventListener},
  MapTest_MarkerTypes: {screen: MarkerTypes},
  MapTest_DraggableMarkers: {screen: DraggableMarkers},
  MapTest_PolygonCreator: {screen: PolygonCreator},
  MapTest_DefaultMarkers: {screen: DefaultMarkers},
}, {
  initialRouteName: 'Home',
  defaultNavigationOptions: {
  }
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
