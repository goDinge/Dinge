import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
//import { RNCamera as Camera } from "react-native-camera";

import * as imageActions from '../../store/actions/image';

const CameraScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto);
  const [flashIcon, setFlashIcon] = useState('flash-auto');

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const flashModes = [0, 1, 2, 3];
  const flashIcons = ['flash-off', 'flash', 'flashlight', 'flash-auto'];

  const flashModeHandler = () => {
    //find current index
    const findCurrentIndex = (element) => element === flashIcon;

    let index = flashIcons.findIndex(findCurrentIndex);

    // move one icon up the array
    if (index !== 3) {
      index = index + 1;
    } else {
      index = 0;
    }
    setFlashMode(flashModes[index]);
    setFlashIcon(flashIcons[index]);
  };

  return (
    <View style={styles.cameraContainer}>
      <Camera
        style={styles.cameraContainer}
        type={type}
        ratio="1:1"
        whiteBalance="auto"
        autoFocus="on"
        flashMode={flashMode}
        ref={(ref) => {
          setCameraRef(ref);
        }}
      >
        <View style={styles.cameraInnerView}>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={styles.flipText}>flip</Text>
          </TouchableOpacity>
          <View>
            <MaterialCommunityIcons
              name={flashIcon}
              color="white"
              size={32}
              style={styles.flashButton}
              onPress={flashModeHandler}
            />
          </View>
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={async () => {
              if (cameraRef) {
                const image = await cameraRef.takePictureAsync({
                  skipProcessing: true,
                });
                await dispatch(imageActions.setImage(image));
                await props.navigation.navigate('Upload');
              }
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <View style={styles.shutterRing}>
                <View style={styles.shutterSolid}></View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  cameraInnerView: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  flashButton: {
    alignSelf: 'flex-start',
    position: 'absolute',
    top: 22,
    left: 27,
  },
  flipButton: {
    borderWidth: 1,
    marginRight: 15,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderColor: 'white',
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 35,
    right: 10,
  },
  flipText: {
    fontSize: 20,
    fontFamily: 'cereal-bold',
    color: 'white',
  },
  shutterRing: {
    borderWidth: 2,
    borderRadius: 35,
    borderColor: 'white',
    height: 70,
    width: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterSolid: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: 'white',
    height: 60,
    width: 60,
    backgroundColor: 'white',
  },
});
