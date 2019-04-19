import React from 'react'

import {SafeAreaView, Button, View, Text, StyleSheet, FlatList} from 'react-native'

import {ListItem} from 'react-native-elements'

import { routeConfigMap } from './MapTestNavigator'
import BaseScreenComponent from "../../components/BaseScreenComponent";

class MapTestRootScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
    };

    renderButtons() {

        return Object.keys(routeConfigMap).map((key) => {
           return  <Button key={key} title={key} onPress={() => navigate(key)}/>
        });
    }

    slotRender() {
        let items = Object.keys(routeConfigMap);
        let {navigate} = this.props.navigation;
        return(
            <FlatList
                data={items}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <ListItem
                        key={item}
                        button
                        onPress={() => navigate(item)}
                        title={item}
                        chevron
                        bottomDivider
                    />
                )}
            >
            </FlatList>
        )
    }
}

export default MapTestRootScreen