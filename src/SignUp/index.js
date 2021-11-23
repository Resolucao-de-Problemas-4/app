
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';


export default function SignUp() {
    return (
        <View>
            <View>
                <Text>Username</Text>
                <TextInput placeholder="Choose a Username"/>
            </View>
            <View>
                <Text>Password</Text>
                <TextInput placeholder="Choose a Password"></TextInput>
            </View>
            <View>
                <Text>E-Mail</Text>
                <TextInput placeholder="Type ur e-mail"/>
            </View>      
            <View>
                <Button
                    title="SignUp"
                    color="#f194ff"
                    onPress={() => Alert.alert("rsrs")}
                />
            </View>
            
        </View>
    );
}