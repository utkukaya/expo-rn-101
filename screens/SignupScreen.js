import React, { Component} from 'react';
import { ActivityIndicator, TouchableOpacity, FlatList, Text, View, Button,Image, StyleSheet,TextInput} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { ScrollView } from 'react-native-gesture-handler';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: [],
            firstName: [],
            lastName: [],
            password: [],
            check_textInputChange: false,
            secureTextEntry: true,
            isValidUser: true,
            isValidPassword: true
        }
    }

   

    componentDidMount = () => {
        if (this.props.route.params.currentData != null) return;
        fetch('https://store.therelated.com/rest/V1/customers', {
            method: 'post',
            header: new Headers({
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: this.state.email,
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                password: this.state.password
            }),
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    //tokendonecek
                })
                
                
            });

    }

    

    onPress = () => {
        console.log(this.state.correctName)
       
            alert('Successful Login')
       
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
                    paddingBottom: 50}}>
                <Text style={{color: 'black',
                    fontWeight: 'bold',
                    fontSize: 30}}>Welcome to sign up screen!</Text>
                </View>
                <Animatable.View 
                    animation="fadeInUpBig"
                    style={{flex: 3,
                        backgroundColor: 'black',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        paddingHorizontal: 20,
                        paddingVertical: 30,
                    }}
                ></Animatable.View>
                <Text style = {{color:'#05375a',fontSize: 18,marginTop: 35}}>Email</Text>
                <View style={{flexDirection: 'row'}}>
                    <FontAwesome 
                    name="user-o"
                    color='#05375a'
                    size={20}/>
                    <TextInput
                    placeholder="Your Email"
                    style={{paddingLeft:10,color:'#05375a',flex:1}}
                    onChangeText={(text) => this.emailInput(text)}/>
                    {this.state.check_textInputChange ? 
                <Animatable.View
                    animation="bounceIn">
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
                </Animatable.View>}
                </View>
                <Text style = {{color:'#05375a',fontSize: 18,marginTop: 35}}>First Name</Text>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                    placeholder="Your First Name"
                    style={{paddingLeft:10,color:'#05375a',flex:1}}
                    onChangeText={(text) => this.setState({firstName: text})}/>                
                </View>
                <Text style = {{color:'#05375a',fontSize: 18,marginTop: 35}}>
                        First Name

                    </Text>
                <View style={{flexDirection: 'row'}}>
                    
                    <TextInput
                    placeholder="Your Last Name"
                    style={{paddingLeft:10,color:'#05375a',flex:1}}
                    onChangeText={(text) => this.setState({lastName: text})}/>
                </View>
                <Text style = {{color:'#05375a',fontSize: 18,marginTop: 35}}>Password</Text>
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
                
                
                <Button title="Enter to sign up"
                onPress ={()=>this.onPress()}
                />
                </ScrollView>
            </View>
        )
        
    }

};

export default Signup;