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
        this.RNFS = require("react-native-fs");
        this.mainPath = `${this.RNFS.DocumentDirectoryPath}/MobileTesting`;
    }

    componentWillMount(): void {
        console.log(`props : ${this.props.isShow}`);
    }


    changeVisibility() {
        this.setState({visible: !this.state.visible});
    }

    injection(stress_name) {
        let thread = null;
        console.log(`Injection name : ${stress_name}`);
        try {
            switch (stress_name) {
                case 'back':
                    this.changeVisibility();
                    break;
                case 'cpu':
                case 'disk_write':
                case 'network_download':
                case 'memory':
                    thread = new Thread('BGTaskWorker.js');
                    thread.postMessage(stress_name);
                    thread.onmessage = (message) => console.log(message);
                    this.threadList.push(thread);
                    break;
                case 'clear':
                    console.log(`Clearing ${this.threadList.length} threads`);
                    for (let i = 0; i < this.threadList.length; i++) {
                        console.log(`thread${i} terminated`);
                        this.threadList[i].terminate();
                    }
                    this.threadList = [];
                    this.RNFS.unlink(this.mainPath);
                    console.log("Stress cleared");
                    break;
            }
        } catch (e) {
            console.log(`Injection Exception : ${e}`);
        }
    }

    render() {
        const injectionList = [
            {
                name: 'cpu',
                title: '|-CPU-|',
            },
            {
                name: 'disk_write',
                title: '|-Disk Write-|'
            },
            {
                name: 'network_download',
                title: '|-Network Download-|',
            },
            {
                name: 'memory',
                title: '|-Memory-|'
            },
            {
                name: 'clear',
                title: 'Clear',
            },
            {
                name: 'back',
                title: 'Back',
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
                                    title={l.title}
                                    onPress={() => {
                                        this.injection(l.name);
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