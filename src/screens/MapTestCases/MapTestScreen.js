import React from 'react'

import {View, Button, Text} from 'react-native'

import AnimatedMarkers from "./AnimatedMarkers";
import AnimatedNavigation from "./AnimatedNavigation";
import DisplayLatLng from "./DisplayLatLng";
import ViewsAsMarkers from "./ViewsAsMarkers";
import EventListener from "./EventListener";
import MarkerTypes from "./MarkerTypes";
import DraggableMarkers from "./DraggableMarkers";
import PolygonCreator from "./PolygonCreator";
import DefaultMarkers from "./DefaultMarkers";

class MapTestScreen extends React.Component {
    static navigationOptions = {
        title: 'Map Test',
    };

    static testCaseMap = {
        0: AnimatedMarkers,
        1: AnimatedNavigation,
        2: DisplayLatLng,
        3: ViewsAsMarkers,
        4: EventListener,
        5: MarkerTypes,
        6: DraggableMarkers,
        7: PolygonCreator,
        8: DefaultMarkers,
    }

    constructor(props) {
        super(props);
        this.state = {
            componentIndex: 0,
        }
    };

    childFinish(){
        this.setState({componentIndex: this.state.componentIndex + 1})
        this.forceUpdate()
    }

    renderComponent(index) {

        let Component = MapTestScreen.testCaseMap[index];

        if (Component) {
          return <Component testFinish={() => this.childFinish()} />;
        } else {
            this.props.navigation.pop();
            return (<Text>All test done!</Text>);
        }
    }

    render() {
        return(
            this.renderComponent(this.state.componentIndex)
        )
    }
}

export default MapTestScreen