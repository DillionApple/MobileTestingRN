/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import  { schema } from './src/screens/DBTest/schema'
import Post from './src/screens/DBTest/Post'
import Comment from './src/screens/DBTest/Comment'
const adapter = new SQLiteAdapter({
    schema,
});

export const database = new Database({
    adapter,
    modelClasses: [
        Post,
        Comment
    ],
    actionsEnabled: true,
});

AppRegistry.registerComponent(appName, () => App);
