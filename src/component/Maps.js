import React, { Component } from 'react';
import MapView, { Marker} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {Dimensions} from 'react-native';
import Toast from 'react-native-simple-toast';

const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
   height: height,
   width: width,
   justifyContent: 'flex-end',
   alignItems: 'center',
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },
});
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height ;
const LATITUTE_DELTA = 0.0922;
const LONGTITUDE_DELTA = LATITUTE_DELTA * ASPECT_RATIO;


export default class Maps extends Component {
  constructor(props){
    super(props);
    this.state = {
      initialPosition:{
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
      },
      markerPosition:{
        latitude: 0,
        longitude: 0
      }
    }
  }
  wathID: ?number = null;
  componentDidMount(){
    navigator.geolocation.getCurrentPosition((position)=>{
      let lat = parseFloat(position.coords.latitude);
      let long = parseFloat(position.coords.longitude);
      let initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUTE_DELTA,
        longitudeDelta: LONGTITUDE_DELTA
      };

      this.setState({
        initialRegion : initialRegion,
        markerPosition: initialRegion
      });
    }, 
      (error) => Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM),
      {enableHighAccuracy: true, timeout:20000, maximunAge:1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position)=>{
      let lat = parseFloat(position.coords.latitude);
      let long = parseFloat(position.coords.longitude);
      let initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUTE_DELTA,
        longitudeDelta: LONGTITUDE_DELTA
      };
      this.setState({
        initialRegion : initialRegion,
        markerPosition: initialRegion
      });
    })
  }

  componentWillUnmount(){
    nagivator.geolocation.clearWatch(this.watchID);
  }

 render() {
   return (
     <View style={styles.container}>
       <MapView
          draggable
          showsUserLocation
          style={styles.map}
          region= {this.state.initialPosition}
          onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
       >
        <Marker
          coordinate={this.state.markerPosition}
        />
       </MapView>
     </View>
   );
 }
}