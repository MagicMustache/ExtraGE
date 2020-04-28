import * as React from 'react';
import {SafeAreaView} from "react-native"
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WaiterMain from "../screens/WaiterMain"
import WaiterJobs from "../screens/WaiterJobs"
import WaiterProfile from "../screens/WaiterProfile"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ExitOnDoubleBack from 'exit-on-double-back';
import {useState, useEffect} from "react";
import firebase from "../configs/Firebase";
import {AppLoading} from "expo";


const Tab = createMaterialTopTabNavigator();

export default function TabWaiter({navigation}) {

        return(
            <SafeAreaView style={{flex: 1}}>
            <Tab.Navigator tabBarPosition={"bottom"} initialRouteName={"WaiterMain"} >
                <Tab.Screen name="WaiterJobs" component={WaiterJobs}/>
                <Tab.Screen name="WaiterMain" component={WaiterMain}/>
                <Tab.Screen name="WaiterProfile" component={WaiterProfile}/>
            </Tab.Navigator>
            </SafeAreaView>
        )
}
