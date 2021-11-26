import { StatusBar } from 'expo-status-bar';
import React, {useEffect}  from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Alert, BackHandler } from 'react-native';
import Map from '../Map';

export default function Fmenu({navigation}) {

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', () => true);
      }, []);
    

    return (
        <View>
            <Map/>
        </View>
    );
}

