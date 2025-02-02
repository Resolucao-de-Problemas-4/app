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
  TouchableOpacity,
  Image
} from "react-native";
import { Alert, BackHandler } from "react-native";
import MapView from "react-native-maps";
import { tokenInfoCliente } from "../token";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { corridaData } from "../token/corrida";
import { StackActions } from "@react-navigation/native";



export default function Fmenu({ navigation }) {
  const [modalV, setModalV] = useState(false);
  const [distance, setDistance] = useState(null);
  const [price, setPrice] = useState(null);
  const [destino, setDestino] = useState('')
  var isReady = false;
  const mapEl = useRef(null);
  var idCorrida =''
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [places, setPlaces] = useState(true)
  const [initialPlace, setInitialPlace] = useState(null)
  let time;
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    time = null;
    setDestination(null)
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
          idCorrida = response.data.corridaID
          console.log(response.data.corridaID);
          isReady = true
          intervalTIME()
          setModalV(false);
          Alert.alert("Corrida criada 😁");
        }
      });
  }

  function intervalTIME() {
    if (time === null || time === undefined) {
      time = setInterval(function () {
        if (isReady === false) {
          clearInterval(time)
        }
        verify()
      }, 1000)
    }
  }



  function verify() {
    //verifica se a corrida foi encontrada
    axios
      .post(API_REST + "" + PORT + "/api/race-verify", {
        idCorrida,
      })
      .then(function (response) {
        if (response.status === 200) {
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
          isReady = false
          clearInterval(time)
          idCorrida=''
          navigation.navigate("USMenu");
        } else if (response.status === 201) { }
      }).catch(function (error) {
        console.log('err')
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
      setInitialPlace({
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
            setDestination(null)
            Alert.alert("Corrida Cancelada...");
            isReady = false
            idCorrida = ''
          } else if (response.status === 400) {
            Alert.alert("erro");
          }
        })
        .catch(function (error) {
        });
    }
  }

  const changeVisibility = () => {
    if (visible) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  };

  function logout() {
    tokenInfoCliente.email = "";
    tokenInfoCliente.name = "";
    tokenInfoCliente.token = "";
    tokenInfoCliente.cnh = "";
    isReady = false

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
          onUserLocationChange={(e) => {
            e.persist()
            // setOrigin({
            //   latitude: e.nativeEvent.coordinate.latitude,
            //   longitude: e.nativeEvent.coordinate.longitude,
            //   latitudeDelta: 0.000922,
            //   longitudeDelta: 0.000621,
            // })

          }}
          ref={mapEl}
        >
          <MapViewDirections
            lineDashPattern={[1]}
            lineCap={'square'}
            origin={origin}
            destination={destination}
            apikey={"AIzaSyD1u6IQERI6G3w8MhnvzPzh4NZSen9KO_U"}
            strokeWidth={3}
            strokeColor="purple"
            onReady={(result) => {
              setDistance(result.distance);
              setPlaces(false);
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

          {destination && (<Marker
            coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
            pinColor={"purple"}
            title={"title"}
            description={"description"}

          />)}

          {origin && (<Marker
            coordinate={{ latitude: origin.latitude, longitude: origin.longitude }}
            pinColor={"purple"}
            title={"Partida"}
            description={"Eu estou aqui!!"}

          />)}



        </MapView>
      </View>

      {/* <View style={{ top: "180%", width: "30%", left: "35%", position: 'absolute' }}>
        <Button title="cancelar" onPress={() => cancelarCorrida()} />
      </View> */}

      <View style={{ justifyContent: "flex-start" }}>
        <View style={{ margin: 120, padding: 50, right: 160, bottom: 120 }}>
          {/* <Button title="logout" onPress={() => logout()} /> */}
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ModalPopUp visible={visible}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.header}>
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <Text>INFORMAÇÕES DO USUÁRIO</Text>
              </View>
              <Ionicons name="close-circle-outline" size={24} color="red" style={{ alignItems: 'flex-end' }} onPress={() => changeVisibility()} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('UserProfile')}>
              <View style={styles.viewModal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="person-circle-outline" size={24} color="black" />
                  <Text style={styles.textModal}>
                    Perfil
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('RacesList')}>
              <View style={styles.viewModal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="car-sport-outline" size={24} color="black" />
                  <Text style={styles.textModal}>
                    MINHA CORRIDAS
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('CardScreen')}>
              <View style={styles.viewModal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="wallet" size={24} style={{ marginLeft: 5 }} color="black" onPress={() => changeVisibility()} />
                  <Text style={styles.textModal}>
                    FORMA DE PAGAMENTO
                  </Text>
                </View>
              </View>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => logout()}>
              <View style={styles.viewModal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="log-out-outline" size={24} style={{ marginLeft: 5 }} color="black" onPress={() => changeVisibility()} />
                  <Text style={styles.textModal}>
                    ENCERRAR SESSÃO
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

          </View>
        </ModalPopUp>
      </View >

      <View style={{ flex: 1, bottom: '5%', left: '88%', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center' }}>
        <Ionicons name="person-circle-outline" size={48} color="black" onPress={() => changeVisibility()} />
      </View>

      {places && origin && initialPlace && (<View style={{ flex: 20, bottom: 200, position: 'absolute', width: '75%', left: 30 }}>
        <GooglePlacesAutocomplete
          minLength={5}
          placeholder="Local de Partida"
          predefinedPlaces={[{ latitude: initialPlace.latitude, longitude: initialPlace.longitude, description: 'Seu Local' }]}
          predefinedPlacesAlwaysVisible={true}
          onPress={(data, details = null) => {

            if (details.description === ('Seu Local')) {
              setOrigin({
                latitude: details.latitude,
                longitude: details.longitude,
                latitudeDelta: 0.000922,
                longitudeDelta: 0.000621,
              });
            } else {

              setOrigin({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.000922,
                longitudeDelta: 0.000621,
              });
            }
          }
          }

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
      </View>)}

      {places && origin && initialPlace && (<View style={{ flex: 1, bottom: 70, position: 'absolute', width: '75%', left: 30 }}>
        <GooglePlacesAutocomplete
          minLength={5}
          placeholder="Para onde vamos?"

          onPress={(data, details = null) => {

            setDestino(details.formatted_address);
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


      </View>)}


      {
        distance && (
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
                      setDestination(null)
                      setPlaces(true)
                    }}
                    color="#8B0000"
                  />
                </View>
              </View>
            </Modal>
          </View>
        )
      }
    </View >
  );
}

const ModalPopUp = ({ visible, children }) => {
  return (
    <Modal transparent visible={visible}>
      <View style={styles.modalBackGround}>
        <View style={[styles.modalContainer]}>
          {children}
        </View>
      </View>
    </Modal>
  )
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
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  textModal: {
    marginLeft: 10, fontSize: 15, marginRight: 15

  },
  viewModal: {
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    height: 45,
    justifyContent: 'center',
    marginTop: 20,
    padding: 10
  }, mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover'
  }
});
