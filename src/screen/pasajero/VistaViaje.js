import React, {Component} from 'react';
import { Text, View, Dimensions, StyleSheet} from 'react-native';
import * as firebase from 'firebase';

import MapView, { Marker, Callout,Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
import IconOcticons from 'react-native-vector-icons/Octicons';
import Toast from 'react-native-simple-toast';
//import {NavigationActions} from 'react-navigation';
const {width, height} = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyBtfZupkTUaGoBT11dC8EBv3yfAMtZmSeQ';
const style = StyleSheet.create({
	infoWrapper:{
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0,
		flexDirection: 'row',
		flex:1
	},
	map:{
		...StyleSheet.absoluteFillObject
	},
	button:{
		//backgroundColor: 'rgba(33,149,242,0.6)',
		height: 40,
		borderWidth:0,
		borderRadius: 5,
		marginTop: 5,
		//marginRight:,
	    marginLeft:5,
		width: width/4+13
	},
	buttonClear:{
		backgroundColor: 'rgba(111,38,74,0.6)',
		height: 40,
		position:'absolute',
		borderWidth:0,
		borderRadius: 5,
		marginTop: 5,
		//marginRight:(width/2 - (width/5)/2 ),
	    marginLeft:(width/2 -  (width/5)/2 - width/5 ),
		width: width/5
	}
});

export default class DetalleViaje extends Component {
	constructor(props){
		super(props);
		const {params} = this.props.navigation.state;
		this.state = {
			markers:params.detalle.puntosRecorridos,
			idPk:params.detalle.idPk,
			inicio:params.detalle.inicio,
			fin: params.detalle.fin,
			inicioPasajero: false,
			finPasajero: false,
			reservado:false,
			idDetalleViaje:0,
			pasajeros:params.detalle.pasajeros,
			cantidadPasajero:params.detalle.pasajerosSubidos,
			pagoPasajero: false,
			precioViaje: params.detalle.precio,
			detallePasajero:[],
			recorrido:[]
		};
	}

	iniciarViaje(){
		if(this.state.idDetalleViaje){
			firebase.database().ref().child('transporte').child(this.state.idPk).child('detallePasajero').child(this.state.idDetalleViaje).update({inicio:true})
			.then(() => {
				Toast.showWithGravity('Enviando coordenadas al Conductor', Toast.LONG, Toast.BOTTOM);
				this.setState({inicioPasajero:true});
			})
			.catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM));
		}
	}

	finalizarViaje(){
		firebase.database().ref().child('transporte').child(this.state.idPk).child('detallePasajero').child(this.state.idDetalleViaje).update({fin:true})
			.then(() => {
				Toast.showWithGravity('Finalizando el envio de coordenadas', Toast.LONG, Toast.BOTTOM);
				this.setState({finPasajero:true});
			})
			.catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM));
	}

	ReservarAsiento(){
		if(this.state.cantidadPasajero != this.state.pasajeros){
			firebase.database().ref().child('transporte').child(this.state.idPk).child('detallePasajero').push().update(
				{
					ubicacion:{latitude:0,longitude:0},
					pago:false,
					precio:5,
					idUser:firebase.auth().currentUser.uid,
					inicio:false,
					fin:false
				}
			);

			firebase.database().ref().child('transporte').child(this.state.idPk)
				.update(
					{
						pasajerosSubidos : this.state.cantidadPasajero + 1
					}
				);
		}else{
			Toast.showWithGravity("Transporte lleno", Toast.LONG, Toast.BOTTOM)
		}
	}

	componentDidMount(){

		firebase.database().ref().child('transporte').child(this.state.idPk)
			.on('value', snap=>{
				let row = snap.val();
				if(row.inicio && !row.fin && row.recorrido){
					this.setState({
						recorrido:row.recorrido,
						cantidadPasajero: row.pasajerosSubidos,
						pasajeros:row.pasajeros
					});
				}
				if(row.pasajerosSubidos){
					let i = 0;
					for(e in row.detallePasajero){
						i++;
						if(row.detallePasajero[e].idUser == firebase.auth().currentUser.uid){
							this.setState({
								reservado:true, 
								inicioPasajero:row.detallePasajero[e].inicio,
								finPasajero:row.detallePasajero[e].fin,
								pagoPasajero:row.detallePasajero[e].pago,
								precioViaje:row.detallePasajero[e].precio,
								idDetalleViaje:e
							});
							//Toast.showWithGravity("pasajero encontrado", Toast.LONG, Toast.BOTTOM);
						}
					};
					this.setState({cantidadPasajero: i});
				}
			});


		this.watchID = navigator.geolocation.watchPosition(
			(position)=>{
				let ubicacion = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};
				if(this.state.inicioPasajero && !this.state.finPasajero){
					firebase.database().ref().child(`transporte/${this.state.idPk}/detallePasajero/${this.state.idDetalleViaje}`).update({ubicacion:{latitude:ubicacion.latitude,longitude:ubicacion.longitude}})
					.then(() => {
						
					})
					.catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM));
				}
			},
			(error) =>Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM) ,
			{enableHighAccuracy:true,timeout:20000,maximumAge:1000, distanceFilter: 10}
		);
	}

	componentWillUnmount(){
		navigator.geolocation.clearWatch(this.watchID);
	}

	renderRuta(item, index){
		if((this.state.markers.length >= 2) && (index < this.state.markers.length - 1) ){
			return(
				<MapViewDirections
					key={index}
		            origin={this.state.markers[index].coordinate}
		            destination={this.state.markers[index + 1].coordinate}
		            apikey={GOOGLE_MAPS_APIKEY}
		            strokeWidth={3}
		            strokeColor="hotpink"
		        />
		    );
		}
		return null;
	}

	renderBotonReserva(){
		if(!this.state.reservado ){
			return(<Button
					onPress={()=>this.ReservarAsiento()}
					title={"Reservar"}
					text={"iniciar"}
					buttonStyle={style.reserva}
					icon={
						<MaterialC
							name={'seat-recline-extra'}
							size={25}
							color={'white'}
						/>
					}

				></Button>);
		}
		return null;
	}
	renderButton(){
		if(!this.state.inicioPasajero && this.state.reservado){
			return(<Button
					onPress={()=>this.iniciarViaje()}
					title={"Iniciar"}
					text={"iniciar"}
					buttonStyle={style.button}
					icon={
						<Icon
							name={'traffic-light'}
							size={25}
							color={'white'}
						/>
					}

				></Button>);
		}
		if(this.state.inicioPasajero && !this.state.finPasajero && this.state.reservado){
			return (<Button
						onPress={()=>this.finalizarViaje()}
						title={"Finalizar"}
						text={"Finalizar"}
						buttonStyle={style.button}
						icon={
							<IconOcticons
								name={'stop'}
								size={25}
								color={'white'}
							/>
						}
					></Button>);
		}
		return null;
	}

	ListaPasajero(){
		this.props.navigation.navigate('ListaPasajeros',{idPk:this.state.idPk});
	}

	renderTaxi(){
		if(this.state.recorrido.length>0){
			return(<Marker 
				coordinate={this.state.recorrido[this.state.recorrido.length-1]}
				title="Taxi"
				//image={<Icon name={'taxi'} size={10} color={'blue'}/>}
				image={require('../../../assets/icons/carG.png')}
			/>);
		}
		return null;
	}

	render() {
		return (
		  <View style={{flex:1}}>
		  	<MapView
		  		style={style.map}
		  		showsUserLocation={true}
		  		followsUserLocation={true}
				initialRegion={{
					latitude: this.state.markers[0].coordinate.latitude,//-17.7862892,
					longitude:  this.state.markers[0].coordinate.longitude,//-63.1811714,
					latitudeDelta: 0.02,
					longitudeDelta: 0.02
				}}
				ref={c => this.mapView = c}
			>
				{this.state.markers.map((marker,index)=>{
						if(index == 0){
							return(
								<Marker 
									coordinate={marker.coordinate}
									key={marker.key}
									pinColor={'green'}
									title="Inicio"
									image={require('../../../assets/icons/startG.png')}
								/>
							);
						}
						if(index == this.state.markers.length - 1){
							return(
								<Marker 
									coordinate={marker.coordinate}
									key={marker.key}
									pinColor={'green'}
									title="Fin"
									image={require('../../../assets/icons/finalG.png')}
								/>
							);	
						}
						return(
							<Marker 
								coordinate={marker.coordinate}
								key={marker.key}
								pinColor={'green'}
								//image={require('../../assets/icons/car-marker.png')}
							/>
						);
					}
				)}
				{this.state.markers.map(this.renderRuta.bind(this))}
				<Polyline coordinates={this.state.recorrido} strokeWidth={4} strokeColor={'blue'} />
				{this.renderTaxi()}
			</MapView>
			{this.renderBotonReserva()}
			{this.renderButton()}
		  </View>
		);
	}

}


