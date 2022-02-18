import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import MapViewDirections from "react-native-maps-directions";
import {
  StyleSheet,
  Text,
  View,
  Dimensions, Image
} from "react-native";
import { Alert, BackHandler } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { corridaData } from "../token/corrida";
import { tokenInfoCliente } from '../token/index'

export default function USMENU({ navigation }) {
  const [isReady, setIsReady] = useState(true)
  const mapEl = useRef(null);
  const [idCorrida, setIdCorrida] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [time, setTime] = useState()
  const [position, setPosition] = useState()
  const [localization, setLocalization] = useState()
  const [counter, setCounter] = useState(0)
  const [pin, setPin] = useState(false)

  function intervalTIME() {
    if (time === null || time === undefined) {
      setTime(setInterval(function () {
        if (isReady === false) {
          setTime(clearInterval(time))
        }
        verify()
      }, 1000))
    }
  }

  function intervalTIMEZ() {
    if (position === null || position === undefined) {
      setPosition(setInterval(function () {
        if (isReady === false) {
          setPosition(clearInterval(position))
        }
        getPos()
      }, 2000))
    }
  }

  function getPos() {
    axios
      .post(API_REST + "" + PORT + "/api/localization", {
        token: tokenInfoCliente.token,
      }).then(function (response) {

        // setPosition({
        //   latitude: response.data.lat,
        //   longitude: response.data.long
        // })
        setLocalization({
          latitude: response.data.lat,
          longitude: response.data.long
        })
        if (counter === 0 && response.data.route === 1) {
          setDestination({
            latitude: localization.latitude,
            longitude: localization.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00621,
          })
        }

        if (counter === 0 && response.data.route === 2) {
          setDestination({
            latitude: Number(corridaData.corrida.latitudeFinal),
            longitude: Number(corridaData.corrida.longitudeFinal),
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00621,
          })
          setPin(true)
          setCounter(counter++)
        }

      }).catch(function (error) { });
  }



  function verify() {

    axios
      .post(API_REST + "" + PORT + "/api/race-verify-finish", {
        idCorrida: corridaData.corrida.idCorrida,
      }).then(function (response) {
        setIsReady(false)


        corridaData.motorista.name = ''
        corridaData.motorista.phoneNumber = ''
        corridaData.motorista.email = ''
        corridaData.carro.plate = ''
        corridaData.carro.renavan = ''
        corridaData.carro.year = ''
        corridaData.carro.model = ''
        corridaData.carro.marca = ''
        corridaData.user.email = ''
        corridaData.user.name = ''
        corridaData.corrida.idCorrida = ''
        corridaData.corrida.latitudeFinal = ''
        corridaData.corrida.longitudeFinal = ''
        corridaData.corrida.longitudeInicial = ''
        corridaData.corrida.latitudeInicial = ''
        Alert.alert('Pronto!')

        navigation.navigate("UMenu")

      }).catch(function (error) { });

  }


  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    setIdCorrida(corridaData.corrida.idCorrida);
    intervalTIME()
    intervalTIMEZ()
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  useEffect(() => {
    //pede a localização do usuário.
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00621,
      });
      axios
        .post(API_REST + "" + PORT + "/api/localization", {
          token: tokenInfoCliente.token,
        }).then(function (response) {
          setDestination({
            latitude: response.data.lat,
            longitude: response.data.long,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00621,
          })
        })



    })();
  }, []);



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
          {destination && (<MapViewDirections
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
          />)}


          {localization && (<Marker
            coordinate={{ latitude: localization.latitude, longitude: localization.longitude }}
            pinColor={'red'}
            title={"Motorista"}
            description={"Seu motorista está aqui"}
          >

            <Image source={require('../../assets/pikachu.png')} style={{ height: 35, width: 35 }}></Image>

          </Marker>)}

          {pin && (<Marker
            coordinate={{ latitude: Number(corridaData.corrida.latitudeFinal), longitude: Number(corridaData.corrida.longitudeFinal) }}
            pinColor={'red'}
            title={"Destino"}
            description={"Já já você estará aqui"}
          >


          </Marker>)}

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
