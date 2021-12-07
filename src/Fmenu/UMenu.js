import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Modal } from "react-native";
import { Alert, BackHandler } from "react-native";
import Map from "../Map";

export default function Fmenu({ navigation }) {
  const [modalV, setModalV] = useState(false);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

<<<<<<< Updated upstream
=======
function logout(){
  tokenInfo.email=''
  tokenInfo.name=''
  tokenInfo.token = ''

  navigation.navigate("Home")
}
  
>>>>>>> Stashed changes
  return (
    <View>
      <Map />
      {/* <Text style={styles.title}>driverName</Text> */}
      <View style={{ flex: 0, justifyContent: "flex-start" }}>
        <View style={{margin: 80,padding: 50,flex: 0,left: 120,bottom:120}}>
<<<<<<< Updated upstream
          <Button title="logout" onPress={() => navigation.navigate("Home")} />
=======
          <Button title="logout" onPress={() => logout} />
>>>>>>> Stashed changes
        </View>
      </View>

      <View style={{ flex:0, justifyContent: "flex-start" }}>
        <View style={{ margin: 80,padding:50,flex: 0,right:100,bottom:370 }}>
          <TextInput style={styles.fieldInput}/>
        </View>
      </View>

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
    color:"black",
    backgroundColor: "#D3D3D3",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    textAlign: "center",
    height: 35,
    width: 300,
    marginTop: 3,
    marginBottom: 5,
  },
});
