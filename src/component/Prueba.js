import React, { Component } from 'react';
import MapView, { Marker} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {Dimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import MapViewDirections from 'react-native-maps-directions';


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
		if(this.state.ladAddedMarker > now - 5000){
			return;
		}

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
			</View>
		);
	}
}