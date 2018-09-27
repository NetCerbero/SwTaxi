import React, { Component } from 'react';
import {
  Alert, Dimensions
} from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import Toast from 'react-native-simple-toast';
//import messaging from 'firebase/messaging';
//import storage from 'firebase/storage';
import * as firebase from 'firebase';
import RNFetchBlob from 'rn-fetch-blob';

const Blob = RNFetchBlob.polyfill.Blob;
//const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
//fs.readFile(path, options, callback);
const uploadImage = (uri, imageName, mime = 'image/jpg') => {
  return new Promise((resolve,reject)=>{
    let uploadBlob = null;
    const imageRef = firebase.storage().ref('image').child(imageName);
    //fs.readFile(uri, "base64")
    Blob.build(RNFetchBlob.wrap(uri),{type:`${mime};BASE64`})
      .then((data)=>{
        return Blob.build(data,"base64",{type:`${mime};BASE64`});
        //return Blob.build(RNFetchBlob.wrap(uri),{type:`${mime};BASE64`});
      })
      .then((blob)=>{
        uploadBlob = blob;
        return imageRef.put(blob,{contentType:mime});
      })
      .then(()=>{
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then((url)=>{
        resolve(url);
      })
      .catch((error)=>{
        reject(error);
      })
  })
}

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
    // Toast.showWithGravity(this.state.image_uri, Toast.LONG, Toast.BOTTOM);
    uploadImage(this.state.image_uri,event.image.name)
      .then((responseData)=>{
        firebase.database().ref().child('users').child(firebase.auth().currentUser.uid).update({photoAzure:responseData});
      })
      .catch(e => Toast.showWithGravity(e.message, Toast.LONG, Toast.BOTTOM));
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
