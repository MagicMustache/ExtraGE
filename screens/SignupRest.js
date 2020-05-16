import React, {useState, useEffect} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput, ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import {AppLoading} from "expo";
import * as Font from "expo-font";
import firebase from "../configs/Firebase";


let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}


export default function SignupRest({route, navigation}) {

    const [restEmail, setEmail] = useState("");
    const [restName, setName] = useState("");
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [restPhone, setPhone] = useState("")
    const [restAdr, setAdr] = useState("");

    const {name} = route.params;
    const {surname} = route.params;
    const {password} = route.params;
    const {email} = route.params;
    const {phone} = route.params;
    const {date} = route.params;


    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })
    if(fontLoaded){
        return(
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{flex:1}}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.logo}>ExtraGE</Text>
                        <View style={styles.inputView2} >
                            <TextInput
                                style={styles.inputText}
                                placeholder="Nom du restaurant"
                                placeholderTextColor="white"
                                placeholderStyle={{fontFamily: "Montserrat"}}
                                onChangeText={text => setName(text)}/>
                        </View>
                    <View style={styles.inputView2} >
                        <TextInput
                            style={styles.inputText}
                            placeholder="Adresse du restaurant"
                            placeholderTextColor="white"
                            placeholderStyle={{fontFamily: "Montserrat"}}
                            onChangeText={text => setAdr(text)}/>
                    </View>
                    <View style={styles.inputView2} >
                        <TextInput
                            style={styles.inputText}
                            placeholder="Numéro de téléphone du restaurant"
                            placeholderTextColor="white"
                            keyboardType={"phone-pad"}
                            onChangeText={num => setPhone(num)}/>
                    </View>

                    <View style={styles.inputView2} >
                        <TextInput
                            style={styles.inputText}
                            placeholder="Email du restaurant"
                            placeholderTextColor="white"
                            onChangeText={text => setEmail(text)}/>
                    </View>

                    <TouchableOpacity style={styles.loginBtn} onPress={()=>{
                        createAccount(name, surname, email, password, date, phone, restName, restAdr, restPhone, restEmail.toLowerCase())
                        navigation.reset({
                            index:0,
                            routes: [{name: "LoginScreen"}]
                        })
                    }}>
                        <Text style={styles.loginText}>Créer le compte</Text>
                    </TouchableOpacity>
                    <View style={{position: "absolute", bottom:50}}>
                        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                            <Text style={{fontSize: 15, color: "white", fontFamily: "Montserrat-Bold"}} >Retour</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>

        );
    }
    else{
        return(
            <AppLoading/>
        )
    }
}

function createAccount(name, surname, email, password, date, phone, restName, restAdr, restPhone, restEmail) {
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
            owner: true,
            birthdate: date,
            phone: phone
        }).then(()=>{
            console.log("user created")
            firebase.firestore().collection("restos").doc(email).set({
                name:restName,
                address:restAdr,
                phone:restPhone,
                email:restEmail
            }).then(()=>{
                console.log("resto created")

            }).catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }).catch(function(error) {
            console.error("Error writing document: ", error);
        });

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
    inputView1:{
        width:"40%",
        backgroundColor:"#8d1716",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20,
        fontFamily: "Montserrat"

    },
    inputView2:{
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
