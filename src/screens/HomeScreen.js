import React from 'react'
import {Button, Text, SafeAreaView} from 'react-native'

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };
    render() {
        const {navigate} = this.props.navigation;
        return(
            <SafeAreaView>
                <Button title="Network Test" onPress={() => navigate('NetworkTest')}/>
                <Button title="UI Test" onPress={() => navigate('UITest')}/>
                <Button title="Map Test" onPress={() => navigate('MapTest')}/>
                <Button title="Video Test" onPress={() => navigate('VideoTest')}/>
            </SafeAreaView>
        )
    }
}

export default HomeScreen