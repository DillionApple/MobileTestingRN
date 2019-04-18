import React from 'react'

import {SafeAreaView, Button, View, Text, StyleSheet} from 'react-native'

import { routeConfigMap } from './MapTestNavigator'
import BackButton from "../../components/BackButton";

class MapTestRootScreen extends React.Component {
    static navigationOptions = {
        title: 'Map Test',
    };

    constructor(props) {
        super(props);
    };

    renderButtons() {
        let {navigate} = this.props.navigation;

        return Object.keys(routeConfigMap).map((key) => {
           return  <Button key={key} title={key} onPress={() => navigate(key)}/>
        });
    }

    render() {


        return(
            <SafeAreaView>
                <View>
                    {this.renderButtons()}
                </View>
                <BackButton navigation={this.props.navigation}/>
            </SafeAreaView>
        )
    }
}

export default MapTestRootScreen