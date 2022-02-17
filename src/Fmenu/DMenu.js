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
  TouchableOpacity
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
import { Ionicons } from '@expo/vector-icons';


export default function Fmenu({ navigation }) {
  const [deniedList, setDeniedList] = useState([])
  const [idCorrida, setidCorrida] = useState(null);
  const [latitudeF, setlatitudeF] = useState(null);
  const [longitudeF, setlongitudeF] = useState(null);
  const [updateRaceBox, setupdateRaceBox] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [corridaAceita, setcorridaAceita] = useState(false);
  const [destination, setDestination] = useState(null);
  const [visible, setVisible] = useState(false)

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

  const changeVisibility = () => {
    if (visible) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  };

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
        denied: deniedList,
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
          setDeniedList([])
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


          axios.post(API_REST + '' + PORT + '/api/localization-create', {
            token: tokenInfoMotorista.token,
            lat: origin.latitude,
            long: origin.longitude,
            corridaID: corridaData.corrida.idCorrida
          }).then(function (response) { 
            
            console.log(response.statusText)

          }).catch(function (error) {

          })

          navigation.navigate("DSMenu");
        } else if (response.status === 400) {
          alert.Alert(response.data.message);
        }
      });

    setupdateRaceBox(false);
  }

  function decline() {
    setDeniedList(deniedlist.push({ corridaID: idCorrida }));

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

    console.log(JSON.stringify(deniedList))
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

      <View style={{ justifyContent: "flex-start" }}>
        <View style={{ left: "50%", top: "180%", width: "30%" }}>
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

            <TouchableOpacity onPress={() => navigation.navigate('DriverProfile')}>
              <View style={styles.viewModal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="person-circle-outline" size={24} color="black" />
                  <Text style={styles.textModal}>
                    Perfil
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("Not Yet Implemented")}>
              <View style={styles.viewModal}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="car-sport-outline" size={24} color="black" />
                  <Text style={styles.textModal}>
                    MINHA CORRIDAS
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => console.log("Not Yet Implemented")}>
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

      <View style={{ flex: 1, top: '250%', left: '85%', position: 'absolute', width: '100%', height: '100%', justifyContent: 'center' }}>
        <Ionicons name="person-circle-outline" size={48} color="black" onPress={() => changeVisibility()} />
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
});
