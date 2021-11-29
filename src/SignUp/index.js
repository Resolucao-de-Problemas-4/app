import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import axios from "axios";

export default function SignUp({ navigation }) {
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customerBirthdayDay, setCustomerBirthdayDay] = useState("");
  const [customerBirthdayMonth, setCustomerBirthdayMonth] = useState("");
  const [customerBirthdayYear, setCustomerBirthdayYear] = useState("");

  function registerUser(
    customerName,
    customerAddress,
    customerEmail,
    customerPassword,
    customerBirthdayDay,
    customerBirthdayMonth,
    customerBirthdayYear
  ) {
    const date =
      customerBirthdayDay +
      "/" +
      customerBirthdayMonth +
      "/" +
      customerBirthdayYear;

      const data = new Date(date)
      

      console.log(data)
    axios
      .post("http://192.168.0.110:3030/api/users", {
        "customerName": customerName,
        "customerAddress": customerAddress,
        "customerEmail": customerEmail,
        "customerPassword": customerPassword,
        "customerBirthday": data,
      })
      .then(function (response) {
        if (response.status === 201) {
          navigation.navigate("Fmenu");
        }
        if (response.status === 400) {
          console.log("Usuário já registrado ");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  

  return (
    <View>
      <View>
        <Text>Username</Text>
        <TextInput
          placeholder="Place your name please"
          onChangeText={setCustomerName}
          value={customerName}
        />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput
          placeholder="Choose a password"
          onChangeText={setCustomerPassword}
          value={customerPassword}
          secureTextEntry
        />
      </View>
      <View>
        <Text>E-Mail</Text>
        <TextInput
          placeholder="Choose an email address"
          keyboardType='email-address'
          onChangeText={setCustomerEmail}
          value={customerEmail}
        />
        <Text>Endereço</Text>
        <TextInput
          placeholder="Choose an email address"
          onChangeText={setCustomerAddress}
          value={customerAddress}
        />
        <View>
          <Text>Data de Nascimento</Text>
          <TextInput
            placeholder="Day of Birth"
            keyboardType="numeric"
            onChangeText={setCustomerBirthdayDay}
            value={customerBirthdayDay}
          />
          <TextInput
            placeholder="Month of Birth"
            keyboardType="numeric"
            onChangeText={setCustomerBirthdayMonth}
            value={customerBirthdayMonth}
          />
          <TextInput
            placeholder="Year of Birth"
            keyboardType="numeric"
            onChangeText={setCustomerBirthdayYear}
            value={customerBirthdayYear}
          />
        </View>
      </View>
      <View>
        <Button
          title="SignUp"
          color="#f194ff"
          onPress={() =>
            registerUser(
              customerName,
              customerAddress,
              customerEmail,
              customerPassword,
              customerBirthdayDay,
              customerBirthdayMonth,
              customerBirthdayYear
            )
          }
        />
      </View>
    </View>
  );
}
