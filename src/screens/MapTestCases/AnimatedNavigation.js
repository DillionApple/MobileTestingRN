import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    Button
} from 'react-native';

import MapView from 'react-native-maps';
import carImage from './assets/car.png';

export default class NavigationMap extends Component {

    interval = null;
    constructor(props) {
        super(props);
        this.state = {
            prevPos: null,
            curPos: { latitude: 37.420814, longitude: -122.081949 },
            curAng: 45,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            intervalCount: 0,
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

    componentDidMount(): void {
        this.interval = setInterval(this.intervalHandler, 1000, this);
    }

    intervalHandler(vm) {
        let latOffset = Math.random() * 0.0001;
        let lonOffset = Math.random() * 0.0001;
        if (vm.state.intervalCount < 5) {
            vm.changePosition(latOffset, lonOffset);
            vm.setState({intervalCount: vm.state.intervalCount + 1});
        } else {
            clearInterval(vm.interval);
            vm.props.testFinish();
        }
    }

    render() {
        return (
            <View style={styles.flex}>
                <MapView
                    ref={(el) => (this.map = el)}
                    style={styles.flex}
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
                        <Text>+ Lat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => this.changePosition(-0.0001, 0)}
                    >
                        <Text>- Lat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => this.changePosition(0, -0.0001)}
                    >
                        <Text>- Lon</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => this.changePosition(0, 0.0001)}
                    >
                        <Text>+ Lon</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
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
