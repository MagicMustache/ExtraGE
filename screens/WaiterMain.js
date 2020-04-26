import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, BackHandler, Alert, Platform, ScrollView, RefreshControl, SafeAreaView, FlatList} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import {useFocusEffect} from "@react-navigation/core";
import Toast from "react-native-simple-toast"
import firebase from "../configs/Firebase";
import Constants from 'expo-constants';
import NewJobCard from "../components/NewJobCard";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        name: 'resto1',
        address: "rue de la boustifaille, 4",
        date: "27.04.2020",
        hourRange: "11h-16h"
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        name: 'resto2',
        address: "rue de la boustifaille, 2",
        date: "26.04.2020",
        hourRange: "10h-16h"
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        name: 'resto3',
        address: "rue de la boustifaille, 6",
        date: "25.04.2020",
        hourRange: "12h-16h"
    },
];


export default function WaiterMain({navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [exitApp,SETexitApp]=useState(false)


    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })


    const backAction = () => {
        if(exitApp===false){
            SETexitApp(true);
            if(Platform.OS === "android"){
                Toast.show("Appuyez de nouveau pour quitter l'app")
            }
        }
        else if(exitApp===true){
            BackHandler.exitApp()
        }

        setTimeout(()=>{
            SETexitApp(false)
        }, 1500);
        return true;
    };
    useEffect(() =>
    {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    },[exitApp])



    if(fontLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={DATA}
                    renderItem={({ item }) => (
                        <NewJobCard
                            data={item}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        );
    }
else{
        return(
            <AppLoading/>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight*2,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
