import React from "react";
import {ListItem, Overlay} from "react-native-elements";
import {InteractionManager, StyleSheet, View, Platform} from "react-native";
import {Thread} from "react-native-threads";
import BaseScreenComponent from "./BaseScreenComponent";
import './Global'

class InjectionModule extends BaseScreenComponent {


    constructor(props) {
        super(props);
        this.threadList = [];
        this.RNFS = require("react-native-fs");
        this.mainPath = `${this.RNFS.DocumentDirectoryPath}/MobileTesting`;
    }

    componentWillMount(): void {
        console.log(`props : ${this.props.isShow}`);
    }

    injection(stress_name) {
        let thread = null;
        console.log(`Injection name : ${stress_name}`);
        try {
            switch (stress_name) {
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
            switch (stress_name) {
                case 'cpu': global.cpu_stress += 1; break;
                case 'disk_write': global.disk_stress += 1; break;
                case 'network_download': global.network_stress += 1; break;
                case 'memory': global.memory_stress += 1; break;
                case 'clear':
                    global.cpu_stress = 0;
                    global.disk_stress = 0;
                    global.network_stress = 0;
                    global.memory_stress = 0;
                    break;
            }
        } catch (e) {
            console.log(`Injection Exception : ${e}`);
        }
    }

    slotRender() {
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
        ];
        return (
            <View>
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
            </View>
        )
    }
}

export default InjectionModule

export const styles = StyleSheet.create({});
