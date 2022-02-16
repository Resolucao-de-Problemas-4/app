import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Modal,
    FlatList,
    Image
} from "react-native";
import { Alert } from "react-native";
import { tokenInfoCliente, tokenInfoMotorista } from "../token/";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port"
import { DRIVER_INFO } from "../api/driverinfo";


export default function DriverProfile() {

    const [driverInfo, setDriverInfo] = useState([])

    useEffect(() => {
        axios.post(API_REST + "" + PORT + "" + DRIVER_INFO, {
            token: tokenInfoMotorista.token
        })
            .then(function (response) {
                data = response.data
                setDriverInfo(data)
            })
            .catch(function (error) {
                setDriverInfo(null)
            });
    }, []);
    // console.log(userInfo)
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <View>
                    <Image
                        style={styles.pic}
                        source={{ uri: "https://imgur.com/dKyVwEf.gif" }}
                    />
                </View>
                <Text style={[styles.text, { fontWeight: 'bold', marginBottom: '15%', alignSelf: 'center', fontSize: 26, textAlign: 'center' }]}>{driverInfo.name}</Text>
                <View style={styles.textView}>
                    <Ionicons name="star" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>?</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons name="mail" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>{driverInfo.email}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons name="call" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>{driverInfo.phoneNumber}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons name="pin" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>{driverInfo.address}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons name="person" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>CNH: {driverInfo.CNH}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleView: {
        justifyContent: "flex-start",
        alignSelf: "center"
    },
    container: {
        marginTop: StatusBar.currentHeight || 0,
        top: '3%',
        height: '95%',
        marginBottom: '10%',
    },
    itensContainer: {
        flex: 1,
        top: '35%',
        marginLeft: '3%',
        marginRight: '3%',
        marginTop: '-11%',
        marginBottom: '15%'
    },
    item: {
        width: '95%',
        height: '99%',
        alignSelf: 'center',
        borderWidth: 3,
        borderRadius: 15,
        padding: 15
    },
    title: {
        fontSize: 32,
    },
    text: {
        fontSize: 19,
        alignSelf: 'flex-start'
    },
    textView: {
        flexDirection: 'row',
        marginBottom: '3%',
    },
    pic: {
        width: 150,
        height: 150,
        marginBottom: '5%',
        alignSelf: 'center'
    },
});