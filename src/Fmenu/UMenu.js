import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Modal, Dimensions } from "react-native";
import { Alert, BackHandler } from "react-native";
import Map from "../Map";
import { tokenInfo } from "../token";

export default function Fmenu({ navigation }) {
  const [modalV, setModalV] = useState(false);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

function logout(){
  tokenInfo.email=''
  tokenInfo.name=''
  tokenInfo.token = ''
  tokenInfo.cnh = ''
  navigation.navigate("Home")
}
  
  return (
    <View>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={origin}
          showsUserLocation={true}
          loadingEnabled={true}
        />
      </View>
      {/* <Text style={styles.title}>driverName</Text> */}
      <View style={{ flex: 0, justifyContent: "flex-start" }}>
        <View style={{margin: 80,padding: 50,flex: 0,left: 120,bottom:120}}>
          <Button title="logout" onPress={() => logout()} />
        </View>
      </View>

      <View style={styles.fieldInput}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fieldInput: {
    position: "relative",
    color: "black",
    borderColor: "grey",
    borderWidth: 5,
    borderTopWidth: 5,
    borderBottomWidth: 50,
    borderRadius: 10,
    width: "94%",
    left: 10,
    bottom: 230,
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
