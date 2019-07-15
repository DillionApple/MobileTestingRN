import React from 'react'
import {View, Text} from "react-native"
import BaseScreenComponent from "../components/BaseScreenComponent";

class EndScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
    }

    slotRender() {
        return (
            <View>
                <Text>Testing Finished</Text>
            </View>
        )
    }
}

export default EndScreen