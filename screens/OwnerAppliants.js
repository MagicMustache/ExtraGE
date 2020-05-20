import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    ActivityIndicator,
    RefreshControl, FlatList
} from 'react-native';
import firebase from "../configs/Firebase"
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import NewJobCard from "../components/NewJobCard";
import ContractCard from "../components/ContractCard";
import Constants from "expo-constants";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}
function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

async function fetchData() {
    let res = []
    let promise = new Promise(((resolve, reject) => {
        firebase.firestore().collection("restos").doc(firebase.auth().currentUser.email).collection("contract").get().then((doc)=>{
            doc.forEach((subDoc)=>{
                let data = {...subDoc.data(), id:subDoc.id}
                res.push(data)
            })
            resolve(res)
        })
    }))
    return await promise

}

export default function OwnerAppliants() {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [contractsLoaded, setContractsLoaded] = useState(false)
    const [refreshing, setRefreshing]=useState(false);


    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    useEffect(()=>{
        firebase.firestore().collection("restos").doc(firebase.auth().currentUser.email).collection("contract").get().then((doc)=>{
            doc.forEach((subDoc)=>{
                let data = {...subDoc.data(), id:subDoc.id}
                setContracts(pData=>[...pData, data])
            })
            setContractsLoaded(true);
        })
    },[])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
            fetchData().then(res =>{
                if(res!==contracts){
                    console.log("updating data...", res)
                    setContracts(res);
                }
                else{
                    console.log("no update needed")
                }
            })
        });
    }, [refreshing]);

    if(fontLoaded && contractsLoaded) {
        console.log(contracts)
        return (
            <SafeAreaView style={{flex: 1, marginTop: Constants.statusBarHeight*2, justifyContent: "center"}}>
                <Text style={{fontFamily:"Montserrat", fontSize:30, alignSelf:"center", marginBottom:"10%"}}>Vos contrats :</Text>
                <FlatList
                    data={contracts}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    renderItem={({ item }) => (
                        <ContractCard data={item}/>
                    )}
                />
            </SafeAreaView>
        )
    }
    else {
        return (
            <AppLoading/>
        )
    }
}
