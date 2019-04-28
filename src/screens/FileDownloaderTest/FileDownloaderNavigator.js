import React from 'react'

import { createStackNavigator } from "react-navigation";

import FileDownloaderRootScreen from "./FileDownloaderRootScreen"
import FileDownloader from "./FileDownloader"

const FileDownloaderNavigator = createStackNavigator(
    {
        FileDownloaderRootScreen: {screen: FileDownloaderRootScreen},
        FileDownloader: {screen: FileDownloader},
    },
    {
        headerMode: 'none',
    }
);

export default FileDownloaderNavigator