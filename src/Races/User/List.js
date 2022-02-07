import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  Dimensions,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Alert, BackHandler } from "react-native";

import { tokenInfoCliente } from "../../token";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { StackActions, NavigationActions, NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import * as Location from "expo-location";
import axios from "axios";
import { API_REST } from "../../api/api";
import { PORT } from "../../api/port";
import { corridaData } from "../../token/corrida";
import style from "react-native-datepicker/style";



export default function List() {
  const [racesList, setRacesList] = useState([])
  let iniciada = [];
  useEffect(() => {
    axios.post(API_REST + '' + PORT + '/api/race-u-list', {
      token:tokenInfoCliente.token
    }).then(function (response) {
      console.log(response.data)
      data = response.data.races
      setRacesList(data)
    }).catch(function (error) {
      setRacesList(null)
    })
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={racesList}
        keyExtractor={racesList => racesList.id}
        renderItem={({ item }) => {
          return (
            <View style={styles.itensContainer}>
              <View style={styles.item}>
                <Text style={styles.text}>
                  {item.destinoFinal}
                </Text>
                <Text style={styles.text}>
                  Valor: R${item.valorViagem}
                </Text>
              </View>
            </View>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  titleView: {
    justifyContent: "flex-start",
    alignSelf: "center"
  },
  container: {
    marginTop: StatusBar.currentHeight || 0,
    top: '3%',
    height:'95%',
    marginBottom: '10%',
  },
  itensContainer: {
    flex: 1,
    top: '35%',
    marginLeft: '3%',
    marginRight: '3%',
    marginTop: '-11%',
    marginBottom: '15%'
  },
  item: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderRadius: 15,
    padding: 15
  },
  title: {
    fontSize: 32,
  },
  text: {
    fontSize: 15
  },
});
