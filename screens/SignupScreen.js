import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import firebase from "../configs/Firebase"
import SignupWaiter from "./SignupWaiter";
import * as Font from 'expo-font';
import {AppLoading} from "expo";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}


export default function SignupScreen({navigation}) {

    const [loaded, setLoaded] = useState(false);
    const [urlLeft, setUrlLeft] = useState("");
    const [urlRight, setUrlRight] = useState("");
    const [fontLoaded, setFontsLoaded] = useState(false);
    const refLeft = firebase.storage().ref("/vieux.png");
    const refRight = firebase.storage().ref("/serveur.png");

    refLeft.getDownloadURL().then(function (result) {
        setUrlLeft(result);
        refRight.getDownloadURL().then(function (result2) {
            setUrlRight(result2);
            setLoaded(true);
        });
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if(user){
            console.log("logged in : ", user.email)
            navigation.reset({
                index:0,
                routes: [{name: "TabWaiter"}]
            })
        }
        else{
            console.log("not logged in")
        }

    })
    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })



    if (loaded && fontLoaded) {
        return (
            <View style={{flexDirection: "column", flex: 1}}>
                <View style={styles.title}>
                    <Text style={styles.title}>Bienvenue sur ExtraGE,</Text>
                    <Text style={styles.title}>Qui est tu ?</Text>
                </View>
                <View style={{flexDirection: "row", flex: 0.8}}>

                    <View style={styles.left}>
                        <TouchableOpacity >
                        <Image source={{uri: urlLeft}} style={styles.imageLeft} resizeMode={"contain"}/>
                        <Text style={{fontSize: 20, fontWeight: "bold", color: "white", paddingBottom: 40, fontFamily: "Montserrat-Bold"}}>
                            Je suis propriétaire
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.right}>
                        <TouchableOpacity onPress={() => navigation.navigate("SignupWaiter")}>
                        <Image source={{uri: urlRight}} style={styles.imageRight} resizeMode={"contain"}/>
                        <Text style={{fontSize: 20, fontWeight: "bold", color: "white", paddingBottom: 40, fontFamily: "Montserrat-Bold"}}>
                            Je suis serveur
                        </Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.signup}>
                    <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                    <Text style={{fontSize: 20, textDecorationLine: "underline", color: "white", fontFamily: "Montserrat-Bold"}}>
                        J'ai déjà un compte
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else {
        return (
            <AppLoading/>
        )
    }
}

const styles = StyleSheet.create({
    left: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e",

        elevation: 13,
        zIndex:999
    },
    right: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e",

        elevation: 13,
        zIndex: 999

    },
    signup: {
        flex: 0.15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e"
    },
    imageLeft: {
        flex: 0.8,
        width: undefined,
        height: undefined,
        alignSelf: "stretch"
    },
    imageRight: {
        width: undefined,
        height: undefined,
        alignSelf: "stretch",
        flex: 0.8
    },
    title: {
        flex: 0.30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e",
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        fontFamily: "Montserrat-Bold"
    }
})
