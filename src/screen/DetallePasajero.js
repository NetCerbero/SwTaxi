import React, {Component} from 'react';
import { Button, Text, View, FlatList, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 6.2.2
import {ListItem, Card} from 'react-native-elements';
import * as firebase from 'firebase';
import {NavigationActions} from 'react-navigation';
import BackgroundImage from '../component/BackgroundImage';

export default class DetallePasajero extends Component{
	constructor(props){
		super(props);
		this.state = {
			//pasajeros: this.props.navigation.state.params.detallePasajero,
			pasajeros:[],
			cuenta: 0,
			idPkViaje: this.props.navigation.state.params.idPk
		}
	}
	// <FlatList
	// 				data={viajes}
	// 				renderItem={(data)=>this.renderTransporte(data.item)}
	// 			/>

	componentDidMount(){
		
		firebase.database().ref().child('transporte').child(this.state.idPkViaje)
			.child('detallePasajero').on('value', s =>{ 
				let pasajeros = [];
				s.forEach(e =>{
						pasajeros.push({
							idPk: e.key,
							fin: e.val().fin,
							idUser: e.val().idUser,
							inicio: e.val().inicio,
							pago: e.val().pago,
							precio: e.val().precio,
							ubicacion:{latitude: e.val().ubicacion.latitude, longitude: e.val().ubicacion.longitude}
						});
					} 
				);
				this.setState({pasajeros});
			});
	}

	cobrar(){

	}
	renderCard(item){
		return(
			<Card
				key={item.key}
				title='nombre pasajero'
  				image={require('../../assets/pasajero/av5.jpg')}
  			>
  				<Text style={{marginBottom: 10}}>
			    	{`Precio pasaje: ${item.precio}	    Cancelado: ${(item.pago)? 'Si': 'No'}`}
			 	</Text>
			 	{(!item.pago)&&(<Button
			 		onPress={()=> this.cobrar()}
				    icon={<Icon name='code' color='#ffffff' />}
				    backgroundColor='#03A9F4'
				    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
				    title='Cobrar'
				/>)}
  			</Card>
		)
	}
	render() {
		return (
		 	<BackgroundImage source={require('../../assets/images/groot.jpg')}>
				<ScrollView>
					{this.state.pasajeros.map(this.renderCard.bind(this))}					
				</ScrollView>
			</BackgroundImage>
		);
	}
}