import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  TextInput,
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

import * as dingeActions from '../../store/actions/dinge';
import * as imageActions from '../../store/actions/image';

import Colors from '../../constants/Colors';
import CustomButton from '../../components/CustomButton';

const SCREEN_WIDTH = Dimensions.get('window').width;

const UploadScreen = (props) => {
  const image = useSelector((state) => state.image.image);
  const [isFetching, setIsFetching] = useState(false);
  const [text, onChangeText] = useState('');

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
        dingeActions.postDing(text, lat, long, awsImage, awsThumb)
      );
      await dispatch(dingeActions.getDinge());
      await dispatch(imageActions.resetImage(''));
    } catch (err) {
      Alert.alert('Could not fetch location!', 'Please try again later.', [
        { text: 'Okay' },
      ]);
      console.log(err.message);
    }
    setIsFetching(false);
    props.navigation.navigate('Map');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePreview}>
            {image !== '' ? (
              <Image style={styles.image} source={{ uri: image.uri }} />
            ) : (
              <View style={styles.buttonContainer}>
                <CustomButton
                  onSelect={takeImageHandler}
                  color={Colors.primary}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Snap Pic</Text>
                </CustomButton>
              </View>
            )}
          </View>
          {image ? (
            <View style={styles.buttonContainer}>
              <CustomButton
                onSelect={takeImageHandler}
                color={Colors.primary}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Re-take Pic</Text>
              </CustomButton>
            </View>
          ) : null}

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              onChangeText={(text) => onChangeText(text)}
              value={text}
            />
          </View>
          <View style={styles.buttonContainer}>
            {isFetching ? (
              <ActivityIndicator size="large" color={Colors.primary} />
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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 40,
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
    marginVertical: 8,
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
    marginVertical: 8,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  descriptionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: 'cereal-medium',
    alignSelf: 'flex-start',
    color: Colors.gray,
  },
  descriptionInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    width: '100%',
    fontFamily: 'cereal-light',
    fontSize: 16,
    color: Colors.gray,
  },
});

export default UploadScreen;
