import React from 'react'

import {View, Button, Text, StyleSheet} from 'react-native'

import AnimatedMarkers from "./AnimatedMarkers";
import AnimatedNavigation from "./AnimatedNavigation";
import DisplayLatLng from "./DisplayLatLng";
import DefaultMarkers from "./DefaultMarkers";
import ViewsAsMarkers from "./ViewsAsMarkers";
import EventListener from "./EventListener";
import MarkerTypes from "./MarkerTypes";
import DraggableMarkers from "./DraggableMarkers";
import PolygonCreator from "./PolygonCreator";

class MapTestScreen extends React.Component {
    static navigationOptions = {
        title: 'Map Test',
    };

    static testCaseMap = [AnimatedMarkers, AnimatedNavigation, DisplayLatLng, DefaultMarkers, ViewsAsMarkers, EventListener, MarkerTypes, DraggableMarkers, PolygonCreator,]

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
          return (
              <View style={styles.container}>
                  <Component testFinish={() => this.childFinish()} />
              </View>);
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

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapTestScreen