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
    Image,
} from "react-native";
import { TextInputMask } from 'react-native-masked-text'
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { API_REST } from "../api/api";
import { PORT } from "../api/port";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenInfoCliente } from "../token";

const ModalPopUp = ({ visible, children }) => {
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



export default function CardScreen() {
    const [cardList, setCardList] = useState([]);
    const [visible, setVisible] = useState(false)
    const [cardNumber, setCardNumber] = useState('');
    const [cardDate, setCardDate] = useState('')
    const [cardCVV, setCardCVV] = useState('')
    const [cardName, setCardName] = useState('')

    useEffect(() => {
        axios.post(API_REST + '' + PORT + '/api/card-list', {
            token: tokenInfoCliente.token
        }).then(function (response) {
            setCardList(response.data)
        }).catch(function (error) {
            setCardList(null)
        })
    }, []);

    function refreshList() {
        axios.post(API_REST + '' + PORT + '/api/card-list', {
            token: tokenInfoCliente.token
        }).then(function (response) {
            setCardList(response.data)
        }).catch(function (error) {
            setCardList(null)
        })
    }

    const changeVisibility = () => {
        if (visible) {
            setVisible(false)
        } else {
            setVisible(true)
        }
    };
    function excludeCard(cardID) {
        function finExclude() {
            axios.post(API_REST + '' + PORT + '' + '/api/card-delete', {
                ID: cardID,
                token: tokenInfoCliente.token
            }).then(function (response) {
                if (response.status === 200) {
                    Alert.alert('Cartão Deletado!')
                    refreshList()
                }
            }).catch(function (error) {
                Alert.alert('Algo deu errado, tente novamente!')
            })
        }
        Alert.alert(
            "Deletar Cartão",
            "Deseja mesmo excluir esse Cartão? \nEle pode ser adicionado novamente mais tarde",
            [
                {
                    text: "Cancel",
                    onPress: () => Alert.alert("Cancelado!"),
                    style: "cancel",
                },
                {
                    text: 'Deletar!',
                    onPress: () => finExclude()
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
    function resetCard() {
        setCardCVV('')
        setCardDate('')
        setCardName('')
        setCardNumber('')
    }

    function addCard(number, cvv, dateCard, name) {
        const value = dateCard.split('/')
        if (value[0] > 12 || value[0] < 1) {
            Alert.alert("Mês Inválido.")

        }
        else if (value[1] > 2050 || value[1] < 2021) {
            Alert.alert("Ano Inválido.")

        }
        else if (number !== '' && cvv != '' && name !== '') {

            axios.post(API_REST + '' + PORT + '/api/card-create',
                {
                    number: number,
                    cvv: cvv,
                    dateCard: dateCard,
                    name: name,
                    token: tokenInfoCliente.token
                }
            ).then(function (response) {
                if (response.status === 201) {
                    Alert.alert("Concluído!!! 🚀")
                    changeVisibility()
                    refreshList()
                    resetCard()
                }
            })
        } else {
            Alert.alert('Verifique o que foi informado...')
        }

    }

    return (

        <View style={[styles.container, { flexDirection: 'column', }]}>
            <View style={[{ width: '100%', height: '10%' }]}>
                <TouchableOpacity onPress={() => changeVisibility()}>
                    <Ionicons name="add-circle-sharp" style={{
                        alignSelf: 'flex-end',
                        marginTop: 5,
                        marginRight: 5,
                    }} color='green'
                        size={50} />
                </TouchableOpacity>
            </View>

            <Image
                style={styles.logo}
                source={{ uri: "https://i.imgur.com/0FltieF.png" }}
            />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ModalPopUp visible={visible}>
                    <Ionicons name="close-circle-outline" size={24} color="red" style={{ alignItems: 'flex-end' }} onPress={() => changeVisibility()} />
                    <View style={styles.viewModal}>
                        <TextInputMask
                            type={'credit-card'}
                            style={styles.textInputModal}
                            value={cardNumber}
                            onChangeText={setCardNumber}
                            placeholder={'Numero do Cartão'}
                        /><TextInput

                            style={styles.textInputModal}
                            value={cardCVV}
                            secureTextEntry={true}
                            keyboardType='numeric'
                            maxLength={3}
                            onChangeText={setCardCVV}
                            placeholder={'CVV'}
                        /><TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'MM/YYYY'
                            }}
                            style={styles.textInputModal}
                            value={cardDate}
                            onChangeText={setCardDate}
                            placeholder='Data de Validade'
                        />


                        <TextInput

                            keyboardType='name-phone-pad'
                            style={styles.textInputModal}
                            value={cardName}
                            placeholder='nome do Dono'
                            onChangeText={setCardName}
                        />
                    </View>

                    <View style={{ bottom: 0, width: '45%', justifyContent: 'center', alignSelf: 'center' }}>
                        <Button title='Adicionar Cartão' onPress={() => addCard(cardNumber, cardCVV, cardDate, cardName)} color='purple' />
                    </View>

                </ModalPopUp>

            </View>
            <View style={{ position: 'relative', width: '100%', 'height': '60%', bottom: 20 }}>
                <FlatList
                    horizontal
                    data={cardList}
                    keyExtractor={cardList => cardList.ID}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.viewFlat}>
                                <View style={{ alignSelf: 'flex-end', marginTop: 0, marginRight: 4, position: 'absolute' }}>

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
            </View>
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
        backgroundColor: 'white',

    },
    viewFlat: {
        borderWidth: 2,
        borderColor: '#ccc',
        padding: 40,
        marginRight: 4,
        marginLeft: 4,
        height: '50%',
        top: 160

    },
    textFlat: {
        fontSize: 20,
        padding: 10,
        textAlign: 'center'
    }, modalBackGround: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 30,
        borderRadius: 20,
        elevation: 20
    },
    viewModal: {
        width: '100%',
        height: '55%',
        justifyContent: 'center',
        padding: 26,
    },
    textInputModal: {
        borderBottomWidth: 1,
        marginTop: 5,
        borderBottomColor: '#ccc',
        width: '70%',
        justifyContent: 'center',
        alignSelf: 'center',
        textAlign: 'center'
    },
    textModal: {
        textAlign: 'center', top: 130, color: 'black'
    },logo: {
        width: 240,
        height: 200,
        marginBottom: 5,
        justifyContent:'center',
        alignSelf:'center'
      },

})