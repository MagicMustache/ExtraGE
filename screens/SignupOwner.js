import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    ToastAndroid,
    KeyboardAvoidingView
} from 'react-native';
import firebase from "../configs/Firebase"
import * as Font from "expo-font";
import {AppLoading} from "expo";
import {Button} from "react-native-web";
import DatePicker from 'react-native-datepicker'

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function SignupOwner({navigation}) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [surname, setSurname] = useState("");
    const [name, setName] = useState("");
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [date, setDate] = useState("");
    const [phone, setPhone] = useState("")

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })


    if(fontLoaded){
        return(
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : null} style={{flex:1}}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.logo}>ExtraGE</Text>
                    <View style={{flexDirection:"row"}}>
                        <View style={styles.inputView1} >
                            <TextInput
                                style={styles.inputText}
                                placeholder="Prénom"
                                placeholderTextColor="white"
                                onChangeText={text => setName(text)}/>
                        </View>
                        <View style={styles.inputView1} >
                            <TextInput
                                style={styles.inputText}
                                placeholder="Nom"
                                placeholderTextColor="white"
                                placeholderStyle={{fontFamily: "Montserrat"}}
                                onChangeText={text => setSurname(text)}/>
                        </View>
                    </View>
                    <View style={styles.inputView2}>
                        <DatePicker style={{width:"80%", }}
                                    date={date}
                                    placeholder={"Date de naissance"}
                                    format={"YYYY-MM-DD"}
                                    minDate={"1900-01-01"}
                                    maxDate={"2012-05-07"}
                                    confirmBtnText={"valider"}
                                    cancelBtnText={"annuler"}
                                    customStyles={{
                                        placeholderText: {
                                            color: "#ffffff",
                                            fontFamily: "Montserrat"
                                        },
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0,

                                        },
                                        dateInput: {
                                            marginLeft: 36,
                                            borderWidth: 0
                                        },
                                        dateText:{
                                            color:"#ffffff"
                                        }
                                    }}
                                    onDateChange={(date1)=>{setDate(date1)}}
                        />
                    </View>
                    <View style={styles.inputView2} >
                        <TextInput
                            style={styles.inputText}
                            placeholder="Numéro de téléphone"
                            placeholderTextColor="white"
                            keyboardType={"phone-pad"}
                            onChangeText={num => setPhone(num)}/>
                    </View>

                    <View style={styles.inputView2} >
                        <TextInput
                            style={styles.inputText}
                            placeholder="Email"
                            placeholderTextColor="white"
                            onChangeText={text => setEmail(text)}/>
                    </View>

                    <View style={styles.inputView2} >
                        <TextInput
                            secureTextEntry
                            style={styles.inputText}
                            placeholder="Mot de passe"
                            placeholderTextColor="white"
                            onChangeText={text => setPassword(text)}/>
                    </View>
                    <View style={styles.inputView2} >
                        <TextInput
                            secureTextEntry
                            style={styles.inputText}
                            placeholder="Confirmer le mot de passe"
                            placeholderTextColor="white"
                            onChangeText={text => setPassword2(text)}/>
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={()=>{
                        if(checkPassword(password, password2)){
                            navigation.navigate("SignupRest",{
                                email:email.toLowerCase(),
                                name:name,
                                surname:surname,
                                phone:phone,
                                date:date,
                                password:password
                            })
                        }
                        else{
                            console.log("Password not matching")
                        }
                    }}>
                        <Text style={styles.loginText}>Suivant</Text>
                    </TouchableOpacity>
                    <View style={{position: "absolute", bottom:50}}>
                        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                            <Text style={{fontSize: 15, color: "white", fontFamily: "Montserrat-Bold"}} >Retourner à l'accueil</Text>
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

function checkPassword(p1,p2){
    return p1 === p2;
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
