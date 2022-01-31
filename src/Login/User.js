import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  Button,
  Image,
} from "react-native";
import { API_REST } from "../api/api";
import { AUTH_ROUT_USER } from "../api/authuser";
import { PORT } from "../api/port";
import { tokenInfoCliente } from "../token";
import { corridaData } from "../token/corrida";

export default function UserLogIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login(email, password) {
    axios
      .post(API_REST + "" + PORT + "" + AUTH_ROUT_USER, {
        email: email,
        password: password,
      })
      .then(function (response) {
        if (response.status === 200) {
          const data = response.data;
          tokenInfoCliente.token = data.token
          tokenInfoCliente.name = data.user.name
          tokenInfoCliente.email = data.user.email
          console.log(tokenInfoCliente)
          if(data.corrida !== null){
            if(data.corrida.corridaAceita === true){
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
              
              navigation.navigate("USMenu");
            } else{
              navigation.navigate("UMenu");
            }
          }else{
            navigation.navigate("UMenu");
          }
        }
      })
      .catch(function (error) {
        Alert.alert("Credenciais erradas");
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: "https://i.imgur.com/0FltieF.png" }}
      />
      <View style={styles.view}>
        <Text style={styles.text}>Email</Text>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.fieldInput}
        />

        <Text style={styles.text}>Senha</Text>
        <TextInput
          autoCapitalize="none"
          style={styles.fieldInput}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="LogIn"
          color="red"
          onPress={() => login(email, password)}
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
    height: "15%",
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
