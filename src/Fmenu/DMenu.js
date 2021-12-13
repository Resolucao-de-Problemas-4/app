import axios, { Axios } from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState,useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  Alert,
  BackHandler,
  Dimensions,
} from "react-native";
import { RACE_SEARCH } from "../api/racesearch";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { tokenInfoMotorista } from "../token";
import MapViewDirections from "react-native-maps-directions";
import MapView from "react-native-maps";
import * as Location from 'expo-location'
let deniedlist = [];

export default function Fmenu({ navigation }) {
  const [idCorrida, setidCorrida] = useState(null);
  const [latitudeF, setlatitudeF] = useState(null);
  const [longitudeF, setlongitudeF] = useState(null);
  const [modalV, setModalV] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const mapEl = useRef(null);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  useEffect(() => {
    //pede a localização do usuário.
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});

      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00621,
      });
    })();
  }, []);

  function logout() {
    tokenInfoMotorista.email = "";
    tokenInfoMotorista.name = "";
    tokenInfoMotorista.token = "";
    tokenInfoMotorista.cnh = "";

    navigation.navigate("Home");
  }

  function search() {
    axios
      .post(API_REST + "" + PORT + "" + RACE_SEARCH, {
        token: tokenInfoMotorista.token,
        denied: deniedlist,
      })
      .then(function (response) {
        if (response.status === 200) {
          setidCorrida(response.data.id);
          setlatitudeF(response.data.latitudeFinal);
          setlongitudeF(response.data.longitudeFinal);
          setModalV(true);
        } else if (response.status === 201) {
          Alert.alert("Nenhuma corrida no momento...");
          deniedlist = [];
          setModalV(false);
        }
      });
  }

  function decline() {
    deniedlist.push({ corridaID: idCorrida });
    // console.log(JSON.stringify(deniedlist)) print no console da lista de corridas recusadas
    search();
  }

  return (
    <View>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={origin}
          showsUserLocation={true}
          loadingEnabled={true}
          ref={mapEl}
        >
          <MapViewDirections
            lineDashPattern={[1]}
            origin={origin}
            destination={destination}
            apikey={"AIzaSyD1u6IQERI6G3w8MhnvzPzh4NZSen9KO_U"}
            strokeWidth={3}
            strokeColor="black"
            onReady={(result) => {
              setDistance(result.distance);
              setPrice((result.distance * 2.6).toFixed(2));
              setModalV(!modalV);
              mapEl.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 50,
                  bottom: 50,
                  left: 50,
                  right: 50,
                },
              });
            }}
          />
        </MapView>
      </View>
      {/* <Text style={styles.title}>driverName</Text> */}
      <View style={{ justifyContent: "flex-start" }}>
        <View style={{ margin: 80, padding: 50, left: 120, bottom: 120 }}>
          <Button title="logout" onPress={() => logout()} />
        </View>
      </View>

      <View style={{ justifyContent: "center" }}>
        <View
          style={{ margin: 80, padding: 55, flex: 0, left: 120, bottom: 200 }}
        >
          <Button
            title="Search Race"
            onPress={() => search()}
            color="#EEAD2D"
          />
        </View>
      </View>

      <Modal transparent={true} visible={modalV}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={styles.destiny}>
            <Text> Destination </Text>
            <Text> ID: {idCorrida}</Text>
            <Text> </Text>
            <Text>
              {" "}
              {latitudeF}, {longitudeF}
            </Text>
          </View>
          <View style={styles.buttonsModel}>
            <Button
              title="Aceitar"
              onPress={() => setModalV(false)}
              color="#008000"
            />
            <Button title="Recusar" onPress={() => decline()} color="#8B0000" />
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
    textShadowColor: "black",
  },
  buttonsModel: {
    backgroundColor: "#ffffff",
    padding: 7,
    borderRadius: 5,
    left: 155,
    top: -15,
    width: "53%",
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
    width: "53%",
    top: -15,
    left: 155,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    position: "absolute",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
