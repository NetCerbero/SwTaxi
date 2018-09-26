import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Maps from './src/component/Maps';
import Start from './src/screen/Start';
import firebaseConfig from './src/utils/firebase';
import * as firebase from 'firebase';//importa todo
import Toast from 'react-native-simple-toast';
import Conductor from "./src/navigation/navegacionConductor";
import Pasajero from "./src/navigation/navegacionPasajero";

firebase.initializeApp(firebaseConfig);

export default class App extends Component<Props> {
	constructor(){
		super();
		this.state={
			isLogged:false,
			conductor:false,
			pasajero:false
		}
	}
	async componentDidMount(){
		await firebase.auth().onAuthStateChanged((user)=>{
			if(user !== null){
				firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('rol')
					.on('value', snap =>{
						this.setState({isLogged: true, pasajero: snap.val().pasajero,conductor:snap.val().conductor});
					});
			}else{
				this.setState({isLogged:false, conductor:false, pasajero:false});
			}
		}); 
		//firebase.auth().signOut();
	}

	render() {
		const {isLogged, conductor, pasajero} = this.state;
		if(isLogged){
			if(conductor){
				return(<Conductor/>);
			}
			if(pasajero){
				return(<Pasajero/>);
			}
		}
		return (
		  <Start/>
		);
	}
}