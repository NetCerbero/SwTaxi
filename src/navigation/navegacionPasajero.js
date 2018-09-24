import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5'; // 6.2.2
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'; // 1.0.0-beta.27


import ListaTaxiScreen from '../screen/pasajero/ListaTaxi';
import VistaViajeScreen from '../screen/pasajero/VistaViaje';
import ViajeRealizadoScreen from '../screen/pasajero/ViajeRealizado';

const TaxisScreenStack = createStackNavigator({
	ListaTaxis:{
		screen: ListaTaxiScreen
	},
	VistaViaje:{
		screen: VistaViajeScreen
	}
});

export default createBottomTabNavigator({
	Taxis:{
		screen: TaxisScreenStack,
		navigationOptions:{
	      title: "Taxis",
	      tabBarIcon:({tintColor}) => (
	          <Icon name="taxi" color={tintColor} size={24} />
	        )
	    }
	},
	Historial:{
		screen: ViajeRealizadoScreen,
		navigationOptions:{
	      title: "Historial",
	      tabBarIcon:({tintColor}) => (
	          <Icon name="list" color={tintColor} size={24} />
	        )
	    }
	}
},{
  initialRouteName: 'Taxis',
  order:['Taxis','Historial'],
  tabBarOptions:{
    activeTintColor: '#F8F8F8', // active icon color
    inactiveTintColor: '#586589',  // inactive icon color
    style: {
        backgroundColor: '#171F33' // TabBar background
    }
  }
});