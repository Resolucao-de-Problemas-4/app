import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  Button,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { USER_ROUTE } from "../api/user";
import { TextInputMask } from "react-native-masked-text";
import { Ionicons } from '@expo/vector-icons';

export default function UserSignUp({ navigation }) {
  const date = new Date();
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [visible, setVisible] = useState(false)
  const [birthday, setBirthday] = useState(date);
  const [addressInfo, setAddressInfo] = useState({})
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
    birthday
  ) {
    if (
      customerName == "" ||
      customerAddress == "" ||
      customerEmail == "" ||
      customerPassword == "" ||
      birthday == ""
    ) {
      Alert.alert("Preencha todos os campos!");
    }
    if (!validateEmail(customerEmail)) {
      Alert.alert("Insira um email valido");
    }
    const age = validateBirth(birthday);
    if (age < 18) {
      Alert.alert("Você não tem a idade mínima para se inscrever.");
    }

    axios
      .post(API_REST + "" + PORT + "" + USER_ROUTE, {
        customerName: customerName,
        customerAddress: customerAddress,
        customerEmail: customerEmail,
        customerPassword: customerPassword,
        customerBirthday: birthday,
      })
      .then(function (response) {
        if (response.status === 201) {
          navigation.navigate("ULogin");
        }

      })
      .catch(function (error) {
        console.log(error.message);
        Alert.alert("Email já cadastrado.");
      });
  }

  function changeVisibility() {
    if (visible) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }

  const ModalPop = ({ visible, children }) => {
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

  function makeAddressLine() {
    const endereco = addressInfo.logradouro + ' - ' + addressInfo.bairro + ' - ' + addressInfo.localidade + ' / ' + addressInfo.uf
    registerUser(customerName, endereco, customerEmail, customerPassword, birthday)
    changeVisibility()
  }

  function setUpAddressLineNull() {
    changeVisibility()
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: "https://i.imgur.com/0FltieF.png" }}
      />

      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center'
      }}>

        <ModalPop visible={visible}>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.header}>
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', top: '80%' }}>
                <Text style={styles.textModal}>{addressInfo.bairro}</Text>
                <Text style={styles.textModal}>{addressInfo.logradouro}</Text>
                <Text style={styles.textModal}>{addressInfo.uf}</Text>
                <Text style={styles.textModal}>{addressInfo.localidade}</Text>
              </View>
            </View>
            <View style={{
              alignItems: 'flex-end',
              marginTop: 80,
              flexDirection: 'row',
            }}>
              <Ionicons name="thumbs-up-outline" color='green' size={28} style={{ marginRight: 10 }} onPress={() => makeAddressLine()} />
              <Ionicons name="thumbs-down-outline" color='red' size={28} style={{ marginLeft: 10 }} onPress={() => setUpAddressLineNull()} />
            </View>
          </View>
        </ModalPop>

      </View>

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
        <Text style={styles.text}>CEP</Text>
        <TextInputMask
          type='custom'
          options={{ mask: '99999-999' }}
          style={styles.fieldInput}
          placeholder="Digite seu CEP"
          onChangeText={setCustomerAddress}
          value={customerAddress}
          keyboardType='numeric'
          autoCapitalize="none"
        />
        <View style={styles.container}>
          <Text style={styles.text}>Data de Nascimento</Text>

          <TextInputMask
            type='datetime'
            options={{ format: 'DD/MM/YYYY' }}
            keyboardType="numeric"
            value="birthDay"
            onChangeText={setBirthday}
            placeholder='Data de Aniversário'
            style={styles.fieldInput}
          />

        </View>
        <View style={{ top: 15 }}>

          <Button
            title="SignUp"
            color="red"
            onPress={() => {
              if (customerAddress.length > 6) {

                axios.get('https://viacep.com.br/ws/' + customerAddress + '/json/').then(function (response) {
                  if (response.data.erro === true) {
                    Alert.alert('CEP não encontrado... \nJá pensou em viver em sociedade? 🤪')
                  } else {
                    setAddressInfo(response.data)
                    changeVisibility()
                  }

                }).catch(function (error) {

                })
              } else{
                Alert.alert('Digite um CEP válido.')
              }

            }

            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    top: 10
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
    justifyContent: 'center'
  },
  date: {
    width: "100%",
    marginBottom: 25,
  },
  logo: {
    width: 240,
    height: 200,
    marginBottom: 5,
  }, textInputModal: {
    borderBottomWidth: 1,
    marginTop: 5,
    borderBottomColor: '#ccc',
    width: '70%',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center'
  }, modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '70%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
    height: '30%'
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  textModal: {
    textAlign: 'center',
    fontSize: 18,
    justifyContent: 'center'

  }
});
