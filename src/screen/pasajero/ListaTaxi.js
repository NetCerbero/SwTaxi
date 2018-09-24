import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button, Text, View, FlatList, StyleSheet} from 'react-native';
import * as firebase from 'firebase';
import TransporteVacio from '../../component/TransporteVacio';
import BackgroundImage from '../../component/BackgroundImage';


export default class ListaTaxi extends Component{
	constructor(){
		super();
		this.state = {
			taxis : []
		}
	}


	componentDidMount(){
		firebase.database().ref()
	}
	render(){
		return(
			<Text>Lista taxi</Text>
		);
	}
}