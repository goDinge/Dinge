import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
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
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

const SCREEN_WIDTH = Dimensions.get('window').width;

const UploadScreen = (props) => {
  const image = useSelector((state) => state.image.image);
  const [isFetching, setIsFetching] = useState(false);

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

      const awsImage = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 600, height: 600 } }],
        { compress: 0.7 }
      );

      const awsThumb = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ resize: { width: 140, height: 140 } }],
        { compress: 0.5 }
      );

      const lat = location.coords.latitude;
      const long = location.coords.longitude;

      await dispatch(
        dingeActions.postDing('balcony', lat, long, awsImage, awsThumb)
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
      <ScrollView>
        <View style={styles.imageContainer}>
          <View style={styles.imagePreview}>
            {image !== '' ? (
              <Image style={styles.image} source={{ uri: image.uri }} />
            ) : (
              <Text style={styles.textRegular}>No image taken yet</Text>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              onSelect={takeImageHandler}
              color={Colors.primary}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Snap Pic</Text>
            </CustomButton>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <CustomInput style={styles.descriptionInput} />
          </View>
          <View style={styles.buttonContainer}>
            {isFetching ? (
              <ActivityIndicator size="small" />
            ) : (
              <CustomButton
                onSelect={uploadToDingeHandler}
                color={Colors.primary}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Upload Pic</Text>
              </CustomButton>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  imagePreview: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
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
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'cereal-bold',
    color: 'white',
  },
  descriptionContainer: {
    marginVertical: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  descriptionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'cereal-medium',
    alignSelf: 'flex-start',
    color: Colors.gray,
  },
  descriptionInput: {},
});

export default UploadScreen;
