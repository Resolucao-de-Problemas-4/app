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

import { tokenInfoCliente } from "../token/";
import { Ionicons } from '@expo/vector-icons';

import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port"
import { USER_INFO } from "../api/userinfo";


export default function UserProfile() {

    const [userInfo, setUserInfo] = useState([])

    axios.post(API_REST + "" + PORT + "" + USER_INFO, {
        token: tokenInfoCliente.token
    })
        .then(function (response) {
            data = response.data
            setUserInfo(data)
        })
        .catch(function (error) {
            setUserInfo(null)
        });
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
                <Text style={[styles.text, { fontWeight: 'bold', marginBottom: '15%', alignSelf: 'center', fontSize: 26, textAlign: 'center' }]}>{userInfo.name}</Text>
                <View style={styles.textView}>
                    <Ionicons name="star-outline" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>?</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons name="mail-outline" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>{userInfo.email}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons name="pin-outline" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>{userInfo.address}</Text>
                </View>
                <View style={styles.textView}>
                    <Ionicons name="calendar-outline" size={24} color="black" style={{ marginRight: '3%' }} />
                    <Text style={styles.text}>{userInfo.birthday}</Text>
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