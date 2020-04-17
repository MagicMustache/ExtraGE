import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import SignupScreen from "./screens/SignupScreen";
import SignupWaiter from "./screens/SignupWaiter";
import LoginScreen from "./screens/LoginScreen";

const Stack = createStackNavigator();

export default function App() {
    
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
        </Stack.Navigator>
      </NavigationContainer>
  );
}
