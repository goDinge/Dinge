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
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import * as imageActions from '../../store/actions/image';

const SCREEN_WIDTH = Dimensions.get('window').width;

const CameraScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.auto);
  const [flashIcon, setFlashIcon] = useState('flash-auto');

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    setIsLoading(false);
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

  if (isLoading) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
        <MaterialCommunityIcons
          name={flashIcon}
          color="white"
          size={38}
          style={styles.flashButton}
          onPress={flashModeHandler}
        />
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
          <MaterialIcons name="flip-camera-ios" color="white" size={40} />
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
  indicatorContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  flashButton: {
    right: -5,
    width: 50,
  },
  flipButton: {
    alignItems: 'center',
    width: 50,
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
