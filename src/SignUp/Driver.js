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
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { DRIVER_ROUTE } from "../api/driver";

export default function DriverSignUp({ navigation }) {
  const [driverName, setDriverName] = useState("");
  const [driverCNH, setDriverCNH] = useState("");
  const [driverAddress, setDriverAddress] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  function validateCNH(CNH) {
    var re = /[0-9]{11}/;
    return re.test(CNH);
  }
  
  function registerDriver(
    driverName,
    driverCNH,
    driverAddress,
    driverEmail,
    driverPassword,
    ) {
    if (
      driverName == "" ||
      driverCNH == "" ||
      driverAddress == "" ||
      driverEmail == "" ||
      driverPassword == ""
    ) {
      console.log();
      Alert.alert("Preencha todos os campos!");
      return "Preencha os Campos";
    }
    if (!validateEmail(driverEmail)) {
      Alert.alert("Insira um email valido");
      return "Preencha os Campos";
    }else if (!validateCNH(driverCNH)) {
      Alert.alert("Insira uma CNH valida");
      return "Preencha os Campos";
    }

    axios
      .post(API_REST+""+PORT+""+DRIVER_ROUTE, {
        driverName: driverName,
        driverCNH: driverCNH,
        driverAddress: driverAddress,
        driverEmail: driverEmail,
        driverPassword: driverPassword,

      })
      .then(function (response) {
        if (response.status === 201) {
          navigation.navigate("DMenu");
        }
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Email ou CNH já cadastrado.");
      });
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: "https://i.imgur.com/0FltieF.png" }}
      />
      <View style={styles.view}>
        
        <Text style={styles.text}>Username</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Seu nome"
          onChangeText={setDriverName}
          value={driverName}
        />

        <Text style={styles.text}>Password</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Choose a password"
          onChangeText={setDriverPassword}
          value={driverPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.text}>CNH</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Type ur CNH"
          //keyboardType="cnh"
          onChangeText={setDriverCNH}
          value={driverCNH}
          autoCapitalize="none"

        />

        <Text style={styles.text}>E-Mail</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Choose an email address"
          keyboardType="email-address"
          onChangeText={setDriverEmail}
          value={driverEmail}
          autoCapitalize="none"
        />

        <Text style={styles.text}>Endereço</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Choose an email address"
          onChangeText={setDriverAddress}
          value={driverAddress}
          autoCapitalize="none"
        />

        <Button
          title="SignUp"
          color="red"
          onPress={() =>
            registerDriver(
              driverName,
              driverCNH,
              driverAddress,
              driverEmail,
              driverPassword
            )
          }
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
    marginBottom:5,
  },
});
