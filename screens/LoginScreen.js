import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity, FlatList, Text, View, Button,Image, StyleSheet,TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-community/async-storage';
import { create_api } from '@relateddigital/visilabs-react-native'

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { Euromessage } from '../Euromessage'


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: [],
            password: [],
            correctName: [],
            correctPassword: [],
            check_textInputChange: false,
            secureTextEntry: true,
            isValidUser: true,
            isValidPassword: true,
            token: [],
            account_token: [],
            KEY_ID: null,
            expoToken: null
        }
    }
    Login = () =>{if (this.props.route.params.currentData != null) return;
        fetch('https://store.therelated.com/rest/V1/integration/customer/token', {
            method: 'POST',
            headers: {
                 Accept: 'application/json',
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify({
                username: this.state.email,
                password: this.state.password

            }),
        })
            .then(response => response.json())
            .then(json => {

                this.setState({
                    token: json
                    
                },function(){
                    this.takenId()

                })
                this.registerForPushNotificationsAsync()
                this.SuccessLogin()

            });
    }
    takenId(){
        fetch('https://store.therelated.com/rest/V1/customers/me', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + this.state.token
            }
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    KEY_ID: json.id
                })
            });

    }
    registerForPushNotificationsAsync = async () => {

        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token_expo = await Notifications.getExpoPushTokenAsync();

        this.setState({
            expoToken: token_expo
        })
        //console.log(this.state.token)
        var user = { keyID: this.state.KEY_ID, email: this.state.email, token: token_expo };
        let api = Euromessage()
        api.euromsg.setUser(user);
        this.props.navigation.navigate('Categories', {

        })
    }
    SuccessLogin = async() => {
        this.setState({
            account_token: this.state.token
        },function () {
            this.writeToStorage()
        })
        this.state.token.length === 32 ? this.props.navigation.push('Categories', {}) : alert('Username or password is incorrect')
    }
    writeToStorage = async() => {
        await AsyncStorage.setItem('account_token', this.state.token)
    }        
    emailInput = (text) => {
       
        if(text.trim().length >= 4){
            this.setState({
                email: text,
                check_textInputChange: true,
                isValidUser: true
            })
        
        }else {

            this.setState({
                email: text,
                check_textInputChange: false,
                isValidUser: false
            })
        }
    }
    
    updateSecureTextEntry = () => {
        this.setState({
             secureTextEntry: !this.state.secureTextEntry
         });
     }

    handlePasswordChange = (text) => {
        if( text.trim().length >= 8 ) {
            this.setState({
                password: text,
                isValidPassword: true
            });
        } else {
            this.setState({
                password: text,
                isValidPassword: false
            });
        }
    }

    render() {
        return(
            <View>
                <ScrollView>
                <View style={{flex: 0,
                    justifyContent: 'flex-end',
                    paddingHorizontal: 20,
                    paddingBottom: 50,
                    backgroundColor: '#b00020'
                    }}>
                        <SimpleLineIcons
                        name="login"
                        color = "black"
                        size =  {60}
                        style ={{marginLeft: 'auto',
                    marginRight: 'auto',marginTop: 45}}
                        />
                </View>
                <Animatable.View 
                    animation="fadeInUpBig"
                    style={{flex: 3,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        paddingHorizontal: 20,
                        paddingVertical: 30,
                    }}
                >
                <Text style = {{color:'#05375a',fontSize: 18,marginTop: 35}}>
                        Email

                    </Text>
                <View style={{flexDirection: 'row'}}>
                    
                    <FontAwesome 
                    name="user-o"
                    color='#05375a'
                    size={20}
                />
                    <TextInput
                    placeholder="Your Email"
                    style={{paddingLeft:10,color:'#05375a',flex:1}}
                    onChangeText={(text) => this.emailInput(text)}/>
                    
                    {this.state.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
                { this.state.isValidUser ? null : 
                <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={{color: '#FF0000',fontSize: 14}}>Username must be 4 characters long.</Text>
                </Animatable.View>
                }

                </View>
                
                
                <Text style = {{color:'#05375a',fontSize: 18,marginTop: 35}}>
                        Password

                    </Text>
                <View style={{flexDirection: 'row'}}>
                    
                    <FontAwesome 
                    name="lock"
                    color='#05375a'
                    size={20}
                />
                    <TextInput
                    placeholder="Your Password"
                    style={{paddingLeft:10,color:'#05375a',flex:1}}
                    secureTextEntry={true}
                    secureTextEntry={this.state.secureTextEntry ? true : false}
                    onChangeText={(text) => this.handlePasswordChange(text)}/>
                     <TouchableOpacity
                    onPress={() => this.updateSecureTextEntry()}
                >
                    {this.state.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>

                { this.state.isValidPassword ? null : 
                <Animatable.View animation="fadeInLeft" duration={500}>
                <Text style={{color: '#FF0000',fontSize: 14}}>Password must be 8 characters long.</Text>
                </Animatable.View>
                }
                </View>
                <View  style ={{backgroundColor: '#b00020',
                padding: 10,
                marginTop: 35,
                borderRadius: 10
                
                }}>
                <Button
                title = "Enter to log in"
                color= 'white'
                onPress ={()=>this.Login()}
                />
                </View>
                </Animatable.View>
                </ScrollView>
            </View>
        )
        
    }

};

export default Login;