import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from "./screens/SignupScreen";
import SignupWaiter from "./screens/SignupWaiter";
import LoginScreen from "./screens/LoginScreen";
import TabWaiter from "./navigation/TabWaiter";
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createSwitchNavigator } from "react-navigation"
import Ionicons from "@expo/vector-icons/Ionicons"

const Stack = createStackNavigator();

export default function App() {
    YellowBox.ignoreWarnings(['Setting a timer']);
    const _console = _.clone(console);
    console.warn = message => {
        if (message.indexOf('Setting a timer') <= -1) {
            _console.warn(message);
        }
    };
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen
              name="SignupScreen"
              component={SignupScreen}
          />
          <Stack.Screen
              name="SignupWaiter"
              component={SignupWaiter}
          />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
            <Stack.Screen
                name="TabWaiter"
                component={TabWaiter}
            />
        </Stack.Navigator>
      </NavigationContainer>

  );
}
