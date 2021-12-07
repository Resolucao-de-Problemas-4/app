import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Alert, BackHandler } from "react-native";
import Map from "../Map";
import { tokenInfo } from "../token";

export default function Fmenu({ navigation }) {
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  function logout(){
    tokenInfo.email=''
    tokenInfo.name=''
    tokenInfo.token = ''
    console.log(tokenInfo)
    navigation.navigate("Home")
  }

  return (
    <View>
      <Map />
      <View>
        <Button title="logout" onPress={()=>logout()}/>
      </View>
    </View>
  );
}
