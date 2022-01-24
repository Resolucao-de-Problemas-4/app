import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import MapViewDirections from "react-native-maps-directions";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  Dimensions,
} from "react-native";
import { Alert, BackHandler } from "react-native";

import MapView from "react-native-maps";
import { tokenInfoCliente } from "../token";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import * as Location from "expo-location";
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { corridaData } from "../token/corrida";


let isReady = false;
let corridaEncontrada = false;
let destino = "";
let idCorrida = "";


export default function Fmenu({ navigation }) {
  const [modalV, setModalV] = useState(false);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const mapEl = useRef(null);

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  function acceptRace() {
    //se clica em confirmar corrida, ele faz isso.
    axios
      .post(API_REST + "" + PORT + "/api/race", {
        token: tokenInfoCliente.token,
        longitudeOrigem: JSON.stringify(origin.longitude),
        latitudeOrigem: JSON.stringify(origin.latitude),
        longitudeFinal: JSON.stringify(destination.longitude),
        latitudeFinal: JSON.stringify(destination.latitude),
        preco: price,
        destinoFinal: destino,
      })
      .then(function (response) {
        if (response.status === 200) {
          idCorrida = response.data.corridaID;
          console.log(idCorrida);
          isReady = true;
          setModalV(false);
          Alert.alert("Corrida criada 😁");
        }
      });
  }

  let count = 0;

  if (isReady) {
    //se a corrida foi confirmada, ele inicia a verificação de corrida aceita.
    var verificacaoCorrida = setInterval(function () {
      console.log(count++);
      verify();
    }, 1000);
  }

  function verify() {
    //verifica se a corrida foi encontrada
    axios
      .post(API_REST + "" + PORT + "/api/race-verify", {
        idCorrida,
      })
      .then(function (response) {
        if (response.status === 200) {
          isReady = false;
          clearInterval(verificacaoCorrida);
          Alert.alert("Um motorista aceitou a sua corrida! 🚗");
          const data = response.data;
          corridaData.motorista.name = data.motorista.name;
          corridaData.motorista.phoneNumber = data.motorista.phoneNumber;
          corridaData.motorista.email = data.motorista.email;
          corridaData.carro.plate = data.carro.plate;
          corridaData.carro.renavan = data.carro.renavan;
          corridaData.carro.year = data.carro.year;
          corridaData.carro.model = data.carro.model;
          corridaData.carro.marca = data.carro.marca;
          corridaData.user.email = data.user.email;
          corridaData.user.name = data.user.name;
          corridaData.corrida.idCorrida = data.corrida.id
          corridaData.corrida.latitudeFinal = data.corrida.latitudeFinal
          corridaData.corrida.longitudeFinal = data.corrida.longitudeFinal
          corridaData.corrida.longitudeInicial = data.corrida.longitudeOrigem
          corridaData.corrida.latitudeInicial = data.corrida.latitudeOrigem

          console.log(destination, origin)

          navigation.navigate("USMenu");
        }else if (response.status === 201){}
      }).catch(function (error) {
      });
  }

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

  function cancelarCorrida() {
    //caso o cliente não queira mais que a corrida seja aceita, ele pode cancelar
    if (idCorrida === "") {
      Alert.alert("Nenhuma corrida registrada.");
    } else {
      axios
        .post(API_REST + "" + PORT + "/api/race-cancel", {
          idCorrida,
        })
        .then(function (response) {
          if (response.status === 201) {
            Alert.alert("Corrida Cancelada...");
            isReady = false;
            clearInterval(verificacaoCorrida);
            idCorrida = "";
            opacity = 0;
            setDestination(null);
          } else if (response.status === 400) {
            Alert.alert("erro");
          }
        })
        .catch(function (error) {
          console.log(error.message);
        });
    }
  }

  function logout() {
    tokenInfoCliente.email = "";
    tokenInfoCliente.name = "";
    tokenInfoCliente.token = "";
    tokenInfoCliente.cnh = "";
    clearInterval(verificacaoCorrida);
    navigation.navigate("Home");
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

      <View style={{ top: "180%", width: "30%", left: "35%" }}>
        <Button title="cancelar" onPress={() => cancelarCorrida()} />
      </View>

      <View style={{ justifyContent: "flex-start" }}>
        <View style={{ margin: 120, padding: 50, right: 160, bottom: 120 }}>
          <Button title="logout" onPress={() => logout()} />
        </View>
      </View>

      <View style={{ flex: 1, bottom: 200, position: 'absolute', width: '75%', left: 50 }}>
        <GooglePlacesAutocomplete
          minLength={5}
          placeholder="Para onde vamos?"

          onPress={(data, details = null) => {

            destino = details.formatted_address;
            // const detailsZ = details.address_components;
            // detailsZ.forEach(element => {
            //   if (element.types[0] === 'administrative_area_level_1') {
            //     console.log(element.short_name)
            //   }
            // });
            setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00621,
            });


          }}
          query={{
            key: "AIzaSyD1u6IQERI6G3w8MhnvzPzh4NZSen9KO_U",
            language: "pt-br",
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          styles={{
            listView: styles.listView,
            keyboardShouldPersistTaps: "handled",
          }}
        />
      </View>

      {distance && (
        <View style={{ width: "100%" }}>
          <Modal
            transparent={true}
            visible={modalV}
            style={{ backgroundColor: "rgba(198, 198, 198, 0.57)" }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                width: "50%",
                alignContent: "center",
                left: "25%",
                top: "25%",
              }}
            >
              <View>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={styles.corridaText}>{distance}M</Text>
                  <Text style={styles.corridaText}>{price}R$</Text>
                </View>
                <Button
                  title="Confirmar Corrida"
                  onPress={() => {
                    if (isReady === true) {
                      Alert.alert("Já há uma corrida!");
                      setModalV(!modalV);
                    } else {
                      acceptRace();
                    }
                  }}
                  color="#008000"
                />
                <Button
                  title="Ainda não..."
                  onPress={() => {
                    setModalV(false)
                    setDestination('')
                    setPrice('')
                    setDistance('')
                  }}
                  color="#8B0000"
                />
              </View>
            </View>
          </Modal>
        </View>
      )}
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
  listView: {
    position: "absolute",
    top: 40,
    borderColor: "gray",

    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  corridaText: {
    color: "black",
    fontWeight: "bold",
  },
});
