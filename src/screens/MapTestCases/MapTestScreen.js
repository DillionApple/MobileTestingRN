import React from 'react'

import {View, Button, Text} from 'react-native'

class MapTestScreen extends React.Component {
    static navigationOptions = {
        title: 'Map Test',
    };
    render() {

        const {navigate} = this.props.navigation;

        return(
            <View>
                <Button title="AnimatedMarkers" onPress={()=>navigate("AnimatedMarkers")}/>
                <Button title="AnimatedNavigation" onPress={()=>navigate("AnimatedNavigation")}/>
                <Button title="DisplayLatLng" onPress={()=>navigate("DisplayLatLng")}/>
                <Button title="ViewsAsMarkers" onPress={()=>navigate("ViewsAsMarkers")}/>
                <Button title="EventListener" onPress={()=>navigate("EventListener")}/>
                <Button title="MarkerTypes" onPress={()=>navigate("MarkerTypes")}/>
                <Button title="DraggableMarkers" onPress={()=>navigate("DraggableMarkers")}/>
                <Button title="PloygonCreator" onPress={()=>navigate("PolygonCreator")}/>
                <Button title="DefaultMarkers" onPress={()=>navigate("DefaultMarkers")}/>
            </View>
        )
    }
}

export default MapTestScreen