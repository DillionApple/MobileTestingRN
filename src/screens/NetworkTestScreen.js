import React from 'react'
import {View, Text} from "react-native"

class NetworkTestScreen extends React.Component {
    static navigationOptions = {
        title: 'Network Test',
    };
    render() {
        return(
            <View>
                <Text>This page is for network test</Text>
            </View>
        )
    }
}

export default NetworkTestScreen