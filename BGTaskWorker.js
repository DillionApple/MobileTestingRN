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

self.onmessage = (stressName) => {
    let RNFS = require('react-native-fs');
    let mainPath = `${RNFS.DocumentDirectoryPath}/MobileTesting`;
    console.log(`background task start!`);
    let writing = false;
    try {
        switch (stressName) {
            case 'cpu':
                setInterval(function () {
                    for (let i = 0; i < 1000000; ++i) {
                        j = Math.random() * Math.random();
                    }
                    console.log("finished 1 round")
                }, 0);
                break;
            case 'disk_write':
                const writeToPath = `${mainPath}/disk_write.txt`;
                RNFS.mkdir(mainPath).then(res => {
                    console.log('PATH CREATED');
                });
                setInterval(function() {
                    if (writing) return;
                    let res = randomWord(1000 * 1000 * 10);
                    console.log('BEFORE FILE WRITTEN');
                    writing = true;
                    RNFS.writeFile(writeToPath, res, 'utf8').then(
                        (success) => {
                            console.log('FILE WRITTEN!');
                            writing = false;
                        }).catch(
                        (err) => {
                            console.log(err.message);
                        });
                }, 0);
                break;
            case 'network_download':
                const downloadUrl = "https://dl.google.com/dl/android/studio/install/3.4.0.18/android-studio-ide-183.5452501-mac.dmg";
                const downloadToPath = `${mainPath}/network_download`;
                let downloadFileOptions = {
                    fromUrl: downloadUrl,
                    toFile: downloadToPath,
                };
                setInterval(function() {
                    let result = RNFS.downloadFile(downloadFileOptions);
                    result.promise.then(() => {
                        console.log("Download finished")
                    });
                }, 0);
                break;
            case 'memory':
                setInterval(function () {
                    let array = randomWord(1000 * 1000 * 10);
                }, 0);
                break;
        }
    } catch (e) {
        console.log(`Backgroud Worker Exception : ${e}`);
    }
};
