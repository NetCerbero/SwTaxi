import React, { Component } from 'react';
import {
  Alert, Dimensions
} from 'react-native';
import { Button, Text, View, FlatList, StyleSheet} from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import Toast from 'react-native-simple-toast';
import * as firebase from 'firebase';
export default class Viaje extends Component{
	constructor(){
		super();
		this.storage = firebase.storage().ref();
		this.state = {token:null};
	}

	componentDidMount(){
		//const token = this.message.getToken().current
		// this.message.getToken()
		// 	.then(currentToken => {
		// 	   		Toast.showWithGravity(currentToken, Toast.LONG, Toast.BOTTOM);
		//     })
		//     .catch(function(err) {
	 //    		console.log('An error occurred while retrieving token. ', err);
		// 	});
	}

	render(){
		return(
			<View>
				<Text>hooi</Text>
			</View>
		);
	}
}