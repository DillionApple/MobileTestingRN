import React from 'react'
import {View, Text, Platform, SafeAreaView, StyleSheet, Button} from "react-native"
import BaseScreenComponent from "../../components/BaseScreenComponent";
import {zip, unzip} from "react-native-zip-archive";

class FileSystemScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            progressText: ''
        };
        this.RNFS = require('react-native-fs');
        this.mainPath = `${this.RNFS.DocumentDirectoryPath}/MobileTesting`;
        this.mainSubPath = `${this.RNFS.DocumentDirectoryPath}/MobileTesting/Sub`;
        this.txtPath = `${this.mainPath}/test.txt`;
        this.zipPath = `${this.mainPath}/test.zip`;
        this.txtSubPath = `${this.mainSubPath}/test.txt`;
        this.zipSubPath = `${this.mainSubPath}/test.zip`;
    }


    fsTest() {
        this.readDir();
        this.mkDir(this.mainPath);
        this.mkDir(this.mainSubPath);
        this.delDir(this.mainSubPath);
        this.mkDir(this.mainSubPath);
        this.mkFile(this.txtPath);
        this.zipFile(this.txtPath, this.zipPath);
        this.delFile(this.txtPath);
        this.unzipFile(this.zipPath, this.txtPath);
        this.copyFile(this.txtPath, this.txtSubPath);
        this.zipFile(this.txtSubPath, this.zipSubPath);
        this.delFile(this.txtSubPath);
        this.unzipFile(this.zipSubPath, this.txtSubPath);
        this.delFile(this.txtSubPath);
        this.moveFile(this.txtPath, this.txtSubPath);
        this.mkFile(this.txtPath);
        this.delDir(this.mainPath);
        this.setState({
            progressText: 'FS TEST DONE!'
        })
    }


    zipFile(src, dst) {
        zip(src, dst)
            .then((path) => {
                console.log(`zip completed at ${path}`);
                this.setState({
                    progressText: 'zipFile DONE!'
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    unzipFile(src, dst) {
        unzip(src, dst)
            .then((path) => {
                console.log(`unzip completed at ${path}`);
                this.setState({
                    progressText: 'unzipFile DONE!'
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    mkDir(dirPath) {
        this.RNFS.mkdir(dirPath).then(res => {
            console.log('mkDir Success');
            this.setState({
                progressText: 'makeDir DONE!'
            })
        }).catch((err) => {
            console.log(err.message);
        })
    }

    delDir(dirPath) {
        this.RNFS.unlink(dirPath)
            .then(() => {
                console.log('DIR DELETED');
                this.setState({
                    progressText: 'deleteDir DONE!'
                })
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log(err.message);
            });
    }

    mkFile(txtPath) {
        let tempArr = [];
        let str = 'a';
        for (let i = 0; i < 1000 * 1000; i++) {
            tempArr.push(str);
        }
        let res = tempArr.join('');
        console.log('BEFORE FILE WRITTEN');
        this.RNFS.writeFile(txtPath, res, 'utf8').then((success) => {
            console.log('FILE WRITTEN!');
            this.setState({
                progressText: 'makeFile DONE!'
            })
        }).catch((err) => {
            console.log(err.message);
        });
    }


    delFile(txtPath) {
        this.RNFS.unlink(txtPath)
            .then(() => {
                console.log('FILE DELETED');
                this.setState({
                    progressText: 'deleteFile DONE!'
                })
            })
            // `unlink` will throw an error, if the item to unlink does not exist
            .catch((err) => {
                console.log(err.message);
            });
    }

    moveFile(src, dst) {
        this.RNFS.moveFile(src, dst)
            .then(() => {
                console.log('FILE MOVED');
                this.setState({
                    progressText: 'moveFile DONE!'
                })
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    copyFile(src, dst) {
        this.RNFS.copyFile(src, dst)
            .then(() => {
                console.log('FILE COPIED');
                this.setState({
                    progressText: 'copyFile DONE!'
                })
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    readDir() {
        this.RNFS.readDir(this.RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then((result) => {
                // stat the first file
                return Promise.all([this.RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                if (statResult[0].isFile()) {
                    // if we have a file, read it
                    return this.RNFS.readFile(statResult[1], 'utf8');
                }
                return 'no file';
            })
            .then((contents) => {
                // log the file contents
                console.log(contents);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
        this.setState({
            progressText: 'readDir DONE!'
        })
    }

    slotRender() {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.largeFont}>{this.state.progressText}</Text>
                <View style={styles.buttonBar}>
                    <Button
                        onPress={() => {
                            this.fsTest();
                        }}
                        title="|-File Test-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.readDir();
                        }}
                        title="|-Read Dir-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.mkDir(this.mainPath);
                        }}
                        title="|-Make Main Dir-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.mkDir(this.mainSubPath);
                        }}
                        title="|-Make Sub Dir-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.delDir(this.mainPath);
                        }}
                        title="|-Delete Main Dir-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.mkFile(this.txtPath);
                        }}
                        title="|-Make Main Dir File-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.delFile(this.txtPath);
                        }}
                        title="|-Delete Main Dir File-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.delFile(this.txtSubPath);
                        }}
                        title="|-Delete Sub Dir File-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.copyFile(this.txtPath, this.txtSubPath);
                        }}
                        title="|-Copy Main Dir File To Sub Dir-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.moveFile(this.txtPath, this.txtSubPath);
                        }}
                        title="|-Move Main Dir File To Sub Dir-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.zipFile(this.txtPath, this.zipPath);
                        }}
                        title="|-Zip Main Dir File-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.zipFile(this.txtSubPath, this.zipSubPath);
                        }}
                        title="|-Zip Sub Dir File-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.unzipFile(this.zipPath, this.txtPath);
                        }}
                        title="|-Unzip Main Dir File-|"
                        color="#841584"
                    />
                    <Button
                        onPress={() => {
                            this.unzipFile(this.zipSubPath, this.txtSubPath);
                        }}
                        title="|-Unzip Sub Dir File-|"
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
        flexDirection: 'column'
    },
    buttonBar: {
        padding: 5,
        flexDirection: 'column',
    },
    lottieView: {
        flex: 1
    },
    largeFont: {
        fontSize: 20
    }
});

export default FileSystemScreen