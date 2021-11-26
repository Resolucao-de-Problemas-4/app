import { StatusBar } from 'expo-status-bar';
import React, {useEffect}  from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Alert, BackHandler } from 'react-native';

export default function Fmenu({navigation}) {

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true);
      }, []);
    

    return (
        <View>
            <Text>Você entrou no meu sistema!!!</Text>
        </View>
    );
}

