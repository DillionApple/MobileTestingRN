import React from 'react'
import {View, Text, Platform, SafeAreaView, StyleSheet, Button} from "react-native"
import BaseScreenComponent from "../../components/BaseScreenComponent";
import {zip} from "react-native-zip-archive";
import LottieView from "lottie-react-native";

class FileSystemScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        this.fsTest();
    }

    fsTest() {
        this.RNFS = require('react-native-fs');
        this.mainPath = `${this.RNFS.DocumentDirectoryPath}/MobileTesting`;
        const txtPath = `${this.mainPath}/test.txt`;
        this.RNFS.mkdir(this.mainPath).then(res => {
            console.log('PATH WRITTEN');
        }).then(() => {
            let tempArr = [];
            let str = 'a';
            for (let i = 0; i < 1000 * 1000; i++) {
                tempArr.push(str);
            }
            let res = tempArr.join('');
            console.log('BEFORE FILE WRITTEN');
            this.RNFS.writeFile(txtPath, res, 'utf8')
        }).then((success) => {
            console.log('FILE WRITTEN!');
        }).catch((err) => {
            console.log(err.message);
        })
    }

    zipTest() {
        const sourcePath = `${this.mainPath}/test.txt`;
        const targetPath = `${this.mainPath}/test.zip`;
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
    }

    slotRender() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.buttonBar}>
                    <Button
                        onPress={() => {
                            this.zipTest();
                        }}
                        title="|-Zip Test-|"
                        color="#841584"
                    />
                </View>
                {/*<LottieView*/}
                {/*    style={styles.lottieView}*/}
                {/*    autoPlay loop*/}
                {/*    source={require('../../../assets/json/city.json')}*/}

                {/*/>*/}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    buttonBar: {
        padding: 5,
        flexDirection: 'row',
    },
    lottieView: {
        flex: 1
    }
});

export default FileSystemScreen