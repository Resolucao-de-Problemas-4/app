import React from "react";
import { Dimensions, View } from "react-native";
import {StyleSheet, Text} from 'react-native'

import MapView from "react-native-maps";

export default function Map () {
  
    return (
        <View style={styles.container}>
          <MapView style={styles.map}
          initialRegion={{
            latitude:-29.78946916000571, 
            longitude:-55.76862928879035,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00621,
          }}
          />
        </View>
      );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:50,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
