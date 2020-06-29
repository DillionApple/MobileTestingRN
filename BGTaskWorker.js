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

function sleep(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, x);
    })
}

self.onmessage = async (stressName) => {
    let RNFS = require('react-native-fs');
    let mainPath = `${RNFS.DocumentDirectoryPath}/MobileTesting`;
    console.log(`-debug- background task start!`);
    let writing = false;
    try {
        switch (stressName) {
            case 'cpu':
                while (true) {
                    for (let i = 0; i < 1000000; ++i) {
                        var j = Math.random() * Math.random();
                    }
                    await sleep(0);
                }
                break;
            case 'disk_write':
                const writeToPath = `${mainPath}/disk_write_${randomWord(16)}.txt`;
                const str = randomWord(1000 * 1000 * 1);
                let writing = false;
                while (true) {
                    if (writing) {
                        await sleep(1000);
                        continue;
                    }
                    writing = true;
                    console.log('BEFORE FILE WRITTEN');
                    RNFS.mkdir(mainPath).then(res => {
                        console.log('PATH CREATED');
                    }).then(() => {
                        RNFS.writeFile(writeToPath, str, 'utf8')
                    })
                }
                break;
            case 'network_download':
                const downloadUrl = "https://download.jetbrains.com/idea/ideaIU-2020.1.2.dmg?_ga=2.132662222.1765031080.1592925721-1193987217.1590147032";
                const downloadToPath = `${mainPath}/network_download_${randomWord(16)}`;
                console.log(`-debug- ${downloadToPath}`);
                let downloadFileOptions = {
                    fromUrl: downloadUrl,
                    toFile: downloadToPath,
                };
                let processing = false;
                while (true) {
                    if (processing) {
                        await sleep(1000);
                        continue;
                    }
                    processing = true;
                    RNFS.mkdir(mainPath).then(res => {
                        let result = RNFS.downloadFile(downloadFileOptions);
                        result.promise.then(() => {
                            console.log("Download finished");
                            RNFS.unlink(downloadToPath).then(() => {
                                processing = false;
                            })
                        });
                    });
                }
                break;
            case 'memory':
                let array = randomWord(1000 * 1000 * 10);
                while (true) {
                    await sleep(10000);
                }
                break;
        }
    } catch (e) {
        console.log(`Backgroud Worker Exception : ${e}`);
    }
};
