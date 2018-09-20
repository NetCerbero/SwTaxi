import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome'; // 6.2.2
import { createBottomTabNavigator } from 'react-navigation'; // 1.0.0-beta.27

//los componentes
import HomeScreen from '../screen/Home';
import PublicacionScreen from '../screen/Publicacion';
import ViajesScreen from '../screen/Viajes';
import PruebaScreen from '../component/Prueba';


export default createBottomTabNavigator({
  Home:{
    screen: HomeScreen,
    navigationOptions:{
      title: "Home",
      tabBarIcon:({tintColor}) => (
          <Icon name="home" color={tintColor} size={24} />
        )
    }
  },
  Transporte:{
    screen: PruebaScreen,
    navigationOptions:{
      title: "Programar",
      tabBarIcon:({tintColor}) => (
          <Icon name="road" color={tintColor} size={24} />
        )
    }
  },
  Viaje:{
    screen: ViajesScreen,
    navigationOptions:{
      title: "Viaje",
      tabBarIcon:({tintColor}) => (
          <Icon name="feed" color={tintColor} size={24} />
        )
    }
  }
},{
  initialRouteName: 'Transporte',
  order:['Home','Transporte','Viaje'],
  tabBarOptions:{
    activeTintColor: '#F8F8F8', // active icon color
    inactiveTintColor: '#586589',  // inactive icon color
    style: {
        backgroundColor: '#171F33' // TabBar background
    }
  }
});