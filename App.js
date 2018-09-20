import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Maps from './src/component/Maps';
import Start from './src/screen/Start';
import firebaseConfig from './src/utils/firebase';
import * as firebase from 'firebase';//importa todo

import Nave from "./src/navigation/navegacionConductor";

firebase.initializeApp(firebaseConfig);

export default class App extends Component<Props> {
	constructor(){
		super();
		this.state={
			isLogged:false
		}
	}
	async componentDidMount(){
		await firebase.auth().onAuthStateChanged((user)=>{
			if(user !== null){
				this.setState({
					isLogged: true
				});
			}else{
				this.setState({
					isLogged: false
				});
			}
		}); 
		//firebase.auth().signOut();
	}

	render() {
		const {isLogged} = this.state;
		if(isLogged){
			return(<Nave/>);
		}
		return (
		  <Start/>
		);
	}
}