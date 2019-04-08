import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import MapView, { MAP_TYPES } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class DisplayLatLng extends React.Component {

    interval = null;

    actionMap = {
        0: this.jumpRandom,
        1: this.animateRandom,
        2: this.animateRandomCoordinate,
        3: this.animateToRandomBearing,
        4: this.animateToRandomViewingAngle,
    };

    constructor(props) {
        super(props);

        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            intervalCount: 0,
        };
    }

    onRegionChange(region) {
        this.setState({ region });
    }

    jumpRandom(vm) {
        vm.setState({ region: vm.randomRegion() });
    }

    animateRandom(vm) {
        vm.map.animateToRegion(vm.randomRegion());
    }

    animateRandomCoordinate(vm) {
        vm.map.animateCamera({ center: vm.randomCoordinate() });
    }

    animateToRandomBearing(vm) {
        vm.map.animateCamera({ heading: vm.getRandomFloat(-360, 360) });
    }

    animateToRandomViewingAngle(vm) {
        vm.map.animateCamera({ pitch: vm.getRandomFloat(0, 90) });
    }

    getRandomFloat(min, max) {
        return (Math.random() * (max - min)) + min;
    }

    randomCoordinate() {
        const region = this.state.region;
        return {
            latitude: region.latitude + ((Math.random() - 0.5) * (region.latitudeDelta / 2)),
            longitude: region.longitude + ((Math.random() - 0.5) * (region.longitudeDelta / 2)),
        };
    }

    randomRegion() {
        return {
            ...this.state.region,
            ...this.randomCoordinate(),
        };
    }

    intervalHandler(vm) {
        let actionIndex = Math.floor(vm.state.intervalCount / 3);
        let action = vm.actionMap[actionIndex]
        if (action) {
            action(vm);
            vm.setState({intervalCount: vm.state.intervalCount + 1});
        } else {
            clearInterval(vm.interval);
            vm.props.testFinish();
        }
    }

    componentDidMount(): void {
        this.interval = setInterval(this.intervalHandler, 1000, this);
    }

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    ref={ref => { this.map = ref; }}
                    style={styles.map}
                    initialRegion={this.state.region}
                    onRegionChange={region => this.onRegionChange(region)}
                />
                <View style={[styles.bubble, styles.latlng]}>
                    <Text style={{ textAlign: 'center' }}>
                        {this.state.region.latitude.toPrecision(7)},
                        {this.state.region.longitude.toPrecision(7)}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => this.jumpRandom()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text style={styles.buttonText}>Jump</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.animateRandom()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text style={styles.buttonText}>Animate (Region)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.animateRandomCoordinate()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text style={styles.buttonText}>Animate (Coordinate)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.animateToRandomBearing()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text style={styles.buttonText}>Animate (Bearing)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.animateToRandomViewingAngle()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text style={styles.buttonText}>Animate (View Angle)</Text>
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
        width: 100,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    },
    buttonText: {
        textAlign: 'center',
    },
});

export default DisplayLatLng;