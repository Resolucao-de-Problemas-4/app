import axios, { Axios } from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Modal, Alert, BackHandler } from "react-native";
import { RACE_SEARCH } from "../api/racesearch";
import { API_REST } from "../api/api";
import { PORT } from '../api/port';
import Map from "../Map";
import { tokenInfo } from "../token";

export default function Fmenu({ navigation }) {
  const deniedlist = [];

  const [idCorrida, setidCorrida] = useState(null);
  const [latitudeF, setlatitudeF ] = useState(null);
  const [longitudeF, setlongitudeF] = useState(null);

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

  function search(){
    axios
      .post(API_REST + "" + PORT + "" + RACE_SEARCH, {
        token:tokenInfo.token,
        "denied":deniedlist
      }).then(function(response){
        if(response.status === 200){

          setidCorrida(response.data.id)
          setlatitudeF(response.data.latitudeFinal)
          setlongitudeF(response.data.longitudeFinal)
        }
      })
    setModalV(!modalV)
  }

  function decline(){
    
    setModalV(!modalV)
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
          <Button title="Search Race" onPress={() => search()} color="#EEAD2D"/>
        </View>
      </View>

      <Modal transparent={true} visible={modalV}>
        <View style={{flex: 1, justifyContent: "flex-end"}}>
          <View style={styles.destiny}>
            <Text>
              Latitude: {latitudeF}
              Longitude: {longitudeF}
            </Text>
          </View>
          <View style={styles.buttonsModel}>
            <Button title="Aceitar" onPress={() => setModalV(!modalV)} color="#008000"/>
            <Button title="Recusar" onPress={() => decline()} color="#8B0000"/>
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
    textShadowColor:"black"
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
  destiny: {
    backgroundColor: "#ffffff",
    width:100

  }
});
