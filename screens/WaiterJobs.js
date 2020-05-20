import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    FlatList,
    RefreshControl
} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import firebase from "../configs/Firebase";
import AcceptedJobCard from "../components/AcceptedJobCard";
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
    let restosRef =  firebase.firestore().collection("restos").orderBy("name");
    let data = []
    let accepted = [];
    let promise = new Promise(((resolve, reject) => {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then((restId)=> {
            for (let i = 0; i < restId.data().accepted.length; i++) {
                accepted.push(restId.data().accepted[i])
            }
            restosRef.get().then(function (doc) {
                doc.forEach(function (doc2) {
                    let contractRef = firebase.firestore().collection("restos").doc(doc2.id).collection("contract").orderBy("date");
                    contractRef.get().then((sub) => {
                        if (sub.size > 0) {
                            console.log("YES");
                            sub.forEach((subDoc) => {
                                accepted.forEach((acc)=>{
                                    console.log("C2 : ",acc," D2 : ", subDoc.id);
                                    if(subDoc.id===acc){
                                        let dataDate = subDoc.data().date;
                                        let dateParts = dataDate.split("-");
                                        let finalDate = new Date(+dateParts[0], dateParts[1]-1, +dateParts[2]);
                                        if(finalDate>new Date()){
                                            let finalData = {id:doc2.id, ...doc2.data(), ...subDoc.data(), id2:subDoc.id}
                                            console.log("???????????", finalData);
                                            data.push(finalData)
                                        }
                                    }
                                })

                            })
                            resolve(data)

                        } else {
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

export default function WaiterMain({navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [data, setData] = useState([]);

    const [refreshing, setRefreshing]=useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
            fetchData().then((res) =>{
                if(res!=data){
                    console.log("updating data...", res)
                    setData(res);
                }
                else{
                    console.log("no update needed")
                }
            }).catch((e)=>{
                console.log(e);
            })
        });
    }, [refreshing]);

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    useEffect(()=>{
        let restosRef = firebase.firestore().collection("restos").orderBy("name");
        let accepted = [];
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then((restId)=> {
            for (let i = 0; i < restId.data().accepted.length; i++) {
                accepted.push(restId.data().accepted[i])
            }
            restosRef.get().then(function (doc) {
                doc.forEach(function(doc2) {
                    let contractRef = firebase.firestore().collection("restos").doc(doc2.id).collection("contract").orderBy("date");
                    contractRef.get().then((sub)=>{
                        if(sub.size > 0){
                            sub.forEach((subDoc)=>{
                                accepted.forEach((acc)=>{
                                    console.log("A2 : ",acc," B2 : ", subDoc.id);
                                    if(subDoc.id===acc) {
                                        console.log("YES2");
                                        let dataDate = subDoc.data().date;
                                        let dateParts = dataDate.split("-");
                                        let finalDate = new Date(+dateParts[0], dateParts[1]-1, +dateParts[2]);
                                        if(finalDate>new Date()){
                                            let finalData = {id:doc2.id, ...doc2.data(), ...subDoc.data(), id2:subDoc.id}
                                            console.log("???????????", finalData);
                                            setData(data => [...data, finalData])
                                        }
                                    }
                                    else {
                                        console.log("NO2")
                                    }
                                })

                            })
                        }

                    })
                });
            }).catch((error)=>{
                console.log(error);
            })
        })
    }, [])

    if(fontLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{fontFamily:"Montserrat-Bold", textAlign:"center", margin: 20, fontSize: 20}}>Les jobs en attente de confirmation</Text>
                <Text style={{fontFamily:"Montserrat", textAlign:"center", margin: 20, marginTop: 10, fontSize: 15}}>Vous serez contacté par le  restaurateur si votre candidature est acceptée</Text>
                <FlatList
                    data={data}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                    }
                    renderItem={({ item }) => (
                        <AcceptedJobCard
                            data={item}
                        />
                    )}
                    keyExtractor={(item, index)=> String(index)}
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
