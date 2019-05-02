import {Alert,Platform} from 'react-native';
import {BackHandler} from 'react-native';
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';
import RNRestart from 'react-native-restart'; // Import package from node modules


export const baseUrl = Platform.OS === 'android' ?
    'http://10.0.2.2:5000/': 'http://localhost:5000/';

const reporter = (error) => {
    // Logic for reporting to devs
    // Example : Log issues to github issues using github apis.
    // console.log('reporter:' + error.message); // sample
    fetch(baseUrl + 'log/JSErr:' + error.message).then((res) => {
        console.log(`res : ${res}`);
    })
};

const errorHandler = (e, isFatal) => {
    if (isFatal) {
        reporter(e);
        Alert.alert(
            'Unexpected error occurred',
            `
        Error: ${(isFatal) ? 'Fatal:' : ''} ${e.name} ${e.message}
        We have reported this to our team ! Please close the app and start again!
        `,
            [{
                text: 'Restart',
                onPress: () => {
                    // Immediately reload the React Native Bundle
                    RNRestart.Restart();
                }
            }, {
                text: 'Close',
                onPress: () => {
                    BackHandler.exitApp();
                }
            }]
        );
    } else {
        reporter(e);
        // console.log(e); // So that we can see it in the ADB logs in case of Android if needed
    }
};

export function setHandler() {
    setJSExceptionHandler(errorHandler, true);

    setNativeExceptionHandler(errorString => {
        // This is your custom global error handler
        // You do stuff likehit google analytics to track crashes.
        // or hit a custom api to inform the dev team.
        //NOTE: alert or showing any UI change via JS
        //WILL NOT WORK in case of NATIVE ERRORS.
        fetch(baseUrl + 'log/NativeErr:' + errorString);
    });

}
