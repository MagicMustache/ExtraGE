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
    Modal, TouchableHighlight, ImageBackground
} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import firebase from "../configs/Firebase";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";


let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}



export default function AppliantCard( data) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [appliants, setAppliants] = useState([]);
    const [image, setImage] = useState(undefined)

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })
    useEffect(()=>{

    },[])

    let parts = data.data.birthdate.split("-");
    let myDate = new Date(parts[0], parts[1]-1, parts[2]);
    let age = (Math.abs(new Date(Date.now() - myDate.getTime()).getUTCFullYear()-1970))

    if(fontLoaded&&!modal){
        console.log(appliants);
        return(
            <TouchableOpacity onPress={()=>{setModal(true)}}>
                <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                    <View style={styles.card}>
                        <Text style={styles.text}>{data.data.name} {data.data.surname}{"\n"}</Text>
                        <Text style={styles.text}>{age} ans</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )}
    else if(modal&&fontLoaded){
        let expArray = data.data.experience.map(info=>(

            <Text style={styles.modalText}>{info.length} mois chez "{info.name}"</Text>

        ))
        firebase.storage().ref("/"+data.data.id).getDownloadURL().then((result)=>{
            if(result !== image){
                setImage(result);
            }
        })
        return(
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    style={{position: "absolute"}}
                    onRequestClose={() => {
                        setModalVisible(false)
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ImageBackground
                                source={{uri:image}}
                                resizeMode={"contain"} style={{width:"50%", height:"20%", marginBottom:20, alignSelf:"center"}} imageStyle={{width:"100%", height:"100%",borderRadius:70}}/>
                            <Text style={styles.modalText}>{data.data.name} {data.data.surname}</Text>
                            <Text style={styles.modalText}>{data.data.id}</Text>
                            <Text style={styles.modalText}>{age} ans</Text>
                            <Text style={styles.modalText}>{data.data.phone}</Text>
                            <View
                                style={{backgroundColor: '#A2A2A2',
                                    height: 2,
                                    width: 165}}>
                            </View>
                            <Text style={styles.modalText}>{"\n"}Expériences :</Text>
                            {expArray}




                            <TouchableOpacity
                                style={{...styles.openButton, backgroundColor: "rgba(141,23,22,0.58)", marginTop: 20, position:"absolute", bottom:"10%"}}
                                onPress={() => {
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
        width:"70%",
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
