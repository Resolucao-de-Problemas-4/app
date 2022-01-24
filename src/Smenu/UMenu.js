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
let isReady = true;

export default function USMENU({ navigation }) {
  const mapEl = useRef(null);
  const [idCorrida, setIdCorrida] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);



    if (isReady) {
      //se a corrida foi confirmada, ele inicia a verificação de corrida aceita.
      var verificacaoCorrida = setInterval(function () {
        verify();
      }, 2000);
    }
  

  function verify() {
    axios
      .post(API_REST + "" + PORT + "/api/race-verify-finish", {
        idCorrida,
      }).then(function (response){
        if(response.status === 200){
          isReady = false;
          navigation.navigate("UMenu")
        }
      }).catch(function (error){});
      
  }


  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    setIdCorrida(corridaData.corrida.idCorrida);
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

      setDestination({
        latitude: corridaData.corrida.latitudeFinal,
        longitude: corridaData.corrida.longitudeFinal,
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
            navigation.navigate("UMenu");
          } else if (response.status === 400) {
            Alert.alert("erro");
          }
        })
        .catch(function (error) {
        });
    }
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

        <View
          style={{
            position: "absolute",
            bottom: "5%",
            borderColor: "black",
            borderWidth: 3,
            backgroundColor: "rgba(2, 2, 2, 0.35)",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",

            height: "15%",
            width: "75%",
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>Motorista: {corridaData.motorista.name}</Text>
          <Text style={{ fontWeight: 'bold' }}>Modelo do carro:{corridaData.carro.model}</Text>
          <Text style={{ fontWeight: 'bold' }}>Marca do carro:{corridaData.carro.marca}</Text>
          <Text style={{ fontWeight: 'bold' }}>Placa do Carro:{corridaData.carro.plate}</Text>

        </View>
      </View>

      <View style={{ top: "180%", width: "30%", left: "35%" }}>
        <Button title="cancelar" onPress={() => cancelarCorrida()} />
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
