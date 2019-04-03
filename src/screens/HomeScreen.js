import React from 'react'
import {Button, Text, View} from 'react-native'

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };
    render() {
        const {navigate} = this.props.navigation;
        return(
            <View>
                <Button title="Network Test" onPress={() => navigate('NetworkTest')}/>
                <Button title="UI Test" onPress={() => navigate('UITest')}/>
            </View>
        )
    }
}

export default HomeScreen