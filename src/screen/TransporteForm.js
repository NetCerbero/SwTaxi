import React, {Component} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import AppButton from '../component/AppButton';
import * as firebase from 'firebase';
import t from 'tcomb-form-native';
import {Card,Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const Form = t.form.Form;
import Toast from 'react-native-simple-toast';
import BackgroundImage from '../component/BackgroundImage';
import {options, Transporte} from '../form/formTransporte';


const style = StyleSheet.create({
	button:{
		backgroundColor:'rgba(255, 38, 74, 0.9)'
	}
});


export default class TransporteForm extends Component{
	constructor(){
		super();
		this.state = {
			transporte :{
				titulo : '',
				hora : '',
				fecha : '',
				pasajeros : 0,
				precio : 0
			},
			puntosRecorridos:[]
			
		};
	}

	

	componentDidMount(){
		this.setState({puntosRecorridos: this.props.navigation.state.params.puntos});
	}
	// puntosRecorridos:this.state.puntosRecorridos,
	// detallePasajero:null

	save(){
		const validate = this.refs.form.getValue();
		if(validate){
			let data = {};
			const keyTransporte = firebase.database().ref().child('transporte').push().key;
			data[`transporte/${keyTransporte}`] = {
				titulo : validate.titulo,
				hora:  validate.hora,
				fecha:  validate.fecha,
				pasajeros :  validate.pasajeros,
				pasajerosSubidos:0,
				precio : validate.pasajeros,
				inicio : false,
				fin : false,
				estado : 1,
				id: firebase.auth().currentUser.uid
			};
			firebase.database().ref().update(data)
				.then(()=>{
					const keyRec = firebase.database().ref(`transporte/${keyTransporte}`).child('puntosRecorridos');
					let valor = {};
					valor['puntosRecorridos'] = this.state.puntosRecorridos;
					firebase.database().ref(`transporte/${keyTransporte}`).update(valor)
						.then(()=>{
							Toast.showWithGravity('Creado correctamente', Toast.LONG, Toast.BOTTOM);
							this.props.navigation.navigate('Home');
						})
						.catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM))
				})
				.catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM));
		}
	}

	render(){
		return(
			<BackgroundImage source={require('../../assets/images/mapaInicio.jpg')}>
				<ScrollView>
					<Card title="Formulario de restaurantes">
						<View>
							<Form
								ref={"form"}
								type={Transporte}
								options={options}
								//value={this.state.transporte}
							/>
						</View>
						<Button
							onPress={this.save.bind(this)}
							buttonStyle={style.button}
							title={"Registrar"}
							text={"Luis"}
							icon={
								<Icon
									name={'plus'}
									size={25}
									color={'#fff'}
								/>
							}
							iconRight={true}
						>
						</Button>
					</Card>
				</ScrollView>
			</BackgroundImage>			
		);
	}
}