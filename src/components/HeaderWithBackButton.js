import React from 'react'
import {View, StyleSheet, Platform} from 'react-native'
import {Header,Button, Tooltip, Text} from "react-native-elements";

class HeaderWithBackButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View>
                <View>
                    <Header
                        statusBarProps={{translucent: true}}
                        leftComponent={<Button
                            color={Platform.select({
                                ios: '#fff'
                            })}
                            title='Back'
                            style={styles.backButton}
                            onPress={() => this.props.navigation.pop()}
                        />
                        }
                        rightComponent={
                            <Button
                                color={Platform.select({
                                    ios: '#fff'
                                })}
                                title='Injection'
                                titleStyle={styles.injButton}
                                onPress={() => {
                                    this.props.navigation.navigate("Injection")
                                }}
                            />
                        }
                        centerComponent={{text: this.props.title, style: {color: '#fff'}}}
                    />
                </View>
            </View>
        )
    }
}

export default HeaderWithBackButton

export const styles = StyleSheet.create({
    backButton: {
        fontSize: 12
    },
    injButton: {
        fontSize: 12
    }
});

