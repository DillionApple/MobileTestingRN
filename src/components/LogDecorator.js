import {Platform} from "react-native"
import DeviceInfo from 'react-native-device-info'

let RNFS = require('react-native-fs');
// RNFS.ExternalStorageDirectoryPath permission denied in android
// RNFS.DocumentDirectoryPath cannot be accessed in non-debug mode
let log_dir = Platform.OS === 'android' ? `${RNFS.ExternalStorageDirectoryPath}` : `${RNFS.MainBundlePath}`;
RNFS.mkdir(log_dir).then( rest => {
    console.log(`log path ${log_dir} created`);
});

let device = DeviceInfo.getBrand();

function log_performance(target, name, descriptor) {
    let wrapped_func = descriptor.value;
    descriptor.value = function() {
        let start_time = new Date();
        let ret = wrapped_func.apply(this, arguments);
        let end_time = new Date();
        let delay = end_time - start_time;
        let stress = "";
        let page = target.constructor.name;
        let action = name;
        fetch("https://fdugeek.com/add_log/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                device: device,
                stress: stress,
                page: page,
                action: action,
                delay: delay,
            })
        }).then(response => {
            if (response.ok) {
                console.log('mydebug log sent successfully');
            }
        }).catch( error => {
            console.log(`mydebug log send failed, err_msg: ${error.message}`);
        });
        return ret;
    };
    return descriptor;
}

export default log_performance;
