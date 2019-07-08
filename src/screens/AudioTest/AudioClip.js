import React from 'react'
import {
    Text,
    View,
    TouchableHighlight, StyleSheet, Button,
} from 'react-native';

class AudioClipItem extends React.PureComponent {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.button}>
                    <Text style={styles.largeFont}>{this.props.title}</Text>
                </View>
                {/*<TouchableHighlight style={styles.button} onPress={() => {*/}
                {/*    this.props.onPlay(this.props.path)*/}
                {/*}}>*/}
                {/*    <Text style={styles.largeFont}>PLAY</Text>*/}
                {/*</TouchableHighlight>*/}
                {/*<TouchableHighlight style={styles.button} onPress={() => {*/}
                {/*    this.props.onDelete(this.props.path)*/}
                {/*}}>*/}
                {/*    <Text style={styles.largeFont}>DELETE</Text>*/}
                {/*</TouchableHighlight>*/}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#2b608a",
        justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    button: {
        flex: 1,
        backgroundColor: '#358a8a',
        justifyContent: 'center',
        alignItems: 'center'
    },
    largeFont: {
        fontSize: 20
    }

});

export default AudioClipItem