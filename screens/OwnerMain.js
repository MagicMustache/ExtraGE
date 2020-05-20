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
    ImageBackground,
    Modal,
    TouchableHighlight,
    Platform, ToastAndroid, BackHandler
} from 'react-native';
import firebase from "../configs/Firebase"
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import * as ImagePicker from "expo-image-picker";
import DatePicker from 'react-native-datepicker'
import DateTimePickerModal from "react-native-modal-datetime-picker";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}

export default function OwnerMain({navigation}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [ownerData, setOwnerData] = useState(undefined);
    const [restData, setRestData] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [image, setImage] = useState(undefined);
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState("");
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
    const [exitApp,SETexitApp]=useState(false);
    const [begHour, setBegHour] = useState("12h");
    const [endHour, setEndHour] = useState("14h");


    useEffect(()=>{
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).get().then((doc)=>{
            setOwnerData(doc.data());
            firebase.firestore().collection("restos").doc(firebase.auth().currentUser.email).get().then((doc2)=>{
                setRestData(doc2.data())
                firebase.firestore().collection("restos").doc(firebase.auth().currentUser.email).collection("contract").get().then((sub)=>{
                    if(sub.size>0){
                            setContract(<Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15, marginLeft:"15%"}}>{sub.size} Contrat en cours </Text>)
                    }
                    else{
                        setContract(<Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15, marginLeft:"15%"}}>Aucun contrat en cours</Text>)
                    }
                })
            })
        })
        firebase.storage().ref("/"+firebase.auth().currentUser.email).getDownloadURL().then((result)=>{
            setImage(result);
        }).catch((e)=>{
            firebase.storage().ref("/placeholder.png").getDownloadURL().then((res)=>{
                setImage(res);
            })
        })
    },[])

    if(image === undefined){
        firebase.storage().ref("/"+firebase.auth().currentUser.email).getDownloadURL().then((result)=>{
            setImage(result);
        }).catch((e)=>{
            firebase.storage().ref("/placeholder.png").getDownloadURL().then((res)=>{
                setImage(res);
            })
        })
    }


    async function pickImage() {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                upload(result.uri).then(()=>{
                    console.log("image uploaded");
                    firebase.storage().ref("/"+firebase.auth().currentUser.email).getDownloadURL().then((result)=>{
                        setImage(result);
                    })
                })
            }

            console.log(result);
        } catch (e) {
            console.log(e)
        }
    }

    async function upload(uri){
        const resp = await fetch(uri);
        const blob = await resp.blob();
        let ref = firebase.storage().ref().child(firebase.auth().currentUser.email);
        return ref.put(blob);
    }

    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    const showDatePicker = (i) => {
        console.log(i)
        if(i===1){
            setDatePickerVisibility(true);
        }
        else if(i===2){
            setDatePickerVisibility2(true);
        }
    };


    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        console.log("A date has been picked: ", date.getHours().toString()+"h"+date.getMinutes().toString());
        setDatePickerVisibility(false);
        setBegHour(date.getHours().toString()+"h"+date.getMinutes().toString())
    };
    const hideDatePicker2 = () => {
        setDatePickerVisibility2(false);
    };

    const handleConfirm2 = (date) => {
        console.log("A date has been picked: ", date.getHours().toString()+"h"+date.getMinutes().toString());
        setDatePickerVisibility2(false);
        setEndHour(date.getHours().toString()+"h"+date.getMinutes().toString())
    };

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

    if(fontLoaded&&ownerData&&restData&&contract!==undefined) {
        return (
            <View style={{flex:1}}>
                <Modal
                animationType={"slide"}
                transparent={true}
                visible={modalVisible}>
                    <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                        <View style={styles.modal}>
                            <Text style={{fontFamily:"Montserrat", fontSize:30}}> Créer un contrat</Text>
                            <Text style={{fontFamily:"Montserrat", marginTop:50}}> Sélectionnez une date pour votre contrat</Text>
                            <DatePicker style={{width:"80%", marginTop:20}}
                                        date={date}
                                        placeholder={"Date du contrat"}
                                        format={"YYYY-MM-DD"}
                                        minDate={"2020-01-01"}
                                        maxDate={"2050-05-07"}
                                        confirmBtnText={"valider"}
                                        cancelBtnText={"annuler"}
                                        customStyles={{
                                            placeholderText: {
                                                fontFamily: "Montserrat"
                                            },
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0,

                                            },
                                            dateInput: {
                                                marginLeft: 36,
                                                borderWidth: 0
                                            },
                                            dateText:{
                                            }
                                        }}
                                        onDateChange={(date1)=>{setDate(date1)}}
                            />
                            <Text style={{fontFamily:"Montserrat", marginTop:30}}> Heure de début du contrat</Text>
                            <TouchableOpacity onPress={()=>{showDatePicker(1)}}>
                                <Text style={{fontFamily:"Montserrat", marginTop:10, fontSize:20, textDecorationLine:"underline"}}>{begHour}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="time"
                                locale={"en_GB"}
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                            <Text style={{fontFamily:"Montserrat", marginTop:30}}> Heure de fin du contrat</Text>
                            <TouchableOpacity onPress={()=>{showDatePicker(2)}}>
                                <Text style={{fontFamily:"Montserrat", marginTop:10, fontSize:20, textDecorationLine:"underline"}}>{endHour}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible2}
                                mode="time"
                                locale={"en_GB"}
                                onConfirm={handleConfirm2}
                                onCancel={hideDatePicker2}
                            />
                            <TouchableHighlight
                                style={styles.buttonModal}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <Text style={{fontFamily:"Montserrat", fontSize:17}}>annuler</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                            style={styles.buttonModal2}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                createContracts(date, begHour, endHour)
                            }}
                        >
                            <Text style={{fontFamily:"Montserrat", fontSize:17}}>Créer le contrat</Text>
                        </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <View style={{flex:0.35, alignItems: "center", marginTop:"20%",}}>
                <ImageBackground source={{uri:image}}
                                 resizeMode={"contain"}
                                 style={{width:"100%", height:"100%", alignItems:"center",alignSelf:"center"}}
                                 imageStyle={{ width:"100%", height:"100%", borderRadius:20}}>
                    <TouchableOpacity style={{width:"30%", height:"30%", alignSelf:"flex-end", right:"0%"}} onPress={()=>{pickImage()}}>
                        <Image source={require("../assets/edit.png")} resizeMode={"contain"} style={{height:"60%", width:"60%"}}/>
                    </TouchableOpacity>
                </ImageBackground>
                    <Text style={{marginTop:"10%", fontFamily:"Montserrat", fontSize:25}}>"{restData.name}"</Text>
                </View>

                <View style={{flex:0.65}}>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15, marginLeft:"15%"}}>Propriétaire : {ownerData.name} {ownerData.surname}</Text>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15, marginLeft:"15%"}}>Adresse : {restData.address}</Text>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15, marginLeft:"15%"}}>Email : {restData.email}</Text>
                    <Text style={{fontFamily:"Montserrat", marginTop:"10%", fontSize:15, marginLeft:"15%"}}>Téléphone : {restData.phone}</Text>
                    {contract}
                    <TouchableOpacity style={styles.button} onPress={()=>setModalVisible(true)}>
                        <Text>Créer un contrat</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={()=>signout(navigation)}>
                        <Text>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>
                <View style={{}}>

                </View>
            </View>
        )
    }
    else {
        return (
            <AppLoading/>
        )
    }
}

function createContracts(date, hour1, hour2){
    firebase.firestore().collection("restos").doc(firebase.auth().currentUser.email).collection("contract").doc().set({
        beginningHour: hour1,
        date:date,
        endHour:hour2
    }).then(()=>{
        console.log("data uploaded")
    })

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
    button:{
        width:"60%",
        backgroundColor:"rgba(169,39,39,0.66)",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:30,
        fontFamily: "Montserrat-Bold",
        alignSelf:"center"
    },
    buttonModal:{
        width:"60%",
        backgroundColor:"rgba(169,39,39,0.66)",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:30,
        alignSelf:"center",
        position:"absolute",
        bottom:"17%"
    },
    buttonModal2:{
        width:"60%",
        backgroundColor:"rgba(93,186,26,0.66)",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:30,
        alignSelf:"center",
        position:"absolute",
        bottom:"5%"
    },
    modal: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        width:"80%",
        height:"70%",
        borderColor:"black",
        borderWidth: 3,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        }
    }
})
