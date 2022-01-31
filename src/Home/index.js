import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Alert } from 'react-native';
import {NavigationActions, StackActions} from '@react-navigation/native';
export default function Home({navigation}) {

  // useEffect(()=>{
  //   const resetAction = StackActions.reset({
  //     index: 0,
  //     actions: [NavigationActions.navigate({routeName: 'Home'})],
  //     key: null,
  //   });
  //   this.props.navigation.dispatch(resetAction);
  // })

    return (
      <View style={styles.container}>

        <View style={{flexDirection: "row", justifyContent: "space-between", right:15, bottom:50}}>

            <Text style={{marginHorizontal:11}}> USER </Text>

            <View style={{width:100,marginHorizontal:5}}>
              <Button
                title="Login"
                color="red"
                onPress={() => navigation.navigate("ULogin")}
              />
            </View>

            <View style={{width:156}}>
              <Button
                  title="Register"
                  color="blue"
                  onPress={() => navigation.navigate("USignUp")}
              />
            </View>
            
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-between",right:10, bottom:10}}>

          <Text > DRIVER </Text>

          <View style={{width:100,marginHorizontal:5}}>
            <Button
                title="Login"
                color="red"
                onPress={() => navigation.navigate("DLogin")}S
            />
          </View>

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
