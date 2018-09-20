import React, {Component} from 'react';
import { Button, Text, View } from 'react-native';
import * as firebase from 'firebase';
export class DetalleViaje extends Component {
  render() {
    return (
      <Text>{firebase.auth().currentUser.uid}</Text>
    );
  }
}