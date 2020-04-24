import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
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
        firebase.auth().onAuthStateChanged(function(user) {
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
                console.log("--------------------")
            }
        });
    },[])

    if(fontLoaded&&(name!=="")) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Name : {name}</Text>
                <TouchableOpacity onPress={()=> signout(navigation)}>
                    <Text>Test Signout</Text>
                </TouchableOpacity>
            </View>
        );
    }
    else{
        return(
            <View><Text>rfree</Text></View>
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
