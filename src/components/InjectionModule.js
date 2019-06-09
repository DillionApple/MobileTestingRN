import React from "react";
import {ListItem, Overlay} from "react-native-elements";
import {InteractionManager, StyleSheet, View, Platform} from "react-native";
import {Thread} from "react-native-threads";
import {zip} from "react-native-zip-archive";
import MemoryInjection from "./MemoryModule";

class InjectionModule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.threadList = [];
    }

    componentWillMount(): void {
        console.log(`props : ${this.props.isShow}`);
    }


    changeVisibility() {
        this.setState({visible: !this.state.visible});
    }


    randomWord(min) {
        let str = "";
        let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        for (let i = 0; i < min; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str;
    }

    injection(type) {
        let thread = null;
        console.log(`Injection Type : ${type}`);
        try {
            switch (type) {
                case 0:
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    thread = new Thread('BGTaskWorker.js');
                    thread.postMessage(type.toString());
                    thread.onmessage = (message) => console.log(message);
                    this.threadList.push(thread);
                    break;
                case 5:
                    let arr = MemoryInjection.castStress(1000000);
                    console.log(`memory arr : ${arr}`);
                    break;
                case 6:
                    for (let i = 0; i < this.threadList.length; i++) {
                        console.log(`thread${i} terminated`);
                        this.threadList[i].terminate();
                    }
                    this.threadList = [];
                    break;
                case 7:
                    break;
            }
        }catch (e) {
            console.log(`Injection Exception : ${e}`);
        }
        this.changeVisibility();
    }

    render() {
        const injectionList = [
            {
                name: '|-Empty-|',
            },
            {
                name: '|-Infinite Loop-|',
            },
            {
                name: '|-Zip File-|',
            },
            {
                name: '|-Write File to FS-|',
            },
            {
                name: '|-Network Flooding-|',
            },
            {
                name: '|-Memory Injection-|',
            },
            {
                name: 'Clear',
            },
            {
                name: 'Back',
            }
        ];
        return (
            <View>
                <Overlay
                    isVisible={this.state.visible}
                    width={'100%'}
                    height={'100%'}
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