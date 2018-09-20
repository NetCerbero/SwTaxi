import React, {Component} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';//es un contenedor
import BackgroundImage from '../component/BackgroundImage';
import AppButton from '../component/AppButton';
import {NavigationActions} from 'react-navigation';//vamos a poder definir la navegacion a otras paginas
import Toast from 'react-native-simple-toast';//mostrara una notificacion al usuario
import {Button} from 'react-native-elements';

import * as firebase from 'firebase';//importa todo
import t from 'tcomb-form-native';//
import FormValidation from '../utils/Validation';

const Form = t.form.Form;

//haremos la autenticacion con facebook
export default class Start extends Component{
	constructor(){
		super();
		this.user = t.struct({
			email: FormValidation.email,
			password: FormValidation.password
		});

		this.options = {
			fields: {
				email:{
					help : 'Introduce tu email',
					error : 'Email incorrecto',
					autoCapitalize:'none'
				},
				password:{
					help : 'Introduce tu password',
					error : 'Password incorrecto',
					password: true,
					secureTextEntry: true
				}
			}
		}
	}

	login(){
		const validate = this.refs.form.getValue();
		if(validate){
			firebase.auth().signInWithEmailAndPassword(validate.email,validate.password)
				.then(()=>{
					Toast.showWithGravity("Bienvenido", Toast.LONG, Toast.BOTTOM);
				})
				.catch((error)=>{
					const errorCode = error.code;
					const errorMessage = error.message;
					if(errorCode === 'auth/wrong-password'){
						Toast.showWithGravity('Password incorrecta', Toast.LONG, Toast.BOTTOM);
					}else{
						Toast.showWithGravity(errorMessage, Toast.LONG, Toast.BOTTOM);
					}
				});
		}
	}

	render(){
		return(
			<BackgroundImage source={require('../../assets/images/mapaInicio.jpg')}>
				<View style={{justifyContent:'center',flex:1}}>
					<View style={styles.container}>
						<Form
							ref={"form"}
							type={this.user}
							options={this.options} 
						/>
					</View>
					<Button
							onPress={this.login.bind(this)}
							buttonStyle={styles.button}
							title={"Luis"}
							text={"Luis"}
					>
					</Button>
				</View>
			</BackgroundImage>
		);
	}
}


const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
	container:{
	    padding: 20,
	    marginRight:20,
	    marginLeft:20,
	    borderRadius: 10,
	    backgroundColor: 'rgba(111,38,74,0.2)'
	},
	button:{
		backgroundColor: 'rgba(111,38,74,0.4)',
		height: 45,
		borderWidth:0,
		borderRadius: 5,
		marginRight:20,
	    marginLeft:20,
		width: width - 40
	}
});