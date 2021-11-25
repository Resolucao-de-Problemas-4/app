import { StatusBar } from 'expo-status-bar';
import React,{useEffect} from 'react';
import axios from 'axios'
import { StyleSheet, Text, View, TextInput, Alert, Button } from 'react-native';

export default function LogIn() {

    useEffect(() => {
        axios.get('http://192.168.0.110:3030/api/users').then(function (response) {
            const lista = response.data;

            console.log(response.data)
        })
    });

    return (
        <View>
            <View>
                <Text>LogIn</Text>
                <TextInput placeholder="LogIn" />
            </View>
            <View>
                <Text>Password</Text>
                <TextInput placeholder="Password" />
            </View>
            <View>
                <Button
                    title="LogIn"
                    color="#f194ff"
                    onPress={() => {}}
                />
            </View>
        </View>
    );
}