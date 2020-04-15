import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import firebase from "../configs/Firebase"
import SignupWaiter from "./SignupWaiter";


export default function SignupScreen({navigation}) {

    const [loaded, setLoaded] = useState(false);
    const [urlLeft, setUrlLeft] = useState("");
    const [urlRight, setUrlRight] = useState("");

    const refLeft = firebase.storage().ref("/vieux.png");
    const refRight = firebase.storage().ref("/serveur.png");
    refLeft.getDownloadURL().then(function(result){
        setUrlLeft(result);
        refRight.getDownloadURL().then(function (result2) {
            setUrlRight(result2);
            setLoaded(true);
        });
    });

    if(loaded) {
        return (
            <View style={{flexDirection: "column", flex: 1}}>
                <View style={styles.title}>
                    <Text style={styles.title}>Bienvenue sur ExtraGE,</Text>
                    <Text style={styles.title}>Qui est tu ?</Text>
                </View>
                <View style={{flexDirection: "row", flex: 0.8}}>
                    <View style={styles.left}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", fontFamily: "sans-serif", paddingBottom:40}}>
                            Je suis propriétaire
                        </Text>
                            <Image source={{uri: urlLeft}} style={styles.imageLeft}/>

                    </View>
                    <View style={styles.right}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white", fontFamily: "sans-serif", paddingBottom:40}}>
                            Je suis serveur
                        </Text>
                        <TouchableOpacity onPress={()=> navigation.navigate("SignupWaiter")}>
                        <Image source={{uri: urlRight}} style={styles.imageRight}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.signup}>
                    <Text style={{ fontSize: 20, textDecorationLine: "underline", color: "white", fontFamily: "sans-serif"}}>
                        J'ai déjà un compte
                    </Text>
                </View>
            </View>
        );
    }
    else{
        return(
            <Text>Loading</Text>
        )
    }
}
const styles = StyleSheet.create({
    left: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,

        elevation: 13,
    },
    right: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e",
        borderRightWidth: 1,
        borderRightColor: "black",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,

    },
    signup: {
        flex: 0.15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e"
    },
    imageLeft: {
        width: 120,
        height: 300
    },
    imageRight: {
        width: 200,
        height: 300
    },
    title: {
        flex: 0.30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#a8323e",
        fontSize: 30,
        fontWeight: "bold",
        color: "white",
        fontFamily: "sans-serif",
    }
});
