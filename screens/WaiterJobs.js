import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function WaiterMain({navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })
    if(fontLoaded) {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Jobs!</Text>

            </SafeAreaView>
        );
    }
    else{
        return(
            <AppLoading/>
        )
    }
}
