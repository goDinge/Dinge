import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as dingeActions from '../store/actions/dinge';

import Colors from '../constants/Colors';

const UploadScreen = (props) => {
  const image = useSelector((state) => state.image.image);
  const [isFetching, setIsFetching] = useState(false);
  const [userLocation, setUserLocation] = useState({});

  const dispatch = useDispatch();

  const verifyPermissions = async () => {
    const results = await Permissions.askAsync(Permissions.LOCATION);
    if (results.status !== 'granted') {
      Alert.alert(
        'Insufficent permissions!',
        'You need to grant location permissions',
        [{ text: 'Okay' }]
      );
      return false;
    }
    return true;
  };

  const takeImageHandler = () => {
    props.navigation.navigate('Camera');
  };

  const uploadToDingeHandler = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }

    try {
      setIsFetching(true);
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });
      setUserLocation(location);

      const awsImage = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.5, base64: false }
      );

      const awsThumb = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 120, height: 120 } }],
        { compress: 0.3, base64: false }
      );

      const lat = location.coords.latitude;
      const long = location.coords.longitude;
      const latLong = { latitude: lat, longitude: long };

      // console.log('aws-image', awsImage);
      // console.log('aws-thumb', awsThumb);

      await dispatch(
        dingeActions.postDing('home', latLong, awsImage, awsThumb)
      );
    } catch (err) {
      Alert.alert('Could not fetch location!', 'Please try again later.', [
        { text: 'Okay' },
      ]);
      console.log(err.message);
    }
    setIsFetching(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imagePreview}>
          {image !== '' ? (
            <Image style={styles.image} source={{ uri: image.uri }} />
          ) : (
            <Text style={styles.textRegular}>No image taken yet</Text>
          )}
        </View>
        <View style={styles.button}>
          <Button
            title="Take Picture"
            color={Colors.primary}
            onPress={takeImageHandler}
          />
        </View>
        <View style={styles.button}>
          {isFetching ? (
            <ActivityIndicator size="small" />
          ) : (
            <Button
              title="Upload to Dinge"
              color={Colors.primary}
              onPress={uploadToDingeHandler}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20,
  },
  imageContainer: {
    width: '90%',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.gray,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textRegular: {
    fontFamily: 'cereal-light',
  },
  button: {
    marginVertical: 10,
  },
});

export default UploadScreen;
