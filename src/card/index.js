import React, { useEffect, useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Modal,
    Dimensions,
    TouchableOpacity,
    FlatList
} from "react-native";

import { Ionicons } from '@expo/vector-icons';

import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenInfoCliente } from "../token";


export default function CardScreen() {
    const [cardList, setCardList] = useState('');
    useEffect(() => {
        axios.post(API_REST + '' + PORT + '/api/card-list', {
            token: tokenInfoCliente.token
        }).then(function (response) {
            setCardList(response.data)

        }).catch(function (error) {
            setCardList(null)
        })

    }, []);
    return (

        <View>
            <View >
                <Text style={{ fontSize: 32, textAlign: 'center' }}>SEUS CARTÕES</Text>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '100%',}}>
                        <FlatList
                        horizontal
                            data={cardList}
                            keyExtractor={cardList => cardList.ID}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ flexDirection: 'row', width: '40%', borderWidth: 3, borderRadius: 20, marginTop: 10, height: 100 }}>
                                        <Ionicons name="card-sharp" size={36} color="black" style={{ alignSelf:'center'}} />
                                        <View style={{width:'100%', alignSelf:'center', marginLeft:10}}>
                                            <Text>
                                                {item.nome}
                                            </Text>
                                            <Text>
                                                {item.numero}
                                            </Text> 
                                        </View>
                                    </View>
                                )
                            }}


                        />

                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,

    }, View: {

        width: '100%',
        height: '100%',

    },

})