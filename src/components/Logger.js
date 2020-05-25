import {Platform} from "react-native"

class MTLogger {
    constructor(module, logDir = null) {
        console.log(global);
        this.PerformanceNow =
            global.nativeQPLTimestamp ||
            global.nativePerformanceNow ||
            require('fbjs/lib/performanceNow');
        this.RNFS = require('react-native-fs');
        const platPath = Platform.OS === 'android' ? this.RNFS.ExternalStorageDirectoryPath : this.RNFS.MainBundlePath;
        let date = this.dateFormat(new Date(), "yyyy-MM-dd");
        this.logDir = logDir || `${platPath}/log_${date}.txt`;
        this.module = module;
        this.startTime = {}
    }

    dateFormat = function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    _writeLog(funcName, timeGap) {
        let logContent = `||Module: ${this.module} Function:${funcName} takes ${timeGap}ms||\n`;
        console.log(logContent);
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