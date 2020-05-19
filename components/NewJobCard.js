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



export default function NewJobsCard( data) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })


    if(fontLoaded&&!modal){
        return(
            <TouchableOpacity onPress={()=>{setModal(true)}}>
                <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                <View style={styles.card}>
                <Text style={styles.text}>{data.data.name}</Text>
                <Text style={styles.text}>{data.data.address}</Text>
                <Text style={styles.text}>{data.data.date}</Text>
                <Text style={styles.text}>{data.data.beginningHour}-{data.data.endHour}</Text>
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
                            <Image source={{uri: "https://cdn.zuerich.com/sites/default/files/styles/sharing/public/web_zuerich_kindli_restaurant_1600x900_8375.jpg?itok=RzgOnZ6F"}} resizeMode={"contain"} style={{width:"100%", height:"50%"}}/>
                            <Text style={styles.modalText}>{data.data.name}</Text>
                            <Text style={styles.modalText}>{data.data.address}</Text>
                            <Text style={styles.modalText}>{data.data.date}</Text>
                            <Text style={styles.modalText}>{data.data.beginningHour}-{data.data.endHour}</Text>

                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "#06bf21" }}
                                onPress={()=>addResto(data.data)}
                            >
                                <Text style={styles.textStyle}>Accepter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ ...styles.openButton, backgroundColor: "rgba(141,23,22,0.58)", marginTop: 20}}
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

function addResto(data) {
    let user = firebase.auth().currentUser;
    if(!isEmpty(user)){
        firebase.firestore().collection("users").doc(user.email).update({
            accepted: firebase.firestore.FieldValue.arrayUnion(data.id)
        })
    }
    else{
        console.log("no user in card")
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
