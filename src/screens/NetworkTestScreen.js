import React from 'react'
import {View, Text, FlatList} from "react-native"
import {Header, ListItem} from "react-native-elements";
import HeaderWithBackButton from "../components/HeaderWithBackButton";
import BaseScreenComponent from "../components/BaseScreenComponent";

class NetworkTestScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        }
    }

    slotRender() {
        return (<Text>Network Test Screen</Text>)
    }
}

export default NetworkTestScreen