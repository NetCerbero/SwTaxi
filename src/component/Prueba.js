import React, { Component } from 'react';
import MapView, { Marker, Callout} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {Dimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import MapViewDirections from 'react-native-maps-directions';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationActions} from 'react-navigation';
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
		backgroundColor: 'rgba(111,38,74,0.6)',
		height: 40,
		position:'absolute',
		borderWidth:0,
		borderRadius: 5,
		marginTop: 5,
		marginRight:(width/2 - (width/5)/2 ),
	    marginLeft:(width/2 -  (width/5)/2 ),
		width: width/5
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

let id = 0;

export default class Prueba extends Component{
	constructor(props){
		super(props);
		this.state = {
			markers:[]
		};
	}

	addMarker(coordinate){
		let now = (new Date).getTime();
		// if(this.state.ladAddedMarker > now - 5000){
		// 	return;
		// }

		this.setState({
			markers: [
				...this.state.markers,{
					coordinate:coordinate,
					key: id++
				}
			],
			ladAddedMarker:now
		});
	}

	deleteMarker(id){
		let {markers} = this.state;
		markers.forEach(
			function(currentValue, index, arr){
		  		if(markers[index].key == id){
		      		markers.splice(index, 1);     
		   		}
		  	}
		);
		this.setState({markers:markers});
	}

	continuarFormulario(){
		// const navigateAction = NavigationActions.navigate({
 	// 		routeName: 'FormTransporte'
 	// 	});
 	// 	this.props.navigation.dispatch(navigateAction); 
 		// this.continuarFormulario.bind(this)
 		this.props.navigation.navigate('FormTransporte',{puntos:this.state.markers});
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

	render(){
		return(
			<View style={{flex:1}}>
				<MapView style={style.map}
					showsUserLocation={true}
					followsUserLocation={true}
					//showsUserLocation={true}
     				showsMyLocationButton={true}
					initialRegion={{
						latitude:-17.867658,
						longitude: -63.197338,
						latitudeDelta: 0.02,
						longitudeDelta: 0.02
					}}
					ref={c => this.mapView = c}
					onPress={(e) => this.addMarker(e.nativeEvent.coordinate)}
					//onLongPress={(e) => this.addMarker(e.nativeEvent.coordinate)}
				>
					{this.state.markers.map((marker)=>(
						<Marker 
							coordinate={marker.coordinate}
							key={marker.key}
							onPress={()=>this.deleteMarker(marker.key)}
							pinColor={'green'}
							//image={require('../../assets/icons/car-marker.png')}
						/>
					))}
					{this.state.markers.map(this.renderRuta.bind(this))}
				</MapView>
				<Button
					onPress={this.continuarFormulario.bind(this)}
					buttonStyle={style.button}
					title={""}
					text={"Luis"}
					icon={
						<Icon
							name={'taxi'}
							size={25}
							color={'white'}
						/>
					}
				>
				</Button>	
				
				<Button
					onPress={()=>(this.setState({markers:[]}))}
					buttonStyle={style.buttonClear}
					title={""}
					text={"Luis"}
					icon={
						<Icon
							name={'trash'}
							size={25}
							color={'white'}
						/>
					}
				>
				</Button>	

			</View>
		);
	}
}