import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from "./screens/SignupScreen";
import SignupWaiter from "./screens/SignupWaiter";

const Stack = createStackNavigator();

export default function Stacks() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="SignupHome"
                    component={SignupScreen}
                />
                <Stack.Screen
                    name="SignupWaiter"
                    component={SignupWaiter}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
