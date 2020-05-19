import * as React from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from "react-native"
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WaiterMain from "../screens/WaiterMain"
import WaiterJobs from "../screens/WaiterJobs"
import WaiterProfile from "../screens/WaiterProfile"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {useState, useEffect} from "react";
import firebase from "../configs/Firebase";
import {AppLoading} from "expo";


const Tab = createMaterialTopTabNavigator();

export default function TabWaiter({navigation}) {

        return(
            <SafeAreaView style={{flex: 1, backgroundColor:"white"}}>
                <Tab.Navigator tabBarPosition={"bottom"} initialRouteName={"Les jobs"} >
                <Tab.Screen name="Les jobs acceptés" component={WaiterJobs}/>
                <Tab.Screen name="Les jobs" component={WaiterMain}/>
                <Tab.Screen name="Profil" component={WaiterProfile}/>
            </Tab.Navigator>
            </SafeAreaView>
        )
}
