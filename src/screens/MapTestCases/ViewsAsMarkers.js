import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PriceMarker from './PriceMarker';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class ViewsAsMarkers extends React.Component {

    maxIntervalCount = 10;
    intervalTimeMs = 200;
    interval = null;

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
            intervalCount: 0,
        };
    }

    intervalHandler(vm) {
        vm.setState({intervalCount: vm.state.intervalCount + 1})
        if (vm.state.intervalCount <= vm.maxIntervalCount) {
            if (Math.random() < 0.5) {
                vm.increment();
            } else {
                vm.decrement();
            }
        } else {
            clearInterval(vm.interval);
            vm.props.testFinish();
        }
    }

    componentDidMount(): void {
        this.interval = setInterval(this.intervalHandler, this.intervalTimeMs, this);
    }

    increment() {
        this.setState({ amount: this.state.amount + 1 });
    }

    decrement() {
        this.setState({ amount: this.state.amount - 1 });
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={this.state.region}
                >
                    <Marker coordinate={this.state.coordinate}>
                        <PriceMarker amount={this.state.amount} />
                    </Marker>
                </MapView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => this.decrement()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.increment()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
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