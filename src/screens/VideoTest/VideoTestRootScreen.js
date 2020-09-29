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
                                // navigationPrams.source = {uri: "https://fdugeek.com/files/test_video.mov"}
                                navigationPrams.source = {uri: "https://valipl.cp31.ott.cibntv.net/67756D6080932713CFC02204E/05000900005F24F3E3F33D305CF07D12B511BC-432D-4C75-99AA-DAD6B4173B0A-00018.ts?ccode=0502&duration=3518&expire=18000&psid=401f80cc3ee535e924792740d4a34d04434af&ups_client_netip=dcf83c8e&ups_ts=1599274253&ups_userid=&utid=GeZ%2FFgMmwlICAYzPF0XaVB%2BH&vid=XNDc0NjI1NzYxMg&sm=1&operate_type=1&dre=u37&si=73&eo=0&dst=1&iv=0&s=dbdb77d0ae4a4489b6ed&type=mp5hdv3&bc=2&rid=20000000CC8C8CC69341D1C0D9F0BF60471326FF02000000&vkey=B400d1d04275169c8a80ab778a38df581"}
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
