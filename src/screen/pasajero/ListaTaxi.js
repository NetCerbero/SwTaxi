import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View, FlatList, ScrollView, StyleSheet} from 'react-native';
import {ListItem, Card, Button} from 'react-native-elements';
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
		firebase.database().ref().child('transporte').orderByChild('estado')
			.equalTo(1).on('value', s => {
				let taxis = [];
				s.forEach(e => {
						if(e.val().pasajerosSubidos != e.val().pasajeros){
							taxis.push({
								idPk: e.key,
								titulo: e.val().titulo,
								hora: e.val().hora,
								fecha: e.val().fecha,
								precio: e.val().precio,
								pasajeros: e.val().pasajeros,
								pasajerosSubidos: e.val().pasajerosSubidos,
								puntosRecorridos:e.val().puntosRecorridos,
								estado:e.val().estado,
								idConductor: e.val().id,
								inicio: e.val().inicio,
								fin: e.val().fin
							});
						}
					}
				);
				this.setState({taxis});
			});
	}

	DetalleRuta(item){
		this.props.navigation.navigate('VistaViaje',{detalle:item});
	}
	renderTaxis(item,index){
		//let datos = {};
		let datos = {nombre: 'Luis Yerko Laura Tola', fotoTaxi:require("../../../assets/taxi/taxi2.png")};
		// firebase.database().ref().child('users').child(item.idConductor).on('value', s => {
		// 	datos = { nombre: s.val().nombre, fotoTaxi: s.val().fotoTaxi }
		// });
		return(
			<Card
				key={index}
				title={item.titulo}
  				image={datos.fotoTaxi}
  			>
  				<Text style={{marginBottom: 5}}>
			    	{`Conductor: ${datos.nombre}`}
			 	</Text>
  				<Text style={{marginBottom: 5}}>
			    	{`Cantidad: ${item.pasajeros}	Libre: ${item.pasajeros - item.pasajerosSubidos} 	Precio: ${item.precio} Bs`}
			 	</Text>
			 	<Text style={{marginBottom: 5}}>
			    	{`Hora: ${item.hora} `}
			 	</Text>
			 	<Text style={{marginBottom: 10}}>
			    	{`Fecha: ${item.fecha}`}
			 	</Text>

			 	<Button
			 		onPress={()=> this.DetalleRuta(item)}
				    icon={<Icon name={'route'} size={18} color={'white'} />}
				    backgroundColor='#03A9F4'
				    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
				    title='Ruta'
				/>
  			</Card>);
	}

	render(){
		return(
			<BackgroundImage source={require('../../../assets/images/groot.jpg')}>
				<ScrollView>
					{this.state.taxis.map(this.renderTaxis.bind(this))}		
				</ScrollView>
			</BackgroundImage>
		);
	}
}