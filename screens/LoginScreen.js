import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoginScreen() {
    return (
        <View style={{flexDirection: "column", flex: 1}}>
            <View style={{flexDirection: "row", flex: 0.8}}>
                <View style={styles.left}>
                    <Text>Left login area</Text>
                </View>
                <View style={styles.right}>
                    <Text>Right login area</Text>
                </View>
            </View>
            <View style={styles.signup}>
                <Text>Signup Button</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    left: {
        flex: 1,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signup: {
        flex: 0.2,
        backgroundColor: "yellow",
        alignItems: 'center',
        justifyContent: 'center'
    }
});
