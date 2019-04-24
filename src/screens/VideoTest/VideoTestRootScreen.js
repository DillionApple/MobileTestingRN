import React from 'react'

import { FlatList } from 'react-native'

import BaseScreenComponent from '../../components/BaseScreenComponent'
import {ListItem} from "react-native-elements";

class VideoTestRootScreen extends BaseScreenComponent {

    VIDEO_COUNT_LIST = [1,2,4,8];

    slotRender() {

        let { navigate } = this.props.navigation;

        return(
            <FlatList
                data={this.VIDEO_COUNT_LIST}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <ListItem
                        button
                        title={`[-VideoNumber ${item}-]`}
                        bottomDivider
                        onPress={() => {navigate(
                            "VideoActionAndAnimation",
                            {
                                videoNumber: item
                            }
                        )}}
                    />
                )}
            >
            </FlatList>

        )
    }

}

export default VideoTestRootScreen