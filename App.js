import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/Home/";
import USignUp from "./src/SignUp/User";
import DSignUp from "./src/SignUp/Driver";
import ULogin from "./src/Login/User";
import DLogin from "./src/Login/Driver";
import IMenu from "./src/Fmenu/UMenu";
import DMenu from "./src/Fmenu/DMenu";
import CarUP from "./src/carMenu/";
import SMENU from "./src/Smenu/UMenu";
import DSMenu from './src/Smenu/DMenu'
import FinalRoute from './src/FinalRoute'
import RacesList from './src/Races/User/List'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="RacesList"
          component={RacesList}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Bem-vindo!" }}
        />
        <Stack.Screen
          name="ULogin"
          component={ULogin}
          options={{ title: "User LogIn" }}
        />
        <Stack.Screen
          name="DLogin"
          component={DLogin}
          options={{ title: "Driver LogIn" }}
        />
        <Stack.Screen
          name="USignUp"
          component={USignUp}
          options={{ title: "User SignUp" }}
        />
        <Stack.Screen
          name="DSignUp"
          component={DSignUp}
          options={{ title: "Driver SignUp" }}
        />
        <Stack.Screen
          name="UMenu"
          component={IMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DMenu"
          component={DMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CarUP"
          component={CarUP}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="USMenu"
          component={SMENU}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DSMenu"
          component={DSMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FinalRoute"
          component={FinalRoute}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
