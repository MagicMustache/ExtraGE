import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, SafeAreaView, ActivityIndicator, ImageBackground } from 'react-native';
import firebase from "../configs/Firebase"
import * as Font from 'expo-font';
import {AppLoading} from "expo";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function OwnerMain() {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [ownerData, setOwnerData] = useState(undefined);
    const [restData, setRestData] = useState(undefined);
    const [contract, setContract] = useState(undefined);

    useEffect(()=>{
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then((doc)=>{
            setOwnerData(doc.data());
            firebase.firestore().collection("restos").doc(firebase.auth().currentUser.email).get().then((doc2)=>{
                setRestData(doc2.data())
                firebase.firestore().collection("restos").doc(firebase.auth().currentUser.email).collection("contract").get().then((sub)=>{
                    if(sub.size>0){
                        setContract(<Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15}}>Contrat en cours : le {sub[0].data().date} de {sub[0].data().beginningHour}h à {sub[0].data().endHour}h</Text>)
                    }
                    else{
                        setContract(<Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15}}>Aucun contrat en cours</Text>)
                    }
                })
            })
        })
    },[])


    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })


    if(fontLoaded&&ownerData&&restData&&contract!==undefined) {
        console.log(ownerData, restData)
        return (
            <View style={{flex:1}}>
                <View style={{flex:0.35, alignItems: "center", marginTop:"20%",}}>
                <ImageBackground source={require("../assets/placeholder.png")}
                                 resizeMode={"contain"}
                                 style={{width:"100%", height:"100%", alignItems:"center",alignSelf:"center"}}
                                 imageStyle={{ width:"100%", height:"100%", borderRadius:20}}>
                    <TouchableOpacity style={{width:"30%", height:"30%", alignSelf:"flex-end", right:"0%"}}>
                        <Image source={require("../assets/edit.png")} resizeMode={"contain"} style={{height:"60%", width:"60%"}}/>
                    </TouchableOpacity>
                </ImageBackground>
                    <Text style={{marginTop:"10%", fontFamily:"Montserrat", fontSize:25}}>"{restData.name}"</Text>
                </View>

                <View style={{flex:0.65, marginLeft:"15%"}}>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15}}>Propriétaire : {ownerData.name} {ownerData.surname}</Text>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15}}>Adresse : {restData.address}</Text>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15}}>Email : {restData.email}</Text>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15}}>Téléphone : {restData.phone}</Text>
                    {contract}
                </View>
            </View>
        )
    }
    else {
        return (
            <AppLoading/>
        )
    }

}

