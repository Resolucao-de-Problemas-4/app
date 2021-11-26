import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './src/Home/'
import SignUp from './src/SignUp/'
import Login from './src/Login/'
import Fmenu from './src/Fmenu';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Home" component={Home} options={{ title: "Bem-vindo!"}} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Fmenu" component={Fmenu} options={{headerShown: false}} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

