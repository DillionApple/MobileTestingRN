import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';

import MapView from 'react-native-maps';
import carImage from './assets/car.png';
import BaseScreenComponent from "../../components/BaseScreenComponent";

export default class NavigationMap extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            prevPos: null,
            curPos: { latitude: 37.420814, longitude: -122.081949 },
            curAng: 45,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        };
        this.changePosition = this.changePosition.bind(this);
        this.getRotation = this.getRotation.bind(this);
        this.updateMap = this.updateMap.bind(this);
    }

    changePosition(latOffset, lonOffset) {
        const latitude = this.state.curPos.latitude + latOffset;
        const longitude = this.state.curPos.longitude + lonOffset;
        this.setState({ prevPos: this.state.curPos, curPos: { latitude, longitude } });
        this.updateMap();
    }

    getRotation(prevPos, curPos) {
        if (!prevPos) return 0;
        const xDiff = curPos.latitude - prevPos.latitude;
        const yDiff = curPos.longitude - prevPos.longitude;
        return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
    }

    updateMap() {
        const { curPos, prevPos, curAng } = this.state;
        const curRot = this.getRotation(prevPos, curPos);
        this.map.animateCamera({ heading: curRot, center: curPos, pitch: curAng });
    }

    slotRender() {
        return (
            <View style={styles.flex}>
                <MapView
                    ref={(el) => (this.map = el)}
                    style={styles.map}
                    minZoomLevel={15}
                    initialRegion={{
                        ...this.state.curPos,
                        latitudeDelta: this.state.latitudeDelta,
                        longitudeDelta: this.state.longitudeDelta,
                    }}
                >
                    <MapView.Marker
                        coordinate={this.state.curPos}
                        anchor={{ x: 0.5, y: 0.5 }}
                        image={carImage}
                    />
                </MapView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => this.changePosition(0.0001, 0)}
                    >
                        <Text>|-Inc Lat-|</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => this.changePosition(-0.0001, 0)}
                    >
                        <Text>|-Dec Lat-|</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => this.changePosition(0, -0.0001)}
                    >
                        <Text>|-Dec Lon-|</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => this.changePosition(0, 0.0001)}
                    >
                        <Text>|-Inc Lon-|</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 30,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
    },
    button: {
        height: 50,
        borderRadius: 5,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },
});
