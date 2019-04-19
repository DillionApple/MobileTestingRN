import React from 'react'
import { View, Button, StyleSheet, Platform } from 'react-native'
import {Header} from "react-native-elements";

class HeaderWithBackButton extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Header
                statusBarProps={{ translucent: true }}
                leftComponent={<Button
                    color={Platform.select({
                        ios: '#fff'
                    })}
                    title={'Back'}
                    style={styles.backButton}
                    onPress={() => this.props.navigation.pop()}
                />}
                centerComponent={{text: this.props.title, style: {color: '#fff'}}}
            />
        )
    }
}

export default HeaderWithBackButton

export const styles = StyleSheet.create({
    backButton: {
    }
});

