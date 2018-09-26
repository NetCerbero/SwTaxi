import React, {Component} from 'react';
import { Button, Text, View, FlatList, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // 6.2.2
import {ListItem} from 'react-native-elements';
import * as firebase from 'firebase';
import {NavigationActions} from 'react-navigation';
import TransporteVacio from '../component/TransporteVacio';
import BackgroundImage from '../component/BackgroundImage';

export default class Home extends Component {
	constructor(){
		super();
		this.state = {
			viajes : [{
				coordinate:{
					latitude: 0,
					longitude: 0
				},
				estado: 1,
				fecha: "2018-09-27T04:00:00.000Z",
				fin: false,
				hora: "2018-09-22T12:13:35.484Z",
				idPk: "-LN1UK-W6Hm0Edb0DDn6",//id del registro
				inicio: false,
				pasajeros: 5,
				pasajerosSubidos:0,
				precio: 2.5,
				titulo: "Funciona",
				puntosRecorridos:[
					{
						coordinate:{
							latitude: -17.862952174574044,
							longitude: -63.20211578160525
						},
						key: 0
					},
					{
						coordinate:{
							latitude: -17.86556090790125,
							longitude: -63.192597292363644
						},
						key: 1
					},
					{
						coordinate:{
							latitude: -17.87028429313619,
							longitude: -63.197300881147385
						},
						key: 2	
					},
					{
						coordinate:{
							latitude: -17.874761213783188,
							longitude: -63.19141209125519
						},
						key: 3
					}
				]
			}],
			//viajes:[],
			loaded: true,
		}
		this.refTransporte = firebase.database().ref().child('transporte');
	}

	componentDidMount(){
		this.refTransporte
				.orderByChild('id')
				.equalTo(firebase.auth().currentUser.uid)
				.on('value', snap =>{
					let viajes = [];
					snap.forEach( item => {
						if(item.val().estado){
							viajes.push({
								idPk:item.key,
								titulo:item.val().titulo,
								hora: item.val().hora,
								fecha: item.val().fecha,
								pasajeros: item.val().pasajeros,
								pasajerosSubidos: item.val().pasajerosSubidos,
								precio: item.val().precio,
								inicio: item.val().inicio,
								fin: item.val().fin,
								estado: item.val().estado,
								coordinate: item.val().coordinate,
								puntosRecorridos: item.val().puntosRecorridos
							})
						}
					});
					this.setState({
						viajes,
						loaded:true
					})
				});
	}


	transporteDetalle(transporte){
		this.props.navigation.navigate('DetalleViaje',{detalle:transporte});
	}

	renderTransporte(transporte){
		return(
			<ListItem
				containerStyle={styles.item}
				titleStyle={styles.title}
				title={`${transporte.titulo} (Precio: ${transporte.precio})`}
				subtitle={`Asientos: ${transporte.pasajeros} | Ocupados:  ${transporte.pasajerosSubidos}`}
				//leftAvatar={{source:this.state.restaurant_logo}} 
				onPress={()=> this.transporteDetalle(transporte)}
				rightIcon={{name: 'arrow-right', type:'font-awesome', paddingRight: 10, fontSize: 15, color: 'rgba(255, 0, 0, 0.6)'}}

			/>
		);
	}

	render() {
		const {loaded, viajes} = this.state;
		if(!viajes.length){
			return(
				<BackgroundImage source={require('../../assets/images/luna.jpg')}>
					<TransporteVacio text="No ha programado ninguna ruta"/>
				</BackgroundImage>
			);
		}
		return (
		  <BackgroundImage source={require('../../assets/images/groot2.jpg')}>
				<FlatList
					data={viajes}
					renderItem={(data)=>this.renderTransporte(data.item)}
				/>
			</BackgroundImage>
		);
	}
}

const styles = StyleSheet.create({
	title:{
		color: 'white'
	},
	listIconStyle:{
		paddingRight: 10,
		fontSize: 15,
		color: 'rgba(255, 0, 0, 0.6)'
	},
	item:{
		padding: 0,
		marginTop:5,
		height:60,
		backgroundColor: 'rgba(206, 206, 206, 0.6)'
	}
});