import React from 'react'
import { createStackNavigator } from "react-navigation";

import MapTestScreen from "./MapTestScreen"
import AnimatedMarkers from "./AnimatedMarkers";
import AnimatedNavigation from "./AnimatedNavigation";
import DisplayLatLng from "./DisplayLatLng";
import ViewsAsMarkers from "./ViewsAsMarkers";
import EventListener from "./EventListener";
import MarkerTypes from "./MarkerTypes";
import DraggableMarkers from "./DraggableMarkers";
import PolygonCreator from "./PolygonCreator";
import DefaultMarkers from "./DefaultMarkers";

export const MapTestNavigator = createStackNavigator({
    Main: {screen: MapTestScreen},
    AnimatedMarkers: {screen: AnimatedMarkers},
    AnimatedNavigation: {screen: AnimatedNavigation},
    DisplayLatLng: {screen: DisplayLatLng},
    ViewsAsMarkers: {screen: ViewsAsMarkers},
    EventListener: {screen: EventListener},
    MarkerTypes: {screen: MarkerTypes},
    DraggableMarkers: {screen: DraggableMarkers},
    PolygonCreator: {screen: PolygonCreator},
    DefaultMarkers: {screen: DefaultMarkers},
}, {
    headerMode: "none",
});

class MapTestNavigatorScreen extends React.Component {

    static router = MapTestNavigator.router;
    static testCase;

    componentDidMount(): void {
        const {navigation} = this.props;
        navigation.navigate("AnimatedMarks")
        setTimeout(navigation.navigate, 1000, "AnimatedMarkers");
        setTimeout(navigation.pop, 2000);
    }

    render() {
        const {navigation} = this.props;
        return <MapTestNavigator navigation={navigation} />
    }
}

export default MapTestNavigatorScreen;