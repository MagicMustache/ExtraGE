import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Button, BackHandler, Alert, Platform, ScrollView, RefreshControl, SafeAreaView, FlatList, ToastAndroid} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import {useFocusEffect} from "@react-navigation/core";
import firebase from "../configs/Firebase";
import Constants from 'expo-constants';
import NewJobCard from "../components/NewJobCard";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

async function fetchData() {
    let restosRef =  firebase.firestore().collection("restos").orderBy("name");
    let data = []
    let promise = new Promise(((resolve, reject) => {
        restosRef.get().then(function (doc) {
            doc.forEach(function(doc2) {
                // doc.data() is never undefined for query doc snapshots
                data.push(doc2.data())
            });
            resolve(data)
        }).catch((error)=>{
            console.log(error);
        })
    }))

    return await promise;
}

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}


export default function WaiterMain({navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [exitApp,SETexitApp]=useState(false);
    const [dataRestos, setDataRestos]=useState([])
    const [refreshing, setRefreshing]=useState(false);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
            fetchData().then(res =>{
                if(res!==dataRestos){
                    console.log("updating data...")
                    setDataRestos(res);
                }
                else{
                    console.log("no update needed")
                }
            })
        });
    }, [refreshing]);

    useEffect(()=>{
        let restosRef = firebase.firestore().collection("restos").orderBy("name");
        restosRef.get().then(function (doc) {
            doc.forEach(function(doc2) {
                // doc.data() is never undefined for query doc snapshots
                setDataRestos(dataRestos => [...dataRestos, doc2.data()])
            });
        }).catch((error)=>{
            console.log(error);
        })
    },[])


    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })


    const backAction = () => {
        if(exitApp===false){
            SETexitApp(true);
            if(Platform.OS === "android"){
                ToastAndroid.show("appuyez de nouveau pour quitter l'app", ToastAndroid.SHORT)
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



    if(fontLoaded&&dataRestos.length===3) {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={dataRestos}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    renderItem={({ item }) => (
                        <NewJobCard
                            data={item}
                        />
                    )}
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
