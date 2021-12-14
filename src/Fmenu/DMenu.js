import axios, { Axios } from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
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
import { RACE_UPDATE } from "../api/raceupdate";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { tokenInfoMotorista } from "../token";
import MapViewDirections from "react-native-maps-directions";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { corridaData } from "../token/corrida";
let deniedlist = [];

export default function Fmenu({ navigation }) {
  const [idCorrida, setidCorrida] = useState(null);
  const [latitudeF, setlatitudeF] = useState(null);
  const [longitudeF, setlongitudeF] = useState(null);
  const [updateRaceBox, setupdateRaceBox] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [corridaAceita, setcorridaAceita] = useState(false);
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
          setEndereco(response.data.destinoFinal);

          setupdateRaceBox(true);
        } else if (response.status === 201) {
          Alert.alert("Nenhuma corrida no momento... 🤯🚗");
          deniedlist = [];
          setupdateRaceBox(false);
        }
      })
      .catch(function (error) {
        Alert.alert("Nenhuma corrida no momento... 🤯🚗\n" + error.message);
      });
  }

  function accept() {
    axios
      .post(API_REST + "" + PORT + "" + RACE_UPDATE, {
        token: tokenInfoMotorista.token,
        corridaID: idCorrida,
      })
      .then(function (response) {
        if (response.status === 200) {
          setcorridaAceita(true);
          Alert.alert("Corrida foi aceita! 😎🧐✌️");

          axios
            .post(API_REST + "" + PORT + "" + "/api/race-verify", {
              idCorrida,
            })
            .then(function (response) {
              const data = response.data;

              corridaData.motorista.phoneNumber = data.motorista.phoneNumber;
              corridaData.motorista.email = data.motorista.email;
              corridaData.motorista.name = data.motorista.name
              corridaData.carro.plate = data.carro.plate;
              corridaData.carro.renavan = data.carro.renavan;
              corridaData.carro.year = data.carro.year;
              corridaData.carro.model = data.carro.model;
              corridaData.carro.marca = data.carro.marca;
              corridaData.user.email = data.user.email;
              corridaData.user.name = data.user.name;
              corridaData.corrida.idCorrida = data.corrida.id;
              corridaData.corrida.latitudeFinal = data.corrida.latitudeFinal;
              corridaData.corrida.longitudeFinal = data.corrida.longitudeFinal;
              corridaData.corrida.longitudeInicial = data.corrida.longitudeOrigem;
              corridaData.corrida.latitudeInicial = data.corrida.latitudeOrigem;
            });

          navigation.navigate("DSMenu");
        } else if (response.status === 400) {
          alert.Alert(response.data.message);
        }
      });

    setupdateRaceBox(false);
  }

  function decline() {
    deniedlist.push({ corridaID: idCorrida });

    corridaData.motorista.phoneNumber = "";
    corridaData.motorista.email = "";
    corridaData.carro.plate = "";
    corridaData.carro.renavan = "";
    corridaData.carro.year = "";
    corridaData.carro.model = "";
    corridaData.carro.marca = "";
    corridaData.user.email = "";
    corridaData.user.name = "";
    corridaData.corrida.idCorrida = "";
    corridaData.corrida.latitudeFinal = "";
    corridaData.corrida.longitudeFinal = "";
    corridaData.corrida.longitudeInicial = "";
    corridaData.corrida.latitudeInicial = "";

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
        <View style={{ left: "50%", top: "180%", width: "30%" }}>
          <Button title="logout" onPress={() => logout()} />
        </View>
      </View>

      <View style={{ justifyContent: "center" }}>
        <View style={{ left: "76%", top: "500%", width: "20%" }}>
          <Button
            title="Search Race"
            onPress={() => search()}
            color="#EEAD2D"
          />
        </View>
      </View>

      <Modal transparent={true} visible={updateRaceBox}>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <View style={styles.destiny}>
            <Text> Destino: {endereco} </Text>
          </View>
          <View style={styles.buttonsAcceptDecline}>
            <Button title="Aceitar" onPress={() => accept()} />
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
    textShadowColor: "black",
  },
  buttonsAcceptDecline: {
    backgroundColor: "#ffffff",
    padding: "3%",
    borderRadius: 5,
    left: "20%",
    bottom: "4%",
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
    bottom: "2%",
    left: "42%",
    borderRadius: 5,
  },
  container: {
    paddingTop: "14%",
    position: "absolute",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
