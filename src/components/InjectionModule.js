import React from "react";
import {Overlay, ListItem} from "react-native-elements";
import {View, Platform, StyleSheet} from "react-native";
import {Thread} from "react-native-threads";

class InjectionModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    componentWillMount(): void {
        console.log(`props : ${this.props.isShow}`);
    }


    changeVisibility() {
        this.setState({visible: !this.state.visible});
    }

    injection(type) {
        let thread = null;
        switch (type) {
            case 0:
                thread = new Thread('BGTaskWorkerTest.js');
                thread.postMessage('100000');
                thread.onmessage = (message) => console.log(message);
                break;
            case 1:
                thread = new Thread('BGTaskWorkerTest.js');
                thread.postMessage('1000000');
                thread.onmessage = (message) => console.log(message);
                break;
            case 2:
                break;
        }
        this.changeVisibility();
    }

    render() {
        const injectionList = [
            {
                name: '|-loop 100000 times-|',
            },
            {
                name: '|-loop 1000000 times-|',
            }, {
                name: '|-Back-|',
            },
        ];
        return (
            <View>
                <Overlay
                    isVisible={this.state.visible}
                    width={250}
                    height='auto'
                >
                    <View>
                        {
                            injectionList.map((l, i) => (
                                <ListItem
                                    key={i}
                                    title={l.name}
                                    onPress={() => {
                                        this.injection(i);
                                    }}
                                />
                            ))
                        }
                    </View>
                </Overlay>
            </View>
        )
    }
}

export default InjectionModule

export const styles = StyleSheet.create({});