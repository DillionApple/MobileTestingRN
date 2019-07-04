import {Platform} from "react-native"

class MTLogger {
    constructor(module, logDir = null) {
        this.PerformanceNow = require('fbjs/lib/performanceNow');
        this.RNFS = require('react-native-fs');
        const platPath = Platform.OS === 'android' ? this.RNFS.DocumentDirectoryPath : this.RNFS.MainBundlePath;
        this.logDir = logDir || `${platPath}/log.txt`;
        this.module = module;
        this.startTime = {}
    }

    _writeLog(funcName, timeGap) {
        let logContent = `||Module: ${this.module} Function:${funcName} takes ${timeGap}ms||\n`;
        this.RNFS.write(this.logDir, logContent, -1, 'utf8').then((success) => {
            console.log('LOG WRITTEN!');
        }).catch((err) => {
            console.log(err.message);
        });
    }

    start(funcName) {
        if (this.startTime.hasOwnProperty(funcName)) {
            console.log('Duplicate Function Name!');
        } else {
            this.startTime[funcName] = this.PerformanceNow();
        }
    }

    end(funcName) {
        if (!this.startTime.hasOwnProperty(funcName)) {
            console.log('Calling End Before Start!');
        } else {
            this.endTime = this.PerformanceNow();
            const gap = this.endTime - this.startTime[funcName];
            delete this.startTime[funcName];
            this._writeLog(funcName, gap);
        }
    }
}

export default MTLogger