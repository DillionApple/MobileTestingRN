import React from 'react'
import {Button, Text, View} from 'react-native'
import {Header} from "react-native-elements";

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
    };
    render() {
        const {navigate} = this.props.navigation;
        return(
            <View>
                <Header
                    statusBarProps={{ translucent: true }}
                    centerComponent={{text: "Mobile Testing", style: {color: '#fff'}}}
                />
                <Button title="Network Test" onPress={() => navigate('NetworkTest')}/>
                <Button title="UI Test" onPress={() => navigate('UITest')}/>
                <Button title="Map Test" onPress={() => navigate('MapTest')}/>
                <Button title="Video Test" onPress={() => navigate('VideoTest')}/>
            </View>
        )
    }
}

export default HomeScreen