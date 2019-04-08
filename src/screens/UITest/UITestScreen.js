import React from 'react'
import {View, Text, StyleSheet} from "react-native"

import UITestNavigator from "./UITestNav";
import * as Progress from 'react-native-progress';


class UITestScreen extends React.Component {
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

    componentDidMount() {
        this.start();
    }

    async start() {
        await new Promise((resolve) => setTimeout(() => {
            this.setState({indeterminate: false});
            resolve();
        }, 500));
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

    testImageView() {
        this.props.navigation.navigate('ImageView', {
            onGoBack: () => this.doingTask(2),
        });
        this.setState({currentProgress: 0.2});
        this.setState({currentTaskName: 'ImageViewTesting..'});
    }

    testAnimationView() {
        this.props.navigation.navigate('AnimationView', {
            onGoBack: () => this.doingTask(3),
        });
        this.setState({currentProgress: 0.5});
        this.setState({currentTaskName: 'AnimationViewTesting..'});
    }

    testListView() {
        this.props.navigation.navigate('ListView', {
            onGoBack: () => this.doingTask(4),
        });
        this.setState({currentProgress: 1});
        this.setState({currentTaskName: 'ListViewTesting..'});
    }

    static router = UITestNavigator.router;

    render() {
        let currentProgress = this.state.currentProgress;
        let currentTaskName = this.state.currentTaskName;
        let props = {
            doingTask: task => this.doingTask(task)
        };
        return (
            <View style={styles.container}>
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

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
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