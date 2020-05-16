import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator } from 'react-native';
import firebase from "../configs/Firebase"
import * as Font from 'expo-font';
import {AppLoading} from "expo";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function OwnerAppliants() {
    const [fontLoaded, setFontsLoaded] = useState(false);


    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })


    if(fontLoaded) {
        return (
            <View style={{justifyContent: "center", flex: 1, alignItems: "center"}}>
                <Text>YO</Text>
            </View>
        )
    }
    else {
        return (
            <AppLoading/>
        )
    }
}
