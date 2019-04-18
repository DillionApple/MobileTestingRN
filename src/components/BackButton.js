import React from 'react'
import { View, Button, StyleSheet } from 'react-native'

class BackButton extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.backButton}>
                <Button title={'< Back'} onPress={() => this.props.navigation.pop()}/>
            </View>
        )
    }
}

export default BackButton

export const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 5,
        left: 5,
        backgroundColor: 'rgba(200, 200, 200, 0.2)',
        borderRadius: 5,
        zIndex: 1000
    }
})