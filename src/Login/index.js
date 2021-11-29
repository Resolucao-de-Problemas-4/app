import React, { useState } from "react";
import axios from "axios";
import {  Text, View, TextInput, Alert, Button } from "react-native";


export default function LogIn({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function login(email, password) {
    axios
      .post("http://192.168.0.110:3030/api/auth", {
        email: email,
        password: password,
      })
      .then(function (response) {
        if (response.status == 200) {
          
          console.log(response.data);
          console.log(response.data.token)
          navigation.navigate("Fmenu");
        }
      }).catch(function(error){
        Alert.alert('Credenciais erradas')
        console.log(error)
      });
  }

  return (
    <View>
      <View>
        <Text>Email</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      </View>
      <View>
        <Text>Password</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <View>
        <Button
          title="LogIn"
          color="#f194ff"
          onPress={() => login(email, password)}
        />
      </View>
    </View>
  );
}
