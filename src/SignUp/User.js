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
import DatePicker from "react-native-datepicker";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { USER_ROUTE } from "../api/user";

export default function UserSignUp({ navigation }) {
  const date = new Date();
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");

  const [Birthday, setBirthday] = useState(date);

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  function validateBirth(birth) {
    var dates = new Date(birth);
    var age = date.getFullYear() - dates.getFullYear();
    return age;
  }

  function registerUser(
    customerName,
    customerAddress,
    customerEmail,
    customerPassword,
    Birthday
  ) {
    if (
      customerName == "" ||
      customerAddress == "" ||
      customerEmail == "" ||
      customerPassword == "" ||
      Birthday == ""
    ) {
      console.log();
      Alert.alert("Preencha todos os campos!");
      return "Preencha os Campos";
    }
    if (!validateEmail(customerEmail)) {
      Alert.alert("Insira um email valido");
      return "Preencha os Campos";
    }
    const age = validateBirth(Birthday);
    if (age < 18) {
      Alert.alert("Você não tem a idade mínima para se inscrever.");
      return "Preencha os Campos";
    }

    axios
      .post(API_REST+""+ PORT +""+USER_ROUTE, {
        customerName: customerName,
        customerAddress: customerAddress,
        customerEmail: customerEmail,
        customerPassword: customerPassword,
        customerBirthday: Birthday,
      })
      .then(function (response) {
        if (response.status === 201) {
          navigation.navigate("UMenu");
        }
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Email já cadastrado.");
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
          onChangeText={setCustomerName}
          value={customerName}
        />

        <Text style={styles.text}>Password</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Choose a password"
          onChangeText={setCustomerPassword}
          value={customerPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.text}>E-Mail</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Choose an email address"
          keyboardType="email-address"
          onChangeText={setCustomerEmail}
          autoCapitalize="none"
          value={customerEmail}
        />
        <Text style={styles.text}>Endereço</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Choose an email address"
          onChangeText={setCustomerAddress}
          value={customerAddress}
          autoCapitalize="none"
        />
        <View>
          <Text style={styles.text}>Data de Nascimento</Text>

          <DatePicker
            format="MM/DD/YYYY"
            minDate="01/01/1970"
            maxDate="01/01/2022"
            value={Birthday}
            style={styles.date}
            onDateChange={setBirthday}
          />
        </View>
        <Button
          title="SignUp"
          color="red"
          onPress={() =>
            registerUser(
              customerName,
              customerAddress,
              customerEmail,
              customerPassword,
              Birthday
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
    marginBottom: 5,
  },
});
