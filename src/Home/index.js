import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Alert } from 'react-native';

export default function Home({navigation}) {

    

    return (
        <View>
            <View>
                <Button
                    title="Login"
                    color="#f194ff"
                    onPress={() => navigation.navigate("Login")}
                />
            </View>
            <View>
                <Button
                    title="Register"
                    color="#f194ff"
                    onPress={() => navigation.navigate("SignUp")}
                />
            </View>
        </View>
    );
}

