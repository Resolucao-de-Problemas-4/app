import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  Image, Modal
} from "react-native";
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { DRIVER_ROUTE } from "../api/driver";
import { TextInputMask } from "react-native-masked-text";
import { Ionicons } from '@expo/vector-icons';

export default function DriverSignUp({ navigation }) {
  const [driverName, setDriverName] = useState("");
  const [driverCNH, setDriverCNH] = useState("");
  const [driverAddress, setDriverAddress] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPassword, setDriverPassword] = useState("");
  const [address, setAddress] = useState('');
  const [addressInfo, setAddressInfo] = useState({})
  const [visible, setVisible] = useState(false)

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
      driverName === "" ||
      driverCNH === "" ||
      driverAddress === "" ||
      driverEmail === "" ||
      driverPassword === ""
    ) {
      console.log();
      Alert.alert("Preencha todos os campos!");
      return "Preencha os Campos";
    }
    if (!validateEmail(driverEmail)) {
      Alert.alert("Insira um email valido");
      return "Preencha os Campos";
    } else if (!validateCNH(driverCNH)) {
      Alert.alert("Insira uma CNH valida");
      return "Preencha os Campos";
    }

    axios
      .post(API_REST + "" + PORT + "" + DRIVER_ROUTE, {
        driverName: driverName,
        driverCNH: driverCNH,
        driverAddress: driverAddress,
        driverEmail: driverEmail,
        driverPassword: driverPassword,

      })
      .then(function (response) {
        if (response.status === 201) {
          navigation.navigate("DLogin");
        }
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Email ou CNH já cadastrado.");
      });
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
    setAddress(addressInfo.logradouro + ' - ' + addressInfo.bairro + ' - ' + addressInfo.localidade + ' / ' + addressInfo.localidade)
    registerDriver(driverName,
      driverCNH,
      address,
      driverEmail,
      driverPassword)
    changeVisibility()
  }

  function setUpAddressLineNull() {
    setAddress(null)
    changeVisibility()
  }

  function changeVisibility() {
    if (visible) {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: "https://i.imgur.com/0FltieF.png" }}
      />
      <View style={styles.view}>

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

        <TextInputMask
          type="custom"
          options={{
            mask: '999999999999'
          }}
          style={styles.fieldInput}
          placeholder="Type ur CNH"
          onChangeText={setDriverCNH}
          value={driverCNH}
          keyboardType='numeric'

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

        <Text style={styles.text}>CEP</Text>
        <TextInputMask
          type='custom'
          options={{ mask: '99999-999' }}
          style={styles.fieldInput}
          placeholder="CEP"
          onChangeText={setDriverAddress}
          value={driverAddress}
          keyboardType='numeric'
        />

        <Button
          title="SignUp"
          color="red"
          onPress={() => {
            if (driverAddress.length > 6) {

              axios.get('https://viacep.com.br/ws/' + driverAddress + '/json/').then(function (response) {
                if (response.data.erro === true) {
                  Alert.alert('CEP não encontrado... \nJá pensou em viver em sociedade? 🤪')
                } else {
                  setAddressInfo(response.data)
                  changeVisibility()
                }

              }).catch(function (error) {

              })
            } else {
              Alert.alert('Digite um CEP válido.')
            }

          }
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
});
