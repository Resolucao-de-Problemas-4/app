import axios from "axios";
import react from "react";
import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image,
} from "react-native";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { CAR_ROUTE } from "../api/car";
import { tokenInfo } from "../token";

export default function app({ navigation }) {
  function registrarCarro(plate, chassi, renavam, ano, marca, modelo) {
    axios
      .post(API_REST + "" + PORT + "" + CAR_ROUTE, {
        token: tokenInfo.token,
        plate,
        chassi,
        renavam,
        year: ano,
        marca,
        model: modelo
    })
      .then(function (response) {
        if (response.status === 201) {
          navigation.navigate("DMenu");
        }
        if(response.status === 400){
            Alert.alert("Carro já cadastrado...")
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const [plate, setPlate] = useState("");
  const [chassi, setChassi] = useState("");
  const [ano, setAno] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [renavam, setRenavam] = useState("");
  return (
    <View style={styles.container}>
      <Text>Cadastro de Carro</Text>
      <Image
        style={styles.logo}
        source={{ uri: "https://i.imgur.com/0FltieF.png" }}
      />
      <View style={styles.view}>
        <Text style={styles.text}>Placa do Carro</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Placa"
          maxLength={8}
          value={plate}
          onChangeText={setPlate}
        />

        <Text style={styles.text}>chassi do carro</Text>
        <TextInput
          style={styles.fieldInput}
          maxLength={14}
          placeholder="Chassi"
          autoCapitalize="words"
          value={chassi}
          onChangeText={setChassi}
        />

        <Text style={styles.text}>Renavam</Text>
        <TextInput
          style={styles.fieldInput}
          maxLength={14}
          placeholder="Renavam"
          keyboardType="numeric"
          value={renavam}
          onChangeText={setRenavam}
        />

        <Text style={styles.text}>ano</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="ano do carro"
          keyboardType="number-pad"
          maxLength={4}
          value={ano}
          onChangeText={setAno}
          autoCapitalize="none"
        />

        <Text style={styles.text}>Marca Do Carro</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Marca"
          maxLength={32}
          autoCapitalize="none"
          value={marca}
          onChangeText={setMarca}
        />

        <Text style={styles.text}>Modelo do Carro</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Modelo"
          value={modelo}
          onChangeText={setModelo}
          autoCapitalize="words"
        />

        <Button
          title="SignUp"
          color="red"
          onPress={() => registrarCarro(plate,chassi,renavam,ano,marca,modelo)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  view: {
    height: "60%",
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
  logo: {
    width: 240,
    height: 200,
    marginBottom: 5,
  },
});
