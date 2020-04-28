import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import firebase from "../configs/Firebase";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function WaiterMain({route, navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [name, setName] = useState("");
    const [loaded, setLoaded] = useState(false);
    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    useEffect(()=>{
        let user = firebase.auth().currentUser
            if (user) {
                console.log(user.email)
                let docRef = firebase.firestore().collection("users").doc(user.email);
                docRef.get().then(function (doc) {
                    if(doc.exists){
                        console.log(doc.data());
                        setName(doc.data().name);
                    }
                })
            }
            else{
                console.log("no user")
            }
    },[])

    if(fontLoaded&&(name!=="")) {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Name : {name}</Text>
                <TouchableOpacity onPress={()=> signout(navigation)}>
                    <Text>Test Signout</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    else{
        return (
            <AppLoading/>
        )
    }
}
function signout(navigation) {
    firebase.auth().signOut().then(function () {
        console.log("signed out")
        navigation.reset({
            index:0,
            routes: [{name: "SignupScreen"}]
        })
    }).catch(function (error) {
        console.log(error)
    })
}
