import * as React from 'react';
import {KeyboardAvoidingView, Platform, SafeAreaView, View} from "react-native"
import OwnerMain from "../screens/OwnerMain"
import OwnerAppliants from "../screens/OwnerAppliants"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



const Tab = createMaterialTopTabNavigator();

export default function TabOwner({navigation}) {

    return(
        <SafeAreaView style={{flex: 1, backgroundColor:"white"}}>
            <Tab.Navigator tabBarPosition={"bottom"} initialRouteName={"Votre restaurant"} >
                <Tab.Screen name="Votre restaurant" component={OwnerMain}/>
                <Tab.Screen name="Les candidatures" component={OwnerAppliants}/>
            </Tab.Navigator>
        </SafeAreaView>
    )
}
