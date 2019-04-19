import React from 'react'

import { View, Text, StyleSheet, Dimensions } from 'react-native'
import HeaderWithBackButton from "./HeaderWithBackButton";
import { Header } from "react-navigation"

class BaseScreenComponent extends React.Component {

    navigationConfig = {
        title: `<-${this.constructor.name}->`
    };

    constructor(props) {
        super(props);
    }

    slotRender() {
        return (<Text>Please rewrite this function (slotRender) in the subclass</Text>)
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderWithBackButton
                    navigation={this.props.navigation}
                    title={this.navigationConfig.title}
                />
                {this.slotRender()}
            </View>
        )
    }
}

export default BaseScreenComponent


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
    }
});