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
                        if (sub.size > 0 && doc2.id==accepted[i]) {
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

export default function WaiterMain({navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [data, setData] = useState([]);

    const [refreshing, setRefreshing]=useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false);
            fetchData().then(res =>{
                if(res!=data){
                    console.log("updating data...", res)
                    setData(res);
                }
                else{
                    console.log("no update needed")
                }
            })
        });
    }, [refreshing]);

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    useEffect(()=>{
        let restosRef = firebase.firestore().collection("restos").orderBy("name");
        let accepted = [];
        let i = 0;
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then((restId)=> {
            for (let i = 0; i < restId.data().accepted.length; i++) {
                accepted.push(restId.data().accepted[i])
            }
            restosRef.get().then(function (doc) {
                doc.forEach(function(doc2) {
                    let contractRef = firebase.firestore().collection("restos").doc(doc2.id).collection("contract").orderBy("date");
                    contractRef.get().then((sub)=>{
                        console.log("A : ",i, " ", accepted[i]," B : ", doc2.id);
                        if(sub.size > 0 && doc2.id==accepted[i]){
                            console.log("YES");
                            sub.forEach((subDoc)=>{
                                let finalData = {id:doc2.id, ...doc2.data(), ...subDoc.data()}
                                console.log("???????????", finalData);
                                setData(data => [...data, finalData])
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
    }, [])

    if(fontLoaded) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{fontFamily:"Montserrat-Bold", textAlign:"center", margin: 20, fontSize: 20}}>Les jobs acceptés</Text>
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
