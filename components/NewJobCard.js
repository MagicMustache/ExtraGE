import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, BackHandler, Alert, Platform, ScrollView, RefreshControl, SafeAreaView, FlatList} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import Constants from "expo-constants";


let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function NewJobsCard( data) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })
    console.log(data);

    if(fontLoaded){
        return(
            <TouchableOpacity >
                <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                <View style={styles.card}>
                <Text>{data.data.name}</Text>
                <Text>{data.data.address}</Text>
                <Text>{data.data.date}</Text>
                <Text>{data.data.length}</Text>
                </View>
                </View>
            </TouchableOpacity>
    )}
    else {
        return <AppLoading/>
    }

}
const styles = StyleSheet.create({
    card:{
        width:"75%",
        justifyContent: "center",
        alignItems:"center",
        marginBottom: 20,
        backgroundColor: "rgba(141,23,22,0.58)",
        padding: 10
    },
    text:{
        fontFamily: "Montserrat",

    }
});
