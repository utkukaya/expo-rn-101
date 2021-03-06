import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity, FlatList, Text, View, Button,Image } from 'react-native';
import BottomProductScreen from './BottomProductScreen';
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { create_api } from '@relateddigital/visilabs-react-native'

class Products extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            data_id: this.props.route.params.cat_id,
      }
        this.props.navigation.setOptions({
            title: this.props.route.params.title
        })
    }
    componentDidMount = () => {
        fetch(`https://store.therelated.com/rest/V1/products?fields=items[id,sku,name,price,visibility,custom_attributes,extension_attributes]&searchCriteria[pageSize]=100&searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${this.state.data_id}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`, {
            method: 'get',
            header: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then(json => {
                this.setState({
                    products: json.items
                })
                
            });

    }

    onPress = (data) => {

        this.props.navigation.push('BottomProducts', {
            products_data: data,
        })
    }
    render() {
            return (
                <FlatList
                data={this.state.products}              
                renderItem={({item,index}) =><View>
                <Animatable.View 
                    animation="fadeInUpBig"
                    style={{flex: 0,
                        backgroundColor: 'white',
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                    }}
                >
                <TouchableOpacity key={index} style={{
                    backgroundColor: "#b00020", margin: 2,
                    padding: 15,borderRadius: 75
                }} onPress={() => this.onPress(item)}
                >
                    <View style={{ flexDirection: "row" }}
                        title={item.name}
                    >   
                         <Image 
                        source={{uri: 'https://store.therelated.com/media/catalog/product' + item.custom_attributes[0].value}}
                        style={{ width: 100, height: 100 ,borderRadius: 30}}
                        /> 
                        <View style= {{flexDirection: "column"}}>
                        <Text style={{
                            marginLeft: 10, fontSize: 16,
                            textAlignVertical: "center",
                            flex: 1,
                            color: 'white'    
                        }}>{item.name}
                        
                        </Text>
                        <Text style={{
                            marginLeft: 10, fontSize: 16,
                            textAlignVertical:
                                "center",
                            color: 'white'
                        }}>
                        Price: {item.price} TL
                        </Text>
                        </View>
                        </View>
                </TouchableOpacity>
                </Animatable.View>
                </View> }
            />
               
            
            )   
    }
};

export default Products;