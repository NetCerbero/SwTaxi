import React, { Component } from 'react';
import {
  Alert, Dimensions
} from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import Toast from 'react-native-simple-toast';
//import messaging from 'firebase/messaging';
//import storage from 'firebase/storage';
import * as firebase from 'firebase';
import {RNFetchBlob} from 'react-native-fetch-blob';

const {width, height} = Dimensions.get('window');

export default class CameraScreen extends Component {
  constructor(){
    super();
    this.state = {
      image_uri : null,
    }
  }

  onBottomButtonPressed(event) {
    // const datos = JSON.stringify(event);
    // Alert.alert(
    //   `${event} button pressed`,
    //   `${datos}`,
    //   [
    //     { text: 'OK', onPress: () => console.log('OK Pressed') },
    //   ],
    //   { cancelable: false }
    // );
    this.setState({image_uri:event.image.uri});
    Toast.showWithGravity(this.state.image_uri, Toast.LONG, Toast.BOTTOM);
  }

  render() {
    return (
      <CameraKitCameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancel' }}
        onBottomButtonPressed={(event) => this.onBottomButtonPressed(event)}
        flashImages={{
          on: require('../../assets/icons/flashon.png'),
          off: require('../../assets/icons/flashoff.png'),
          auto: require('../../assets/icons/flashauto.png')
        }}
        cameraFlipImage={require('../../assets/icons/flip.png')}
        captureButtonImage={require('../../assets/icons/capture.png')}
      />
    );
  }
}
