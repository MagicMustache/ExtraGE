import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    Modal,
    ImageBackground,
    KeyboardAvoidingView, Platform, ScrollView, Dimensions
} from 'react-native';
import * as Font from 'expo-font';
import {AppLoading} from "expo";
import firebase from "../configs/Firebase";
import isEmpty from "react-native-web/dist/vendor/react-native/isEmpty";
import * as ImagePicker from "expo-image-picker"
import {getCameraPermissionsAsync} from "expo-image-picker";
import * as Constants from "expo-constants";

let customFonts = {
    "Montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf")
}
async function getPermissions() {
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }
}



export default function WaiterMain({route, navigation, visible}) {
    const [fontLoaded, setFontsLoaded] = useState(false);
    const [data, setData] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [user, setUser] = useState({});
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [modalVisible, setModalVisible] = useState(true);
    const [image, setImage] = useState(undefined);
    const [index, setIndex] = useState(0);
    const [phone, setPhone] = useState("");
    const [exp, setExp] = useState([]);
    const [months, setMonths] = useState([]);
    const [month, setMonth] = useState("");
    const [restNames, setRestNames] = useState([]);
    const [restName, setRestName] = useState("");



    //TODO add modified infos to firebase
    Font.loadAsync(customFonts).then(function (){
        setFontsLoaded(true);
    })

    async function pickImage() {
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
               upload(result.uri).then(()=>console.log("image uploaded"))
            }

            console.log(result);
        } catch (e) {
            console.log(e)
        }
    }

    async function upload(uri){
        const resp = await fetch(uri);
        const blob = await resp.blob();
        let ref = firebase.storage().ref().child(user.email);
        return ref.put(blob);
    }

    function endEditingMonths() {
        setMonths(months => [...months, month])
    }
    function endEditingNames() {
        setRestNames(restNames => [...restNames, restName])
    }

    useEffect(()=>{
        setModal(visible);
        updateData().then(()=>{
            console.log("data updated...")
        })
    },[])

    async function updateData(){
        let currentUser = firebase.auth().currentUser
        if (currentUser) {

            setUser(currentUser);
            getPermissions().then(console.log("permission granted"))

            console.log(currentUser.email)
            firebase.storage().ref("/"+currentUser.email).getDownloadURL().then((result)=>{
                setImage(result);
            }).catch((e)=>{
                console.log(e);
                firebase.storage().ref("/placeholder.png").getDownloadURL().then((result2)=>{
                    setImage(result2)
                })
            })
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
            console.log("no user", user);
        }
    }

    if(isEmpty(user)){
        firebase.auth().onAuthStateChanged(function (user) {
            if(user){
                setUser(user);
                console.log(user.email)
                let docRef = firebase.firestore().collection("users").doc(user.email);
                docRef.get().then(function (doc) {
                    if(doc.exists){
                        console.log(doc.data());
                        setData(doc.data());
                    }
                    else{
                        console.log("no data2")
                    }
                })
            }
            else{
                console.log("no user2")
            }
        })
    }

    function sendData(phone=data.phone, length=[], name=[]){
        let exp = [];
        for(let i=0;i<length.length;i++){
            exp.push({length:length[i], name:name[i]});
        }
        console.log("yayayaya ", exp, restNames)
        if(data.experience){
            exp = data.experience.concat(exp)
        }
        if(phone === ""){phone=data.phone}
        firebase.firestore().collection("users").doc(user.email).set({
            phone:phone,
            experience: exp
        }, {merge:true}).then(()=>{
            setModal(false);
            setModal2(false);
            console.log("profile data updated...")
            updateData().then(()=>{
                console.log("data updated...")

            });
        })
    }


    if(fontLoaded&&data&&!modal&&!modal2&&image!==undefined) {
        firebase.storage().ref("/"+user.email).getDownloadURL().then((result)=>{
            if(image!==result){
                setImage(result);

            }
        })
        return (
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#c14752"}}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                               source={{uri:image}}/>

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
                            <TouchableOpacity onPress={()=>setModal2(true)}>
                            <Image style={styles.icon} source={require("../assets/tools.png")}/>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.infoContent}>
                            <TouchableOpacity onPress={()=>setModal2(true)}>
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
    else if(modal&&data&&fontLoaded&&!modal2&&image!==undefined){
        firebase.storage().ref("/"+user.email).getDownloadURL().then((result)=>{
            if(result !== image){
                setImage(result);
            }
        })
        let expArray;
        console.log("exp", data.experience)
        if(data.experience){
            expArray = data.experience.map(info=>(

                <Text style={styles.modalText}>{info.length} mois chez "{info.name}"</Text>

            ))
        }
    else{
        expArray=(<Text style={styles.modalText}>aucune experience</Text>)
        }
        let parts = data.birthdate.split("-");
        let myDate = new Date(parts[0], parts[1]-1, parts[2]);
        let age = (Math.abs(new Date(Date.now() - myDate.getTime()).getUTCFullYear()-1970))
        return(
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#c14752"}}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                               source={{uri:image}}/>

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
                                    <ImageBackground
                                        source={{uri:image}}
                                        resizeMode={"contain"} style={{width:"50%", height:"20%", marginBottom:20, alignSelf:"center"}} imageStyle={{width:"100%", height:"100%",borderRadius:70}}/>
                                    <Text style={styles.modalText}>{data.name} {data.surname}</Text>
                                    <Text style={styles.modalText}>{user.email}</Text>
                                    <Text style={styles.modalText}>{age} ans</Text>
                                    <Text style={styles.modalText}>{data.phone}</Text>
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
                </View>

            </SafeAreaView>
        )

    }
    else if(!modal&&data&&fontLoaded&&modal2&&image!==undefined){
        firebase.storage().ref("/"+user.email).getDownloadURL().then((result)=>{
            if(image!==result){
                setImage(result);

            }
        })


        let expEmptyArray = [];

        for(let i= 0;i<=index;i++){
                expEmptyArray.push(<View style={{flexDirection: "row", width:"100%"}}><TextInput style={styles.modalText} placeholder={"1"} keyboardType={"number-pad"} onChangeText={(text)=>{setMonth(text)}} onEndEditing={()=>{endEditingMonths()}}/><Text style={styles.modalText}>mois chez </Text><TextInput style={styles.inputText} placeholder={"restaurant"} onChangeText={(text)=>{setRestName(text)}} onEndEditing={()=>{endEditingNames()}}/></View>)
        }

        let parts = data.birthdate.split("-");
        let myDate = new Date(parts[0], parts[1]-1, parts[2]);
        let age = (Math.abs(new Date(Date.now() - myDate.getTime()).getUTCFullYear()-1970))
        return(
            <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:"#c14752"}}>
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <Image style={styles.avatar}
                               source={{uri:image}}/>

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
                        <KeyboardAvoidingView style={{flex:1}}>
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
                                        resizeMode={"contain"} style={{width:"50%", height:"20%", marginBottom:20, alignSelf:"center"}} imageStyle={{width:"100%", height:"100%",borderRadius: 100}}>
                                        <TouchableOpacity style={{width:"30%", height:"30%", alignSelf:"flex-end", right:"-10%"}} onPress={()=>{pickImage()}}>
                                        <Image source={require("../assets/edit.png")} resizeMode={"contain"} style={{height:"60%", width:"60%"}}/>
                                        </TouchableOpacity>
                                    </ImageBackground>
                                    <Text style={styles.modalText}>{data.name} {data.surname}</Text>
                                    <Text style={styles.modalText}>{user.email}</Text>
                                    <Text style={styles.modalText}>{age} ans</Text>
                                    <TextInput style={styles.modalText} placeholder={data.phone} keyboardType={"phone-pad"} onChangeText={(text)=>{setPhone(text)}}/>
                                    <View
                                        style={{backgroundColor: '#A2A2A2',
                                            height: 2,
                                            width: 165}}>
                                    </View>
                                    <View style={{flexDirection: "row", height:"10%"}}>
                                    <Text style={styles.modalText}>{"\n"}Expériences :</Text>
                                    <TouchableOpacity style={{width:"15%",height:"40%", marginBottom:15, justifyContent:"center", marginTop:20}} onPress={()=>{setIndex(index+1)}}>
                                    <Image source={require("../assets/add.png")} resizeMode={"contain"} style={{width:"100%"}}/>
                                    </TouchableOpacity>
                                    </View>
                                    <ScrollView>

                                    {expEmptyArray}
                                    </ScrollView>
                                    <TouchableOpacity
                                        style={{...styles.openButton, backgroundColor: "rgba(141,23,22,0.58)", marginTop: 20, position:"absolute", bottom:"5%"}}
                                        onPress={() => {
                                            setIndex(0)
                                            setModal2(false);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Retour</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{...styles.openButton, backgroundColor: "rgba(49,179,20,0.58)", marginTop: 20, marginBottom:10, position:"absolute", bottom:"13%"}}
                                        onPress={()=>{sendData(phone, months, restNames)}}
                                    >
                                        <Text style={styles.textStyle}>Appliquer</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        </KeyboardAvoidingView>
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
    avatar2: {
        width: 200,
        height: 200,
        borderWidth: 4,
        borderColor: "red",
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
        height: "95%",
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
        elevation: 5,
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

    },
    inputText:{
        marginBottom: 15,
        textAlign: "center",
        fontFamily: "Montserrat",
        fontSize: 20,
        width:"50%"

    }
});
