import React, {useState, useEffect} from 'react';
import { StyleSheet, Text  } from 'react-native';
import * as Font from "expo-font";
import AppLoading from "expo/build/launch/AppLoading";


let customFonts = {"Montserrat": require("../assets/fonts/Montserrat-Regular.ttf")}

Font.loadAsync(customFonts).then(function (){
})
const CustomText = props => <Text style={styles.text}>{props.children}</Text>

export default CustomText



const styles = StyleSheet.create({
    text: {
        fontFamily: 'Montserrat',
    }
});
