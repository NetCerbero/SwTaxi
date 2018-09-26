import React from 'react';
import MaterialC from 'react-native-vector-icons/MaterialCommunityIcons'; // 6.2.2
import Icon from 'react-native-vector-icons/FontAwesome'; // 6.2.2
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation'; // 1.0.0-beta.27
import * as firebase from 'firebase';
//los componentes
import HomeScreen from '../screen/Home';
import PublicacionScreen from '../screen/Publicacion';
import ViajesScreen from '../screen/Viajes';
import DetalleViajeScreen from '../screen/DetalleViaje';
import DetallePasajeroScreen from '../screen/DetallePasajero';
import LogOutScreen from '../screen/logout';
import TransporteForm from '../screen/TransporteForm';
import PruebaScreen from '../component/Prueba';

const navigationOptions = {
  navigationOptions:{
    headerStyle:{
      backgroundColor:'rgba(200, 38, 74, 1)' 
    },
    headerTitleStyle:{
      textAlign:'center',
      alignSelf:'center',
      fontSize:20,
      color:'#fff',
      fontWeight:'bold'
    }
  }
};


const leftIcon = (navigation, icon) => <Icon name={icon}
                      style={{marginLeft:20}}
                      size={30}
                      color='white'
                      //onPress={() => navigation.navigate()}
                    />;

const rightIcon = (navigation) => <MaterialC name={'logout'}
                      style={{marginRight:20}}
                      size={30}
                      color='white'
                      onPress={() => navigation.navigate('logout') }
                    />;

const HomeScreenStack = createStackNavigator(
  {
    HomeTransporte: {
      screen: HomeScreen,
      navigationOptions:({navigation})=>({
        title:'SwUber Programados',
        headerRight: rightIcon(navigation)
      })
    },
    DetalleViaje:{
      screen: DetalleViajeScreen,
      navigationOptions:{
        title:'Detalle Viaje',
        headerStyle:{
          height:40,
          backgroundColor:'rgba(23,32,51,0.85)' 
        },
      }
    },
    ListaPasajeros:{
      screen: DetallePasajeroScreen,
      navigationOptions:{
        title:'Pasajeros',
        headerStyle:{
          backgroundColor:'rgba(200, 38, 74, 1)' 
        },
      }
    },
    logout:{screen:LogOutScreen}
  },
  navigationOptions
);


const TransporteScreenStack = createStackNavigator(
  {
    MapaTransporte: {
      screen: PruebaScreen,
      navigationOptions :{
         header:null
      }
    },
    FormTransporte:{
      screen:TransporteForm,
      navigationOptions:{
        title:'Formulario de viajes',
        headerStyle:{
          backgroundColor:'rgba(200, 38, 74, 1)' 
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
  }
);




export default createBottomTabNavigator({
  Home:{
    screen: HomeScreenStack,
    navigationOptions:{
      title: "Home",
      tabBarIcon:({tintColor}) => (
          <Icon name="home" color={tintColor} size={24} />
        )
    }
  },
  Transporte:{
    screen: TransporteScreenStack,
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
  initialRouteName: 'Viaje',
  order:['Home','Transporte','Viaje'],
  tabBarOptions:{
    activeTintColor: '#F8F8F8', // active icon color
    inactiveTintColor: '#586589',  // inactive icon color
    style: {
        backgroundColor: '#171F33' // TabBar background
    }
  }
});