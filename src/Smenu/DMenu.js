import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import MapViewDirections from "react-native-maps-directions";
import { Ionicons } from '@expo/vector-icons';
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

import MapView, { Marker } from "react-native-maps";
import { tokenInfoCliente, tokenInfoMotorista } from "../token";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import * as Location from "expo-location";
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { corridaData } from "../token/corrida";

export default function DSMenu({ navigation }) {
  const mapEl = useRef(null);
  const [idCorrida, setIdCorrida] = useState(null);
  const [driverOrigin, setDriverOrigin] = useState(null);
  const [userOrigin, setUserOrigin] = useState(null);
  const [isReady, setIsReady] = useState(true)

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

      var location = await Location.getCurrentPositionAsync({ timeInterval: 1000, distanceInterval: 3 });

      setDriverOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00621,
      });

      setUserOrigin({
        latitude: Number(corridaData.corrida.latitudeInicial),
        longitude: Number(corridaData.corrida.longitudeInicial),
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00621,
      });


    })();
  }, []);

  function changeRoute() {
    setIsReady(false)
    axios.post(API_REST + '' + PORT + '/api/localization-route-change', { token: tokenInfoMotorista.token }).then(function (response){
      console.log('info sent.')
    })
    setTimeout(() => {

    }, 1000);
    navigation.navigate('FinalRoute');
  }

  return (
    <View>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={driverOrigin}
          showsUserLocation={true}
          loadingEnabled={true}
          onUserLocationChange={(e) => {

            setDriverOrigin({
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00621,
            })

            axios.post(API_REST + '' + PORT + '/api/localization-update', {
              token: tokenInfoMotorista.token,
              lat: JSON.parse(e.nativeEvent.coordinate.latitude),
              long: JSON.parse(e.nativeEvent.coordinate.longitude)
            }).then(function (response) {

            }).catch(function (error) {
              console.log(error)
            })

          }}
          ref={mapEl}
        >
          <MapViewDirections
            lineDashPattern={[1]}
            origin={driverOrigin}
            destination={userOrigin}
            apikey={"AIzaSyD1u6IQERI6G3w8MhnvzPzh4NZSen9KO_U"}
            strokeWidth={3}

            strokeColor="purple"
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
          {userOrigin && (<Marker
            coordinate={{ latitude: userOrigin.latitude, longitude: userOrigin.longitude }}
            pinColor={"purple"}
            title={"Partida"}
            description={"Eu estou aqui!!"}

          />)}

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
          <Text style={{ fontWeight: "bold" }}>
            Passageiro: {corridaData.user.name}
          </Text>
        </View>
      </View>


      <View style={{ position: 'absolute', flex: 1, left: '40%', top: 600, }}>
        <Ionicons name="md-checkmark-circle" size={64} color="green" onPress={() => changeRoute()} />
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
