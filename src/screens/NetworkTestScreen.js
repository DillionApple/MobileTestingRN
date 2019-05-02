import React from 'react'
import {View, Text, FlatList, SectionList, StyleSheet} from "react-native"
import {Header, ListItem} from "react-native-elements";
import HeaderWithBackButton from "../components/HeaderWithBackButton";
import BaseScreenComponent from "../components/BaseScreenComponent";

class NetworkTestScreen extends BaseScreenComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
        }
    }

    slotRender() {
        return (<SectionList
            renderItem={({item, index, section}) => <ListItem button key={index} title={`${item}`}/>}
            renderSectionHeader={({section: {title}}) => (
                <Text style={styles.sectionHeader}>{title}</Text>
            )}
            sections={[
                {title: 'title1', data: [1,2,3]},
                {title: 'title2', data: [4,5,6]}
            ]}
            keyExtractor={(item, index) => item + index}
        />)
    }
}

export default NetworkTestScreen

const styles = StyleSheet.create({
    sectionHeader: {
        backgroundColor: "#ABABAB",
    }
});