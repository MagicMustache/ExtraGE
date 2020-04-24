import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, BackHandler, Alert, Platform} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import {useFocusEffect} from "@react-navigation/core";
import Toast from "react-native-simple-toast"
import firebase from "../configs/Firebase";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function WaiterMain({navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [exitApp,SETexitApp]=useState(false)


    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })


    const backAction = () => {
        if(exitApp===false){
            SETexitApp(true);
            if(Platform.OS === "android"){
                Toast.show("Appuyez de nouveau pour quitter l'app")
            }
        }
        else if(exitApp===true){
            BackHandler.exitApp()
        }

        setTimeout(()=>{
            SETexitApp(false)
        }, 1500);
        return true;
    };
    useEffect(() =>
    {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    },[exitApp])



    if(fontLoaded) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Home!</Text>
            </View>
        );
    }
    else{
        return(
            <AppLoading/>
        )
    }
}
