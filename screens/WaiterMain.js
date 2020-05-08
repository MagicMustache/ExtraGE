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
    let accepted = [];
    let i = 0;
    let promise = new Promise(((resolve, reject) => {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then((restId)=> {
            for (let i = 0; i < restId.data().accepted.length; i++) {
                accepted.push(restId.data().accepted[i])
            }
            restosRef.get().then(function (doc) {
                doc.forEach(function (doc2) {
                    let contractRef = firebase.firestore().collection("restos").doc(doc2.id).collection("contract").orderBy("date");
                    contractRef.get().then((sub) => {
                        console.log("C : ",i, " ", accepted[i]," D : ", doc2.id);
                        if (sub.size > 0 && doc2.id!==accepted[i]) {
                            console.log("YES");
                            sub.forEach((subDoc) => {
                                let finalData = {id:doc2.id,...doc2.data(), ...subDoc.data()}
                                console.log("------------", finalData)
                                data.push(finalData)
                            })
                            resolve(data)

                        } else {
                            i++
                            console.log("NO")
                        }
                    })
                });
            }).catch((error) => {
                console.log(error);
            })
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
                if(res!=dataRestos){
                    console.log("updating data...", res)
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
        let accepted = [];
        let i = 0;
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then((restId)=>{
            for(let i = 0;i<restId.data().accepted.length;i++){
                accepted.push(restId.data().accepted[i])
            }
        restosRef.get().then(function (doc) {
            doc.forEach(function(doc2) {
                let contractRef = firebase.firestore().collection("restos").doc(doc2.id).collection("contract").orderBy("date");
                contractRef.get().then((sub)=>{
                    console.log("A : ",i, " ", accepted[i]," B : ", doc2.id);
                    if(sub.size > 0 && doc2.id!==accepted[i]){
                        console.log("YES");
                        sub.forEach((subDoc)=>{
                            let finalData = {id:doc2.id, ...doc2.data(), ...subDoc.data()}
                            console.log("+++++++++", finalData);
                            setDataRestos(dataRestos => [...dataRestos, finalData])
                        })
                    }
                    else{
                        i++;
                        console.log("NO")
                    }
                })
            });
        }).catch((error)=>{
            console.log(error);
        })
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



    if(fontLoaded) {
        console.log(dataRestos)
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{fontFamily:"Montserrat-Bold", textAlign:"center", margin: 20, fontSize: 20}}>Les jobs disponibles</Text>
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
        justifyContent: "center"
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
