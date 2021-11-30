import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './src/Home/'
import USignUp from './src/SignUp/User';
import DSignUp from './src/SignUp/Driver'
import ULogin from './src/Login/User'
import DLogin from './src/Login/Driver'
import Fmenu from './src/Fmenu';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="Home" component={Home} options={{ title: "Bem-vindo!"}} />
        <Stack.Screen name="USer" component={ULogin} options={{ title: "User LogIn"}} />
        <Stack.Screen name="DLogin" component={DLogin} options={{ title: "Driver LogIn"}}/>
        <Stack.Screen name="USignUp" component={USignUp} options={{ title: "User SignUp"}}/>
        <Stack.Screen name="DSignUp" component={DSignUp} options={{ title: "Driver SignUp"}}/>
        <Stack.Screen name="Fmenu" component={Fmenu} options={{headerShown: false}} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}

