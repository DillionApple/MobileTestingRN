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
                <Button title="AnimatedMarkers" onPress={()=>navigate("MapTest_AnimatedMarkers")}/>
                <Button title="AnimatedNavigation" onPress={()=>navigate("MapTest_AnimatedNavigation")}/>
                <Button title="DisplayLatLng" onPress={()=>navigate("MapTest_DisplayLatLng")}/>
                <Button title="ViewsAsMarkers" onPress={()=>navigate("MapTest_ViewsAsMarkers")}/>
                <Button title="EventListener" onPress={()=>navigate("MapTest_EventListener")}/>
                <Button title="MarkerTypes" onPress={()=>navigate("MapTest_MarkerTypes")}/>
                <Button title="DraggableMarkers" onPress={()=>navigate("MapTest_DraggableMarkers")}/>
                <Button title="PloygonCreator" onPress={()=>navigate("MapTest_PolygonCreator")}/>
                <Button title="DefaultMarkers" onPress={()=>navigate("MapTest_DefaultMarkers")}/>
            </View>
        )
    }
}

export default MapTestScreen