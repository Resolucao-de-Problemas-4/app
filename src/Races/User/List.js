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



export default function List() {
  const [racesList, setRacesList] = useState([])
  let iniciada = [];
  useEffect(() => {
    axios.post(API_REST + '' + PORT + '/api/race-u-list', {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyZTIxNDcyLTMwZTgtNDQyMi04ZjIzLTZkZTY2NmNiNWIxOSIsImlhdCI6MTY0NDE5MDE1OCwiZXhwIjoxNjQ0Mjc2NTU4fQ.LbuI2CMrTCxQeF5CsFWTB6KqM-o4G6YtG359aZisYRs'
      // token:tokenInfoCliente.token
    }).then(function (response) {
      console.log(response.data)
      data = response.data.races
      setRacesList(data)    
    }).catch(function (error) {
      setRacesList(null)
    })
  }, []);


  return (
    <View>
      <View style={{ top: '10%'}}>
        <Text style={{ fontSize: 32, textAlign: 'center' }}>Lista de Corridas</Text>
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '100%', }}>
          <FlatList
            data={racesList}
            keyExtractor={racesList => racesList.id}
            renderItem={({ item }) => {
              return (
                <View style={{ flexDirection: 'row', width: '40%', borderWidth: 3, borderRadius: 20, marginTop: 10, height: 100 }}>
                  <View style={{ width: '100%', alignSelf: 'center' }}>
                    <Text style={{fontSize: 32, textAlign: 'center'}}>
                      {item.destinoFinal}
                    </Text>
                  </View>
                </View>
              )
            }}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  view: {
    height: "500%",
    left: "50%",
    top: "50%"
  },
  fieldInput: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    textAlign: "center",
    height: 35,
    width: 250,
    marginTop: 3,
    marginBottom: 5,
  },
  text: {
    fontFamily: "serif",
    fontStyle: "italic",
    fontWeight: "bold",
    textAlign: "center",
  },
  date: {
    width: "100%",
    marginBottom: 25,
  },
  button: {
    marginTop: 100,
    width: 250,
    height: 75,
  },
  logo: {
    width: 240,
    height: 200,
    marginBottom: 5,
  },
});
