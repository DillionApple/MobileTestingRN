import {createSwitchNavigator} from "react-navigation";
import InitView from "./InitView";
import ImageViewTest from "./ImageView";
import AnimationView from "./AnimationView"
import ListView from "./ListView"
import React from "react";
import {Text, View} from "react-native";
import * as Progress from "react-native-progress";

const UITestNavigator = createSwitchNavigator({
    InitView: InitView,
    ImageView: ImageViewTest,
    AnimationView: AnimationView,
    ListView: ListView
});

export default UITestNavigator