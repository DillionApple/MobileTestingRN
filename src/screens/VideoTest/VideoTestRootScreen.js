import React from 'react'

import {SectionList, StyleSheet, Text} from 'react-native'

import BaseScreenComponent from '../../components/BaseScreenComponent'
import {ListItem} from "react-native-elements";

class VideoTestRootScreen extends BaseScreenComponent {

    sections = [
        {title: "Offline Video", data: [1,2,4,8]},
        {title: "Online Video", data: [1,2,4,8]},
    ];

    slotRender() {

        let { navigate } = this.props.navigation;

        return(
            <SectionList
                sections={this.sections}
                keyExtractor={(item, index) =>  item}
                renderSectionHeader={({section: {title}}) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                renderItem={({item, index, section}) => {
                    return (<ListItem
                        button
                        title={`[-${section.title} ${item}-]`}
                        bottomDivider
                        onPress={() => {
                            let navigationPrams = {
                                videoNumber: item,
                                navigationTitle: `<-${section.title} ${item}->`,
                                source: null
                            };
                            if (section.title == "Offline Video") {
                                navigationPrams.source = require('./assets/test_video.mov')
                            } else {
                                navigationPrams.source = {uri: "http://fdugeek.com/files/test_video.mov"}
                            }
                            navigate("VideoActionAndAnimation", navigationPrams)
                        }}
                    />)
                }}
            />
        )
    }

}

export default VideoTestRootScreen

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: "#ABABAB",
    }
});
