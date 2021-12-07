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


  function logout(){
    tokenInfo.email=''
    tokenInfo.name=''
    tokenInfo.token = ''
    
    navigation.navigate("Home")
  }

  return (
    <View>
      <Map />
      {/* <Text style={styles.title}>driverName</Text> */}
      <View style={{flex: 0, justifyContent: "flex-start"}}>
        <View style={{margin: 80,padding: 50,flex: 0,left: 120,bottom:120}}>
          <Button title="logout" onPress={() => logout()} />
        </View>
      </View>

      <View style={{ justifyContent: "center" }}>
        <View style={{ margin: 80,padding:55,flex: 0,left: 120,bottom:200 }}>
          <Button title="Search Race" onPress={() => setModalV(!modalV)} color="#EEAD2D"/>
        </View>
      </View>

      <Modal transparent={true} visible={modalV}>
        <View style={{flex: 1, justifyContent: "flex-end"}}>
          <View style={styles.buttonsModel}>
            <Button title="Aceitar" onPress={() => setModalV(!modalV)} color="#008000"/>
            <Button title="Recusar" onPress={() => setModalV(!modalV)} color="#8B0000"/>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  buttonsModel: {
    backgroundColor: "#ffffff",
    margin: 70,
    padding: 23,
    borderRadius: 20,
    flex: 0,
    left: 50,
    top: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
