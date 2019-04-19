import React from 'react'

import {SafeAreaView, Button, View, Text, StyleSheet} from 'react-native'

import { routeConfigMap } from './MapTestNavigator'
import BaseScreenComponent from "../../components/BaseScreenComponent";

class MapTestRootScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
    };

    renderButtons() {
        let {navigate} = this.props.navigation;

        return Object.keys(routeConfigMap).map((key) => {
           return  <Button key={key} title={key} onPress={() => navigate(key)}/>
        });
    }

    slotRender() {
        return(
            this.renderButtons()
        )
    }
}

export default MapTestRootScreen