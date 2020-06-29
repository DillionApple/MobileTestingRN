import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import PriceMarker from './PriceMarker';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import log_performance from "../../components/LogDecorator";

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ViewsAsMarkers extends BaseScreenComponent {
    REPEAT_COUNT = 1;

    constructor(props) {
        super(props);

        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
            },
            amount: 99,
        };
    }

    @log_performance
    increment() {

        // repeater mark
        for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
            this.setState({amount: this.state.amount + 1});
        }

    }

    @log_performance
    decrement() {

        // repeater mark
        for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
            this.setState({amount: this.state.amount - 1});
        }

    }

    slotRender() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={this.state.region}
                >
                    <Marker coordinate={this.state.coordinate}>
                        <PriceMarker amount={this.state.amount}/>
                    </Marker>
                </MapView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => this.decrement()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text>|-Dec-|</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.increment()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text>|-Inc-|</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    latlng: {
        width: 200,
        alignItems: 'stretch',
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
});

export default ViewsAsMarkers;
