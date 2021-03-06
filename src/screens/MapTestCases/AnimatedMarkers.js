import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Platform,
} from 'react-native';

import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import log_performance_origin from "../../components/LogDecorator";
const screen = Dimensions.get('window');

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let log_performance = log_performance_origin("AnimatedMarkers");


class AnimatedMarkers extends BaseScreenComponent {
    static navigationOptions = {
        title: "AnimatedMarkers"
    };
    REPEAT_COUNT = 1;
    constructor(props) {
        super(props);

        this.state = {
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }),
        };
    }

    @log_performance
    animate() {

        const { coordinate } = this.state;
        const newCoordinate = {
            latitude: LATITUDE + ((Math.random() - 0.5) * (LATITUDE_DELTA / 2)),
            longitude: LONGITUDE + ((Math.random() - 0.5) * (LONGITUDE_DELTA / 2)),
        };
        // repeater mark
        for (let cnt = 0; cnt < this.REPEAT_COUNT; cnt++) {
            if (Platform.OS === 'android') {
                if (this.marker) {
                    this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
                }
            } else {
                coordinate.timing(newCoordinate).start();
            }
        }

    }

    slotRender() {
        return (
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                >
                    <Marker.Animated
                        ref={marker => { this.marker = marker; }}
                        coordinate={this.state.coordinate}
                    />
                </MapView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => this.animate()}
                        style={[styles.bubble, styles.button]}
                    >
                        <Text>|-Animate-|</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        flex: 1,
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

export default AnimatedMarkers;
