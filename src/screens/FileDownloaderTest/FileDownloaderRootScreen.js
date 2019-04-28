import React from 'react'

import { FlatList, Text } from "react-native"

import { ListItem } from 'react-native-elements'

import BaseScreenComponent from "../../components/BaseScreenComponent"

class FileDownloaderRootScreen extends BaseScreenComponent{

    downloadNumberList = [1,2,3,4,5];

    slotRender() {

        let { navigate } = this.props.navigation;

        return(
            <FlatList
                data={this.downloadNumberList}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({item}) =>
                    <ListItem
                        button
                        title={`[-Download ${item} files-]`}
                        bottomDivider
                        onPress={() => {
                            let navigationParams = {
                                numberOfDownloads: item
                            };
                            navigate("FileDownloader", navigationParams)
                        }}
                    />
                }
            />
        )

    }
}

export default FileDownloaderRootScreen