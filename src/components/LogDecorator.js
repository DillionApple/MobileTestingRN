import DeviceInfo from 'react-native-device-info'

let device = DeviceInfo.getBrand();

function log_performance_origin(page) {
    return function wrapper(target, name, descriptor) {
        let wrapped_func = descriptor.value;
        descriptor.value = function() {
            let start_time = new Date();
            let ret = wrapped_func.apply(this, arguments);
            let end_time = new Date();
            let delay = end_time - start_time;
            let stress = "";
            let action = name;
            if (page == null) {
                page = "no page privided in @log_performance";
            }
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
}


export default log_performance_origin;
