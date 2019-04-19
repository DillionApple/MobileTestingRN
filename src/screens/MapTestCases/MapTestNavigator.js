import React from "react"

import { createStackNavigator } from "react-navigation";

import MapTestRootScreen from "./MapTestRootScreen"
import AnimatedMarkers from "./AnimatedMarkers"
import AnimatedNavigation from "./AnimatedNavigation"
import DefaultMarkers from "./DefaultMarkers"
import ViewsAsMarkers from "./ViewsAsMarkers"
import DisplayLatLng from "./DisplayLatLng";
import EventListener from "./EventListener";
import MarkerTypes from "./MarkerTypes";
import DraggableMarkers from "./DraggableMarkers";
import PolygonCreator from "./PolygonCreator";

const rootRouteConfigMap = {
    MapTestRootScreen: {screen: MapTestRootScreen},
};

export const routeConfigMap = {
    AnimatedMarkers: {screen: AnimatedMarkers},
    AnimatedNavigation: {screen : AnimatedNavigation},
    DefaultMarkers: {screen: DefaultMarkers},
    ViewsAsMarkers: {screen: ViewsAsMarkers},
    DisplayLatLng: {screen: DisplayLatLng},
    EventListener: {screen: EventListener},
    MarkerTypes: {screen: MarkerTypes},
    DraggableMarkers: {screen: DraggableMarkers},
    PolygonCreator: {screen: PolygonCreator},
};


const MapTestNavigator = createStackNavigator(
    {
        ...rootRouteConfigMap,
        ...routeConfigMap,
    },
    {
        headerMode: 'none'
    }
);


export default MapTestNavigator