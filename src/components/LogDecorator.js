import {Platform} from "react-native"

let RNFS = require('react-native-fs');
// RNFS.ExternalStorageDirectoryPath permission denied in android
// RNFS.DocumentDirectoryPath cannot be accessed in non-debug mode
let log_dir = Platform.OS === 'android' ? `${RNFS.ExternalStorageDirectoryPath}` : `${RNFS.MainBundlePath}`;
RNFS.mkdir(log_dir).then( rest => {
    console.log(`log path ${log_dir} created`);
});

function log_performance(target, name, descriptor) {
    let wrapped_func = descriptor.value;
    descriptor.value = function() {
        fetch("http://fdugeek.com/")
            .then(response => response.text().then((text) => {console.log(`mydebug success ${text}`)}))
            .catch((error) => console.log(`mydebug fail ${error.message}`));
        let start_time = new Date();
        let ret = wrapped_func.apply(this, arguments);
        let end_time = new Date();
        let log_str = `-performance log- view: ${target.constructor.name}; function: ${name}; time: ${end_time-start_time}ms\n`;
        let log_file = `${log_dir}/${start_time.toISOString().slice(0,13)}.log`;
        console.log(`log written to ${log_file}`);
        RNFS.write(log_file, log_str, -1, 'utf8').then((success) => {
            console.log(`performance log has been written to ${log_file}`);
        }).catch((err) => {
            console.log(`mydebug ${err.message}`);
        });
        return ret;
    };
    return descriptor;
}

export default log_performance;
