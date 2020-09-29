import React from 'react'
import {SafeAreaView, View, Text, StyleSheet, Button} from "react-native"

import UITestNavigator from "./UITestNav";
import * as Progress from 'react-native-progress';
import BaseScreenComponent from "../../components/BaseScreenComponent";
import Timeout from 'await-timeout';
import log_performance_origin from "../../components/LogDecorator";

let log_performance = log_performance_origin("UITestScreen");

class UITestScreen extends BaseScreenComponent {
    static navigationOptions = {
        title: 'UITestScreen',
    };

    constructor(props) {
        super(props);
        this.state = {
            currentProgress: 0,
            currentTaskName: 'initializing..',
            indeterminate: true
        };
    }

    componentWillUnmount() {
        if (this.timerHandle) {
            this.timerHandle.clear();
        }
    }

    componentDidMount() {
        this.timerHandle = new Timeout();
        this.start();
    }

    async start() {
        await this.timerHandle.set(500);
        this.setState({indeterminate: false});
        this.doingTask(1);
    }

    doingTask(task) {
        if (task === 1) {
            this.testImageView();
        } else if (task === 2) {
            this.testAnimationView();
        } else if (task === 3) {
            this.testListView();
        }
    }
    @log_performance
    testImageView() {

        this.props.navigation.navigate('ImageView', {
            onGoBack: (mounted) => {
                // if (mounted){
                //     this.doingTask(2);
                // }
            }
        });
        this.setState({currentProgress: 0.2});
        this.setState({currentTaskName: 'ImageViewTesting..'});
    }
    @log_performance
    testAnimationView() {

        this.props.navigation.navigate('AnimationView', {
            onGoBack: (mounted) => {
                // if (mounted){
                //     this.doingTask(3);
                // }

            }
        });
        this.setState({currentProgress: 0.5});
        this.setState({currentTaskName: 'AnimationViewTesting..'});
    }
    @log_performance
    testListView() {

        this.props.navigation.navigate('ListView', {
            onGoBack: (mounted) => {
                // if (mounted){
                //     this.doingTask(4);
                // }

            }
        });
        this.setState({currentProgress: 1});
        this.setState({currentTaskName: 'ListViewTesting..'});
    }

    static router = UITestNavigator.router;

    slotRender() {
        let currentProgress = this.state.currentProgress;
        let currentTaskName = this.state.currentTaskName;
        let props = {
            doingTask: task => this.doingTask(task)
        };
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.buttonbar}>
                    <View accessibilityLabel="Task 1">
                    <Button
                        onPress={() => {
                            this.doingTask(1)
                        }}
                        title="|-Task 1-|"
                        color="#841584"
                    />
                    </View>
                    <View accessibilityLabel="Task 2">
                    <Button
                        onPress={() => {
                            this.doingTask(2)
                        }}
                        title="|-Task 2-|"
                        color="#841584"
                    />
                    </View>
                    <View accessibilityLabel="Task 3">
                    <Button
                        onPress={() => {
                            this.doingTask(3)
                        }}
                        title="|-Task 3-|"
                        color="#841584"
                    />
                    </View>
                </View>
                <View style={styles.progressbar}>
                    <Progress.Bar progress={currentProgress}
                                  indeterminate={this.state.indeterminate}
                                  width={250}
                                  height={50}
                    />
                    <Text style={styles.progressbarText}>{currentProgress * 100}%</Text>
                </View>
                <View>
                    <Text style={styles.progressbarTaskText}>{currentTaskName}</Text>
                </View>
                <View style={styles.UIContainer}>
                    <UITestNavigator navigation={this.props.navigation}/>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    buttonBar: {
        padding: 5,
        flexDirection: 'row',
    },
    UIContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    progressbar: {
        width: 250,
        height: 30,
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        flexDirection: 'row',
    },
    progressbarText: {
        fontSize: 20,
        paddingLeft: 20
    },
    progressbarTaskText: {
        fontSize: 28,
        paddingLeft: 30
    }
});
export default UITestScreen
