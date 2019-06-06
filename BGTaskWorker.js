import {zip, unzip} from 'react-native-zip-archive'
import {self} from 'react-native-threads';
import {Platform} from "react-native";

let randomWord = function (min) {
    let str = "";
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < min; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
};

self.onmessage = (task) => {
    let RNFS = null;
    let mainPath = null;
    console.log(`background task start!`);
    try {
        switch (parseInt(task)) {
            case 0:
                for (let i = 0; i < 100000; i++) {
                    console.log(`${i}th running`);
                }
                break;
            case 1:
                setInterval(function () {
                    let j;
                    for (let i = 0; i < 1000000; ++i) {
                        j = Math.random() * Math.random();
                    }
                }, 0);
                break;
            case 2:
                RNFS = require('react-native-fs');
                mainPath = `${RNFS.DocumentDirectoryPath}/MobileTesting`;
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
                break;
            case 3:
                RNFS = require('react-native-fs');
                mainPath = `${RNFS.DocumentDirectoryPath}/MobileTesting`;
                const txtPath = `${mainPath}/test.txt`;
                RNFS.mkdir(mainPath).then(res => {
                    console.log('PATH WRITTEN');
                }).then(() => {
                    let res = randomWord(1000 * 1000 * 10);
                    console.log('BEFORE FILE WRITTEN');
                    RNFS.writeFile(txtPath, res, 'utf8')
                }).then((success) => {
                    console.log('FILE WRITTEN!');
                }).catch((err) => {
                    console.log(err.message);
                });
                break;
            case 4:
                const baseUrl = Platform.OS === 'android' ?
                    'http://10.0.3.2:8080/ping' : 'http://localhost:8080/ping';
                for (let i = 0; i < 10; i++) {
                    fetch(`http://gerald.fun:5010/get/`)
                        .then((response) => {
                            response.text()
                        })
                        .then((responseJson) => {
                            console.log(`respose Json : ${responseJson}`);
                        }).catch((err) => {
                        console.log(`network error : ${err}`);
                    })
                }
                break;
            case 5:
                break;
            case 6:
                break;
        }
    } catch (e) {
        console.log(`Backgroud Worker Exception : ${e}`);
    }
};
