import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button } from 'react-native';

export default function LogIn() {
    return (
        <View>
            <View>
                <Text>LogIn</Text>
                <TextInput placeholder="LogIn"/>
            </View>
            <View>
                <Text>Password</Text>
                <TextInput placeholder="Password"/>
            </View>
            <View>
                <Button
                    title="LogIn"
                    color="#f194ff"
                    onPress={() => Alert.alert("rsrs")}
                />
            </View>
        </View>
    );
}