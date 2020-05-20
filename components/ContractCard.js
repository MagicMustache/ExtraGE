import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Button,
    BackHandler,
    Alert,
    Platform,
    ScrollView,
    RefreshControl,
    SafeAreaView,
    FlatList,
    Modal, TouchableHighlight
} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import firebase from "../configs/Firebase";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";


let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}



export default function Contract( data) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [appliants, setAppliants] = useState([]);

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })
    useEffect(()=>{
        firebase.firestore().collection("users").where("owner","==", false).get().then((res)=>{
            res.forEach((subdoc)=>{
                if(subdoc.data().accepted.length>0){
                    for(let i=0;i<subdoc.data().accepted.length;i++){
                        if(subdoc.data().accepted[i] === data.data.id){
                            setAppliants(pData=>[...pData, subdoc.data()])
                        }
                    }
                }
            })
        })
    },[])

    if(fontLoaded&&!modal){
        console.log(appliants);
        return(
            <TouchableOpacity onPress={()=>{setModal(true)}}>
                <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                    <View style={styles.card}>
                        <Text style={styles.text}>Contrat{"\n"}</Text>
                        <Text style={styles.text}>le {data.data.date}</Text>
                        <Text style={styles.text}>de {data.data.beginningHour} à {data.data.endHour}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )}
    else if(modal&&fontLoaded){
        return(
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{fontFamily:"Montserrat", fontSize:25}}>Les postulants : </Text>


                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "rgba(141,23,22,0.58)", position:"absolute", bottom:"10%"}}
                                onPress={() => {
                                    //setModalVisible(!modalVisible);
                                    setModal(false);
                                }}
                            >
                                <Text style={styles.textStyle}>Retour</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
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
        padding: 10,
        borderRadius: 20
    },
    text:{
        fontFamily: "Montserrat",

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width: "80%",
        height: "60%",
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width:100
    },
    textStyle: {
        color: "white",
        textAlign: "center",
        fontFamily: "Montserrat",

    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "Montserrat",

    }
});
