import {zip, unzip} from 'react-native-zip-archive'
import {self} from 'react-native-threads';


self.onmessage = (time) => {
    for (let i = 0; i < parseInt(time); i++) {
        console.log(`${i}th running`);
    }
};
