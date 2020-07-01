import DeviceInfo from 'react-native-device-info'
import './Global'

let device = DeviceInfo.getBrand();

function log_performance_origin(page) {
    return function wrapper(target, name, descriptor) {
        let wrapped_func = descriptor.value;
        descriptor.value = function() {
            let start_time = new Date();
            let ret = wrapped_func.apply(this, arguments);
            let end_time = new Date();
            let delay = end_time - start_time;
            let action = name;
            fetch("https://fdugeek.com/add_log/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    device: device,
                    cpu_stress: global.cpu_stress,
                    disk_stress: global.disk_stress,
                    network_stress: global.network_stress,
                    memory_stress: global.memory_stress,
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
