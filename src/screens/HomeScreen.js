import React from 'react'
import {Button, Text, View, FlatList, StyleSheet} from 'react-native'
import {Header} from "react-native-elements";
import {ListItem} from "react-native-elements"

import {routeConfigMap} from '../AppNavigator'

class HomeScreen extends React.Component {

    static navigationOptions = {
        title: 'Home',
    };

    constructor(props) {
        super(props);
        this.state={
            test: "test"
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        let items = Object.keys(routeConfigMap);
        return(
            <View style={styles.container}>
                <Header
                    statusBarProps={{ translucent: true }}
                    centerComponent={{text: "<-MobileTesting->", style: {color: '#fff'}}}
                />
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                        <ListItem
                            button
                            onPress={() => navigate(item)}
                            title={`[-${item}-]`}
                            chevron
                            bottomDivider
                        />
                    )}
                >
                </FlatList>
            </View>
        )
    }
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});