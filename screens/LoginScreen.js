import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';
import firebase from "../configs/Firebase"
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import Toast from "react-native-simple-toast";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fontLoaded, setFontsLoaded] = useState(false);

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })
    firebase.auth().onAuthStateChanged(function (user) {
        if(user){
            console.log("logged in : ", user.email)
            navigation.navigate("SignupWaiter")
        }
        else{
            console.log("not logged in")
        }

    })

    if(fontLoaded){
        return(
            <View style={styles.container}>
                <Text style={styles.logo}>ExtraGE</Text>
                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Email"
                        placeholderTextColor="white"
                        onChangeText={text => setEmail(text)}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Mot de passe"
                        placeholderTextColor="white"
                        onChangeText={text => setPassword(text)}/>
                </View>
                <TouchableOpacity>
                    <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginBtn} onPress={()=> login(email, password)}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginBtn} onPress={()=> signout()}>
                    <Text style={styles.loginText}>Test Signout</Text>
                </TouchableOpacity>
            </View>
        );
    }
    else{
        return(
            <AppLoading/>
        )
    }

}

function login(email, password) {
    //TODO login too slow
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return( Toast.show("Erreur: Email ou Mot de passe incorrect", Toast.LONG));

    })
}

function signout() {
    firebase.auth().signOut().then(function () {
        console.log("signed out")
    }).catch(function (error) {
        console.log(error)
    })
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#a8323e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"white",
        marginBottom:40,
        fontFamily: "Montserrat-Bold"

    },
    inputView:{
        width:"80%",
        backgroundColor:"#8d1716",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        height:50,
        color:"white"
    },
    forgot:{
        color:"white",
        fontSize:11
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#8d1716",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    loginText:{
        color:"white"
    }
});
