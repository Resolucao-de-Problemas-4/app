import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Alert } from 'react-native';

export default function Home({navigation}) {

    return (
        <View style={styles.container}>

            <View style={styles.view}>
                <Text> USER </Text>
                <Button
                    title="Login"
                    color="red"
                    onPress={() => navigation.navigate("ULogin")}
                />

                <Button
                    title=".   .   .  Register  .   .   ."
                    color="blue"
                    onPress={() => navigation.navigate("USignUp")}
                />

            </View>

            <View style={styles.view}>
              <Text> DRIVER </Text>
              <Button
                  title="Login"
                  color="red"
                  onPress={() => navigation.navigate("DLogin")}S
              />

              <Button
                title="Trabalhe conosco!"
                color="blue"
                onPress={() => navigation.navigate("DSignUp")}
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
      backgroundColor: 'rgb(200, 200, 200)'
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
  });
