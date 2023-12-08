import { Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { Button } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const storesCollection = firestore().collection('StoreVisits');

const CameraScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const params: any = useRoute().params;

  useEffect(() => {
    if (!hasPermission)
      requestPermission().then(x => {

      })
  }, [hasPermission]);

  const takePhoto = async () => {
    ToastAndroid.show('Img uploading...', ToastAndroid.SHORT);
    const photo = await camera.current?.takePhoto();
    const result = await fetch(`file://${photo?.path}`);
    const data = await result.blob();
    await uploadFile(data);
    ToastAndroid.show('Img uploaded!', ToastAndroid.SHORT);
  }

  const uploadFile = async (blob: any) => {
    const reference = storage().ref(`/images/${params.storeData.id}/${blob._data.name}`);
    await reference.put(blob);
    const link = await reference.getDownloadURL();
    storesCollection.add({
      downloadLink: link,
      time: new Date().toUTCString()
    })
  }


  return (
    <>
      {(hasPermission && !!device) ?
        <>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />
          <Button style={{ position: 'absolute', bottom: 20, left: '40%' }} mode='elevated' onPress={takePhoto}>Capture</Button>
        </>
        : <View><Text>Camera Error</Text></View>}
    </>

  )
}

export default CameraScreen;

const styles = StyleSheet.create({})