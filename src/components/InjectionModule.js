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
            visible: false
        }
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
                InteractionManager.runAfterInteractions(() => {
                    let RNFS = require('react-native-fs');
                    let mainPath = `${RNFS.DocumentDirectoryPath}/MobileTesting`;
                    const sourcePath = `${mainPath}/test.txt`;
                    const targetPath = `${mainPath}/test.zip`;
                    console.log(`sourcepath:${sourcePath}`);
                    for (let i = 0; i < 10; i++) {
                        console.log(`${i}th zipping`);
                        zip(sourcePath, targetPath)
                            .then((path) => {
                                console.log(`zip completed at ${path}`)
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    }
                });
                break;
            case 3:
                InteractionManager.runAfterInteractions(() => {
                    let RNFS = require('react-native-fs');
                    let mainPath = `${RNFS.DocumentDirectoryPath}/MobileTesting`;
                    const txtPath = `${mainPath}/test.txt`;
                    RNFS.mkdir(mainPath).then(res => {
                        console.log('PATH WRITTEN');
                    }).then(() => {
                        let res = this.randomWord(1000 * 1000 * 10);
                        console.log('BEFORE FILE WRITTEN');
                        RNFS.writeFile(txtPath, res, 'utf8')
                    }).then((success) => {
                        console.log('FILE WRITTEN!');
                    }).catch((err) => {
                        console.log(err.message);
                    })
                });
                break;
            case 4:
                const baseUrl = Platform.OS === 'android' ?
                    'http://192.168.56.1:8080/' : 'http://localhost:8080/';
                console.log(`baseUrl : ${baseUrl}ping`);
                for (let i = 0; i < 10; i++) {
                    fetch(`https://www.baidu.com`)
                        .then((response) => {
                            response.json()
                        })
                        .then((responseJson) => {
                            console.log(`respose Json : ${responseJson}`);
                        }).catch((err) => {
                        console.log(`network error : ${err}`);
                    })
                }
                break;
            case 5:
                let arr = MemoryInjection.castStress(1000000);
                console.log(`memory arr : ${arr}`);
                break;
            case 6:
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