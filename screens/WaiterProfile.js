import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, TextInput, SafeAreaView, Modal} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import firebase from "../configs/Firebase";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function WaiterMain({route, navigation, visible}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [data, setData] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState({});
    const [modal, setModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    useEffect(()=>{
        setModal(visible);
        let currentUser = firebase.auth().currentUser
            if (currentUser) {
                setUser(currentUser);
                console.log(currentUser.email)
                let docRef = firebase.firestore().collection("users").doc(currentUser.email);
                docRef.get().then(function (doc) {
                    if(doc.exists){
                        console.log(doc.data());
                        setData(doc.data());
                    }
                    else{
                        console.log("no data")
                    }
                })
            }
            else{
                console.log("no user");
            }
    },[])

    if(user==={}){
        let currentUser = firebase.auth().currentUser
        if (currentUser) {
            setUser(currentUser);
            console.log(currentUser.email)
            let docRef = firebase.firestore().collection("users").doc(currentUser.email);
            docRef.get().then(function (doc) {
                if(doc.exists){
                    console.log(doc.data());
                    setData(doc.data());
                }
                else{
                    console.log("no data")
                }
            })
        }
        else{
            console.log("no user");
        }
    }

    if(fontLoaded&&data&&!modal) {
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#c14752"}}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                               source={require("../assets/social-media.png")}/>

                        <Text style={styles.name}>{data.name} {data.surname}</Text>
                        <Text style={styles.userInfo}>{user.email}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity onPress={()=>setModal(true)}>
                            <Image style={styles.icon} source={require("../assets/social.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={()=>setModal(true)}>
                            <Text style={styles.info}>Visualiser le profil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity>
                            <Image style={styles.icon} source={require("../assets/tools.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity>
                            <Text style={styles.info}>Editer le profil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity onPress={()=>signout(navigation)}>
                            <Image style={styles.icon} source={require("../assets/logout.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={()=>signout(navigation)}>
                            <Text style={styles.info}>Se déconnecter</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                </View>
            </SafeAreaView>
        );
    }
    else if(modal&&data&&fontLoaded){
        return(
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#c14752"}}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                               source={require("../assets/social-media.png")}/>

                        <Text style={styles.name}>{data.name} {data.surname}</Text>
                        <Text style={styles.userInfo}>{user.email}</Text>
                    </View>
                </View>
                <View style={styles.body}>
                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity onPress={()=>setModal(true)}>
                                <Image style={styles.icon} source={require("../assets/social.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity>
                                <Text style={styles.info}>Visualiser le profil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity>
                                <Image style={styles.icon} source={require("../assets/tools.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity>
                                <Text style={styles.info}>Editer le profil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.item}>
                        <View style={styles.iconContent}>
                            <TouchableOpacity onPress={()=>signout(navigation)}>
                                <Image style={styles.icon} source={require("../assets/logout.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={()=>signout(navigation)}>
                                <Text style={styles.info}>Se déconnecter</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
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
                                    <Image
                                        source={require("../assets/social-media.png")}
                                        resizeMode={"contain"} style={{height: "20%", marginBottom:40}}/>
                                    <Text style={styles.modalText}>{data.name} {data.surname}</Text>
                                    <Text style={styles.modalText}>{user.email}</Text>
                                    <Text style={styles.modalText}>23 ans</Text>
                                    <Text style={styles.modalText}>079 xxx xx xx</Text>
                                    <View
                                        style={{backgroundColor: '#A2A2A2',
                                            height: 2,
                                            width: 165}}>
                                    </View>
                                    <Text style={styles.modalText}>{"\n"}Expériences :</Text>
                                    <Text style={styles.modalText}>2 mois chez XXXXXXXX</Text>
                                    <Text style={styles.modalText}>4 mois chez YYYYYYYY</Text>




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
                </View>

            </SafeAreaView>
        )

    }
    else{
        return (
            <AppLoading/>
        )
    }
}
function signout(navigation) {
    firebase.auth().signOut().then(function () {
        console.log("signed out")
        navigation.reset({
            index:0,
            routes: [{name: "SignupScreen"}]
        })
    }).catch(function (error) {
        console.log(error)
    })
}

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#c14752",
        elevation: 5,
        marginTop: 70
    },
    headerContent:{
        padding:30,
        alignItems: 'center',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
    },
    name:{
        fontSize:22,
        color:"#ffffff",
        fontWeight:'600',
        fontFamily: "Montserrat"

    },
    userInfo:{
        fontSize:16,
        color:"#ffffff",
        fontWeight:'600',
        fontFamily: "Montserrat"
    },
    body:{
        backgroundColor: "#c14752",
        height:500,
        alignItems:'center',
        top: 60
    },
    item:{
        flexDirection : 'row',
        alignItems: "center",
        marginTop: 10
    },
    infoContent:{
        flex:1,
        alignItems:'flex-start',
        paddingLeft:5,
        marginRight: 10,

    },
    iconContent:{
        flex:0.5,
        alignItems:'flex-end',
        paddingRight:5,
    },
    icon:{
        width:30,
        height:30,
        marginTop:20,
    },
    info:{
        fontSize:18,
        marginTop:20,
        color: "#FFFFFF",
        fontFamily: "Montserrat"
    },
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

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        marginBottom: 30
    },
    modalView: {
        width: "80%",
        height: "90%",
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
        fontSize: 20

    }
});
