import React from 'react'
import {View, Text} from "react-native"

class UITestScreen extends React.Component {
    static navigationOptions = {
        title: "UI Test",
    };
    render() {
        return(
            <View>
                <Text>This page is for UI test</Text>
            </View>
        )
    }
}

export default UITestScreen