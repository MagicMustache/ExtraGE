import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TextInput, TouchableOpacity, SafeAreaView} from 'react-native';
import firebase from "../configs/Firebase"
import * as Font from "expo-font";
import {AppLoading} from "expo";
import {Button} from "react-native-web";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function SignupWaiter({navigation}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [noUser, setNoUser] = useState(false);
    const [fontLoaded, setFontsLoaded] = useState(false);

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.auth().signOut().then(function () {
                setNoUser(true);
            }).catch(function (error) {
                console.log(error);
            })
        } else {
            setNoUser(true);
            // No user is signed in.
        }
    });


    if(fontLoaded && noUser){
        return(
            <SafeAreaView style={styles.container}>
                <Text style={styles.logo}>ExtraGE</Text>
                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Prénom"
                        placeholderTextColor="white"
                        onChangeText={text => setName(text)}/>
                </View>
                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Nom"
                        placeholderTextColor="white"
                        onChangeText={text => setSurname(text)}/>
                </View>
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
                <View style={styles.inputView} >
                    <TextInput
                        secureTextEntry
                        style={styles.inputText}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor="white"
                        onChangeText={text => setPassword2(text)}/>
                </View>
                <TouchableOpacity style={styles.loginBtn} onPress={()=>{createAccount(name, surname, email, password, password2)}}>
                    <Text style={styles.loginText}>Créer mon compte</Text>
                </TouchableOpacity>
                <View style={{position: "absolute", bottom:50}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                    <Text style={{fontSize: 15, color: "white", fontFamily: "Montserrat-Bold"}} >Retourner à l'accueil</Text>
                </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
    else{
        return(
            <AppLoading/>
        )
    }

}

function createAccount(name, surname, email, password, password2) {
    if(password===password2){
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(u => {
            })
            .catch(error => {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        console.log("Email address ",email," already in use.");
                        break;
                    case 'auth/invalid-email':
                        console.log("Email address ",email," invalid.");
                        break;
                    case 'auth/operation-not-allowed':
                        console.log(`Error during sign up.`);
                        break;
                    case 'auth/weak-password':
                        console.log('Password is not strong enough. Add additional characters including special characters and numbers.');
                        break;
                    default:
                        console.log(error.message);
                }
            });
        firebase.firestore().collection("users").doc(email).set({
            name: name,
            surname: surname,
        }).then(()=>{
            console.log("user created")
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }
    else{
        //Toast.show("NO")
    }

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
        padding:20,
        fontFamily: "Montserrat"

    },
    inputText:{
        height:50,
        color:"white",
        fontFamily: "Montserrat"

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
        marginBottom:10,
        fontFamily: "Montserrat"

    },
    loginText:{
        color:"white",
        fontFamily: "Montserrat-Bold"

    }
});
