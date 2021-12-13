import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Modal,
  Dimensions,
} from "react-native";
import { Alert, BackHandler } from "react-native";

import MapView from "react-native-maps";
import { tokenInfo } from "../token";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";

export default function Fmenu({ navigation }) {
  const [modalV, setModalV] = useState(false);
  const [origin, setOrigin] = useState(null);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", () => true);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", () => true);
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00922,
        longitudeDelta: 0.00621,
      });
    })();
  }, []);

  function logout() {
    tokenInfo.email = "";
    tokenInfo.name = "";
    tokenInfo.token = "";
    tokenInfo.cnh = "";
    navigation.navigate("Home");
  }

  return (
    <View>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={origin}
          showsUserLocation={true}
          loadingEnabled={true}
        />
      </View>
      {/* <Text style={styles.title}>driverName</Text> */}
      <View style={{ justifyContent: "flex-start" }}>
        <View style={{ margin: 120, padding: 50, right: 160, bottom: 120 }}>
          <Button title="logout" onPress={() => logout()} />
        </View>
      </View>

      <View style={{ flex: 1, bottom: 250 }}>
        <GooglePlacesAutocomplete
          minLength={5}
          placeholder="Where do we go now?"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: "AIzaSyD1u6IQERI6G3w8MhnvzPzh4NZSen9KO_U",
            language: "pt-br",
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          styles={{
            listView: styles.listView,
            keyboardShouldPersistTaps: "handled",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fieldInput: {
    position: "relative",
    color: "black",
    borderColor: "grey",
    borderWidth: 5,
    borderTopWidth: 5,
    borderBottomWidth: 50,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    position: "absolute",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  listView: {
    position: "absolute",
    top: 40,
    borderColor: "gray",

    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
