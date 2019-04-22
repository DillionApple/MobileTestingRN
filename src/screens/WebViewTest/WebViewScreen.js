import React, { Component } from 'react';
import { WebView } from 'react-native';


class WebViewScreen extends Component {
    static navigationOptions = {
        title: 'WebView Test',
    };
    render() {
        return (
            <WebView
                source={{uri: 'https://github.com/facebook/react-native'}}
            />
        );
    }
}

export default WebViewScreen