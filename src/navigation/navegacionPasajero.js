import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // 6.2.2
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'; // 1.0.0-beta.27
import * as firebase from 'firebase';

import ListaTaxiScreen from '../screen/pasajero/ListaTaxi';
import VistaViajeScreen from '../screen/pasajero/VistaViaje';
import ViajeRealizadoScreen from '../screen/pasajero/ViajeRealizado';

const rightIcon = () => <Icon name={'logout'}
                      style={{marginRight:20}}
                      size={30}
                      color='white'
                      onPress={() => firebase.auth().signOut() }
                    />;


const TaxisScreenStack = createStackNavigator({
	ListaTaxis:{
		screen: ListaTaxiScreen,
		navigationOptions:{
	        title:'Lista de taxis',
	        headerRight: rightIcon(),
	        headerStyle:{
	          backgroundColor:'rgba(23,32,51,0.85)' 
	        },
	        headerTitleStyle:{
		      textAlign:'center',
		      alignSelf:'center',
		      fontSize:20,
		      color:'#fff',
		      fontWeight:'bold'
		    }
	    }
	},
	VistaViaje:{
		screen: VistaViajeScreen,
		navigationOptions:{
	        title:'Vista del recorrido',
	        headerStyle:{
	        	height:40,
	          	backgroundColor:'rgba(23,32,51,0.85)' 
	        },
	        headerTitleStyle:{
		      textAlign:'center',
		      alignSelf:'center',
		      fontSize:20,
		      color:'#fff',
		      fontWeight:'bold'
		    }
	    }
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