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
    const [data, setData] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState({})
    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    useEffect(()=>{
        let currentUser = firebase.auth().currentUser
            if (currentUser) {
                setUser(currentUser);
                console.log(currentUser.email)
                let docRef = firebase.firestore().collection("users").doc(currentUser.email);
                docRef.get().then(function (doc) {
                    if(doc.exists){
                        console.log(doc.data());
                        setData(doc.data());
                    }
                })
            }
            else{
                console.log("no user")
            }
    },[])

    if(fontLoaded&&(data)) {
        console.log("HEREPROFILE")
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#c14752"}}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                               source={require("../assets/social-media.png")}/>

                        <Text style={styles.name}>{data.name} {data.surname}</Text>
                        <Text style={styles.userInfo}>{user.email}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <Image style={styles.icon} source={require("../assets/color.png")}/>
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.info}>Home</Text>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity>
                            <Image style={styles.icon} source={require("../assets/tools.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity>
                            <Text style={styles.info}>Editer le profil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity onPress={()=>signout(navigation)}>
                            <Image style={styles.icon} source={require("../assets/logout.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={()=>signout(navigation)}>
                            <Text style={styles.info}>Se déconnecter</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>
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

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#c14752",
        elevation: 5,
    },
    headerContent:{
        padding:30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
    },
    name:{
        fontSize:22,
        color:"#ffffff",
        fontWeight:'600',
        fontFamily: "Montserrat"

    },
    userInfo:{
        fontSize:16,
        color:"#ffffff",
        fontWeight:'600',
        fontFamily: "Montserrat"
    },
    body:{
        backgroundColor: "#c14752",
        height:500,
        alignItems:'center',
        top: 60
    },
    item:{
        flexDirection : 'row',
        alignItems: "center",
        marginTop: 10
    },
    infoContent:{
        flex:1,
        alignItems:'flex-start',
        paddingLeft:5,
        marginRight: 10,

    },
    iconContent:{
        flex:0.5,
        alignItems:'flex-end',
        paddingRight:5,
    },
    icon:{
        width:30,
        height:30,
        marginTop:20,
    },
    info:{
        fontSize:18,
        marginTop:20,
        color: "#FFFFFF",
        fontFamily: "Montserrat"
    }
});
