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
    FlatList,
    Alert,
} from "react-native";

import { Ionicons } from '@expo/vector-icons';

import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenInfoCliente } from "../token";


export default function CardScreen() {
    const [cardList, setCardList] = useState([]);

    useEffect(() => {
        axios.post(API_REST + '' + PORT + '/api/card-list', {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyZTIxNDcyLTMwZTgtNDQyMi04ZjIzLTZkZTY2NmNiNWIxOSIsImlhdCI6MTY0NDIzMTQzMiwiZXhwIjoxNjQ0MzE3ODMyfQ.HdCgWQk5293ODCbkGn8umnJYAphv2Lp6brNHn6JP4n8'
        }).then(function (response) {
            setCardList(response.data)

        }).catch(function (error) {
            setCardList(null)
        })

    }, []);

    function excludeCard(cardID) {
        function finExclude(){
            axios.post(API_REST+''+PORT+''+'/api/card-delete',{
                ID:cardID,
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyZTIxNDcyLTMwZTgtNDQyMi04ZjIzLTZkZTY2NmNiNWIxOSIsImlhdCI6MTY0NDIzMTQzMiwiZXhwIjoxNjQ0MzE3ODMyfQ.HdCgWQk5293ODCbkGn8umnJYAphv2Lp6brNHn6JP4n8'
            }).then(function (response){
                if(response.status === 200){
                    Alert.alert('Cartão Deletado!')
                    axios.post(API_REST + '' + PORT + '/api/card-list', {
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQyZTIxNDcyLTMwZTgtNDQyMi04ZjIzLTZkZTY2NmNiNWIxOSIsImlhdCI6MTY0NDIzMTQzMiwiZXhwIjoxNjQ0MzE3ODMyfQ.HdCgWQk5293ODCbkGn8umnJYAphv2Lp6brNHn6JP4n8'
                    }).then(function (response) {
                        setCardList(response.data)
            
                    }).catch(function (error) {
                        setCardList(null)
                    })
                }
            }).catch(function(error){
                Alert.alert('Algo deu errado, tente novamente!')
            })
        }
        Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
                {
                    text: "Cancel",
                    onPress: () => Alert.alert("Cancelado!"),
                    style: "cancel",
                },
                {
                    text:'Deletar!',
                    onPress: ()=> finExclude()
                }
            ],
            {
                cancelable: true,
                onDismiss: () =>
                    Alert.alert(
                        "Exclusão Cancelada"
                    ),
            }
        );
    }

    return (

        <View style={[styles.container, { flexDirection: 'column' }]}>

            <Text style={{ fontSize: 32, textAlign: 'center' }}>SEUS CARTÕES</Text>


            <FlatList
                horizontal
                data={cardList}
                keyExtractor={cardList => cardList.ID}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.viewFlat}>
                            <View style={{ alignSelf: 'flex-end', marginTop: 0, marginRight: 4, position: 'absolute', }}>

                                <TouchableOpacity onPress={() => excludeCard(item.ID)}>
                                    <Ionicons name="trash-outline" size={24} color="red" style={{ alignSelf: 'center' }} />
                                </TouchableOpacity>
                            </View>
                            <Ionicons name="card-sharp" size={36} color="black" style={{ alignSelf: 'center' }} />
                            <View>
                                <Text style={styles.textFlat}>
                                    {item.nome}
                                </Text>
                                <Text style={styles.textFlat}>
                                    {item.dataValidade}
                                </Text>
                                <Text style={styles.textFlat}>
                                    {item.numero}
                                </Text>
                            </View>
                        </View>
                    )
                }}
            />



        </View >

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
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    viewFlat: {
        borderWidth: 2,
        borderColor: '#ccc',
        padding: 40,
        marginRight: 4,
        marginLeft: 4,
        height: '30%',
        top: 450,

    },
    textFlat: {
        fontSize: 20,
        padding: 10,
        textAlign: 'center'
    }


})