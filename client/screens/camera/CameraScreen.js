import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Camera } from 'expo-camera';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as imageActions from '../../store/actions/image';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CameraScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto);
  const [flashIcon, setFlashIcon] = useState('flash-auto');

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

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
    <View style={styles.container}>
      {isFocused && (
        <Camera
          style={styles.cameraContainer}
          type={type}
          ratio="1:1"
          pictureSize="2160x2160"
          whiteBalance="auto"
          autoFocus="on"
          flashMode={flashMode}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        />
      )}

      <View style={styles.cameraInnerView}>
        <View>
          <MaterialCommunityIcons
            name={flashIcon}
            color="white"
            size={40}
            style={styles.flashButton}
            onPress={flashModeHandler}
          />
        </View>
        <TouchableOpacity
          onPress={async () => {
            if (cameraRef) {
              const image = await cameraRef.takePictureAsync({
                quality: 8,
                skipProcessing: true,
              });
              await dispatch(imageActions.setImage(image));
              await props.navigation.navigate('Upload');
            }
          }}
        >
          <View style={styles.shutterRing}>
            <View style={styles.shutterSolid}></View>
          </View>
        </TouchableOpacity>
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
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  cameraInnerView: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: 20,
    //right: -8,
  },
  flashButton: {
    width: 50,
    //alignSelf: 'flex-start',
    //position: 'absolute',
    //top: 22,
    //left: 27,
  },
  flipButton: {
    justifyContent: 'center',
    width: 50,
    borderWidth: 1,
    //marginRight: 15,
    borderRadius: 10,
    borderColor: 'white',
    //alignSelf: 'flex-end',
    //position: 'absolute',
    //bottom: 35,
    height: 38,
    //right: 10,
  },
  flipText: {
    fontSize: 20,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontFamily: 'cereal-bold',
    color: 'white',
  },
  shutterRing: {
    borderWidth: 2,
    borderRadius: 35,
    borderColor: 'white',
    height: 70,
    width: 70,
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
