import React, {Component} from 'react';
import { Text, View, Dimensions, StyleSheet} from 'react-native';
import * as firebase from 'firebase';

import MapView, { Marker, Callout,Polyline} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
			precio:params.detalle.precio,
			cantidadPasajero:params.detalle.pasajerosSubidos,
			idPk:params.detalle.idPk,
			inicio:params.detalle.inicio,
			fin: params.detalle.fin,
			ubicacion:params.detalle.coordinate,
			detallePasajero:[],
			recorrido:[]
		};
	}

	iniciarViaje(){
		firebase.database().ref().child(`transporte/${this.state.idPk}`).update({inicio:true})
			.then(() => {
				Toast.showWithGravity('Iniciando el recorrido de ruta', Toast.LONG, Toast.BOTTOM);
				this.setState({inicio:true});
			})
			.catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM));
	}

	finalizarViaje(){
		firebase.database().ref().child(`transporte/${this.state.idPk}`).update({fin:true,estado:0})
			.then(() => {
				Toast.showWithGravity('Recorrido de ruta finalizada', Toast.LONG, Toast.BOTTOM);
				this.setState({fin:true});
			})
			.catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM));
	}

	componentDidMount(){

		firebase.database().ref().child('transporte').child(this.state.idPk)
			.on('value', snap=>{
				let row = snap.val();
				//verificar el error
				this.setState({cantidadPasajero: row.pasajerosSubidos});
				let pasajeros = [];
				if(row.pasajerosSubidos){
					for(e in row.detallePasajero){
						pasajeros.push({
							idPk: e,
							fin: row.detallePasajero[e].fin,
							idUser: row.detallePasajero[e].idUser,
							inicio: row.detallePasajero[e].inicio,
							pago: row.detallePasajero[e].pago,
							precio: row.detallePasajero[e].precio,
							ubicacion:{
								latitude: row.detallePasajero[e].ubicacion.latitude,
								longitude: row.detallePasajero[e].ubicacion.longitude
							}
						});
					}
					this.setState({detallePasajero: pasajeros});
					// this.setState({
					// 	detallePasajero: [
					// 		{	
					// 			idPk: '-LNBAPgvwXq73gXjFPu0',
					// 			fin: false,
					// 			idUser: 452,
					// 			inicio: false,
					// 			pago: false,
					// 			precio: 2.5,
					// 			ubicacion:{latitude: -17.862741327023286, longitude: -63.20177766399195}
					// 		},{
					// 			idPk: '-LNBASChHZ_-kRoK_arF',
					// 			fin: false,
					// 			idUser: 123,
					// 			inicio: false,
					// 			pago: false,
					// 			precio: 2.5,
					// 			ubicacion:{latitude: -17.860422164950617, longitude: -63.1978159739692}
					// 		}
					// 	]
					// });
				}
			});


		this.watchID = navigator.geolocation.watchPosition(
			(position)=>{
				let ubicacion = {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					};
				if(this.state.inicio && !this.state.fin){
					firebase.database().ref().child(`transporte/${this.state.idPk}`).update({recorrido:[...this.state.recorrido,{latitude:ubicacion.latitude,longitude:ubicacion.longitude}]})
					.then(() => {
						this.setState({ ubicacion,recorrido:[...this.state.recorrido,{latitude:ubicacion.latitude,longitude:ubicacion.longitude}] });
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

	renderPasajeros(item){
		if(this.state.detallePasajero.length){
			return(
				<Marker 
					coordinate={item.ubicacion}
					title="Pasajero"
					//image={<Icon name={'taxi'} size={10} color={'blue'}/>}
					image={require('../../assets/icons/personaG1.png')}
				/>);
		}
		return null;
	}

	renderButton(){
		if(!this.state.inicio){
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
		if(this.state.inicio && !this.state.fin){
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

	renderButtonPasajeros(){
		if(this.state.cantidadPasajero){
			return(<Button 
				onPress={()=>this.ListaPasajero()}
				title={this.state.cantidadPasajero.toString()} text={"Lista"}
				buttonStyle={style.button}
				icon={
					<IconFont
						name={'th-list'}
						size={25}
						color={'white'}
					/>
				}></Button>);
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
									image={require('../../assets/icons/startG.png')}
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
									image={require('../../assets/icons/finishG.png')}
								/>
							);	
						}
						return(
							<Marker 
								coordinate={marker.coordinate}
								key={marker.key}
								pinColor={'green'}
								image={require('../../assets/icons/marketG.png')}
							/>
						);
					}
				)}
				{this.state.markers.map(this.renderRuta.bind(this))}
				{this.state.detallePasajero.map(this.renderPasajeros.bind(this))}
				<Polyline coordinates={this.state.recorrido} strokeWidth={4} strokeColor={'red'} />
			</MapView>
			{this.renderButton()}
			{this.renderButtonPasajeros()}
		  </View>
		);
	}

}


