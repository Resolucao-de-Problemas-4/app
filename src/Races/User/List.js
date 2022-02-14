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



export default function List({ navigation }) {
  const [racesList, setRacesList] = useState([])
  const [raceInfo, setRaceInfo] = useState(null)
  const [visible, setVisible] = useState(false)
  const [item, setItem] = useState('')
  const [rate, setRate] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    axios.post(API_REST + '' + PORT + '/api/race-u-list', {
    token: tokenInfoCliente.token
    }).then(function (response) {
      data = response.data.races
      setRacesList(data)
    }).catch(function (error) {
      setRacesList(null)
    })
  }, []);


  function sendRate() {
    if (rate > 5 || rate < 1 || rate === '' || rate === null) {
      Alert.alert('Nota informada está errada')
    } else {

      axios.post(API_REST + '' + PORT + '/api/rating', {
        // token:tokenInfoCliente.token
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNhZmZmZDk0LWJlNzgtNGFhOC05NzMwLWQ1MDIyN2JlMDU3ZCIsImlhdCI6MTY0NDc4MzcyNSwiZXhwIjoxNjQ0ODcwMTI1fQ.RG5QgRKtjfOV439qErA-xNctEGARxxDksy9Gk6LASsU',
        rating: Number(rate),
        review: description,
        idCorrida: item.id,
      }).then(function (response) {
        Alert.alert('Prontinho!')
        setItem('')
        changeVisibility()
      }).catch(function (error) {
        setItem('')
        Alert.alert('Erro')
        changeVisibility()
        console.log(error)
      })
    }
  }

  function closeInfo() {
    setItem('')
    changeVisibility()
  }

  function changeVisibility() {
    if (visible) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }

  function infos(item) {
    setItem(item)
    changeVisibility()
  }

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
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[styles.text, { flex: 3 }]}>
                    Valor: R${item.valorViagem}
                  </Text>
                  <Ionicons name="expand-outline" size={24} color="black" style={{ alignItems: 'flex-end' }} onPress={() => infos(item)} />
                </View>
              </View>
            </View>
          )
        }}
      />
      <ModalPopUp visible={visible}>
        <View style={styles.viewModal}>
          <Ionicons name="close-circle-outline" size={24} color="red" style={{ alignSelf: 'flex-end' }} onPress={() => closeInfo()} />
          <View style={{padding: 15}}>
            <Text style={styles.textModal}>Destino da viagem: {item.destinoFinal}</Text>
            <Text style={styles.textModal}>Data: {item.dataViagem}</Text>
            <Text style={styles.textModal}>Hora da solicitação: {item.horaSolicitacao}</Text>
            <Text style={styles.textModal}>Valor da Viagem: R${item.valorViagem}</Text>
            <TextInput
              style={styles.textInputModal}
              placeholder="5"
              value={rate}
              onChangeText={setRate}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.textInputModal, { height: '45%', textAlign: 'justify', textAlignVertical: 'top' }]}
              placeholder="Amei a viagem! Ele me deu bala. (Opcional)"
              value={description}
              onChangeText={setDescription}
            />
          </View>
          <Ionicons name="checkmark-done-outline" size={24} color="black" onPress={() => sendRate()} style={{ alignSelf: 'flex-end', top: '15%' }} />
        </View>
      </ModalPopUp>

    </View>
  )
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
  titleView: {
    justifyContent: "flex-start",
    alignSelf: "center"
  },
  container: {
    marginTop: StatusBar.currentHeight || 0,
    top: '3%',
    height: '95%',
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
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20
  },
  viewModal: {
    width: '100%',
    height: '65%',
    justifyContent: 'flex-start',
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textInputModal: {
    borderWidth: 1,
    marginTop: '5%',
    borderBottomColor: '#ccc',
    width: '70%',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center'
  },
  textModal:{
    marginBottom:'3%',
    fontSize: 15,
  }

});
