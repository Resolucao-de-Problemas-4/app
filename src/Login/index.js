import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import axios from "axios";
import { StyleSheet, Text, View, TextInput, Alert, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Fmenu from "../Fmenu";

export default function LogIn({ navigation }) {
  

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
        <Button title="LogIn" color="#f194ff" onPress={() => navigation.navigate("Fmenu")} />
      </View>
    </View>
  );
}
