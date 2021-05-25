import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  Modal,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Geocoder from 'react-native-geocoding';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import * as ImageManipulator from 'expo-image-manipulator';
import * as Location from 'expo-location';
import * as dingeActions from '../../store/actions/dinge';
import * as imageActions from '../../store/actions/image';

import Colors from '../../constants/Colors';
import CustomButton from '../../components/CustomButton';

import { GOOGLE_MAPS } from '@env';

Geocoder.init(GOOGLE_MAPS);

const SCREEN_WIDTH = Dimensions.get('window').width;

const UploadScreen = (props) => {
  const image = useSelector((state) => state.image.image);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchAnyways, setFetchAnyways] = useState(false);
  const [text, onChangeText] = useState('');
  const [location, setLocation] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [address, setAddress] = useState('');
  // const [count, setCount] = useState(0);
  // const [target, setTarget] = useState(30);

  const dispatch = useDispatch();

  const verifyPermissions = async () => {
    const results = await Location.getForegroundPermissionsAsync();
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

  const awsUpload = async (location) => {
    const awsImage = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 800, height: 800 } }],
      { compress: 0.8 }
    );

    const awsThumb = await ImageManipulator.manipulateAsync(
      image.uri,
      [{ resize: { width: 140, height: 140 } }],
      { compress: 0.4 }
    );

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;

    await dispatch(dingeActions.postDing(text, lat, lng, awsImage, awsThumb));
    await dispatch(dingeActions.getDinge());
    await dispatch(imageActions.resetImage(''));
  };

  const goToMap = () => {
    setIsFetching(false);
    props.navigation.navigate('Map');
  };

  const closeModalHandler = () => {
    setModalVisible(false);
    setIsFetching(false);
  };

  const uploadAnyways = async () => {
    setFetchAnyways(true);
    await awsUpload(location);
    setModalVisible(false);
    goToMap();
  };

  const uploadAddressHandler = () => {
    setAddressModalVisible(true);
  };

  const addressUpload = async () => {
    let location = {
      coords: {
        latitude: null,
        longitude: null,
      },
    };
    if (!address) {
      Alert.alert('No address', 'Please enter address.', [{ text: 'Ok' }]);
      return;
    }
    try {
      setFetchAnyways(true);
      const json = await Geocoder.from(address);
      const coordsGoogle = json.results[0].geometry.location;
      if (coordsGoogle) {
        location.coords.latitude = coordsGoogle.lat;
        location.coords.longitude = coordsGoogle.lng;
        await awsUpload(location);
        setAddressModalVisible(false);
        goToMap();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadGPSHandler = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }

    if (!image) {
      Alert.alert('No Picture!', 'Please take picture.', [{ text: 'Ok' }]);
      return;
    }

    let count = 0;
    let target = 10;
    try {
      setIsFetching(true);
      const getLocation = async () => {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });
        setLocation(location);

        if (count > 6) {
          setModalVisible(true);
        } else if (location.coords.accuracy > target) {
          count = count + 1;
          target = target + 5;
          // console.log('count: ', count);
          // console.log('target: ', target);
          getLocation();
        } else {
          await awsUpload(location);
          setIsFetching(false);
          goToMap();
        }
      };
      await getLocation();
    } catch (err) {
      setIsFetching(false);
      Alert.alert('Could not fetch location!', 'Please try again later.', [
        { text: 'Okay' },
      ]);
      console.log(err.message);
    }
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
              multiline={true}
              value={text}
              placeholder="write description here"
            />
          </View>
          <View styles={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              {isFetching ? (
                <CustomButton
                  color={Colors.primary}
                  style={styles.buttonLoading}
                >
                  <Text style={styles.buttonTextLoading}>Uploading...</Text>
                  <ActivityIndicator color="white" size="small" />
                </CustomButton>
              ) : (
                <CustomButton
                  onSelect={uploadGPSHandler}
                  color={Colors.primary}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>GPS Upload</Text>
                </CustomButton>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                onSelect={uploadAddressHandler}
                color={Colors.primary}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Address Upload</Text>
              </CustomButton>
            </View>
          </View>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Dinge is not able to find an accurate location for you. If you
                  are in a large open space, try turning your WIFI off and
                  restart your phone. Or upload anyways, and move the marker to
                  where you wanted.
                </Text>
                <View>
                  <View
                    style={[
                      styles.buttonContainer,
                      { marginTop: 15, justifyContent: 'center' },
                    ]}
                  >
                    {fetchAnyways ? (
                      <CustomButton
                        style={{ flexDirection: 'row' }}
                        onSelect={uploadAnyways}
                      >
                        <Text style={styles.locateOnMapText}>Uploading...</Text>
                        <ActivityIndicator
                          color="white"
                          size="small"
                          style={{ paddingRight: 15 }}
                        />
                      </CustomButton>
                    ) : (
                      <CustomButton onSelect={uploadAnyways}>
                        <Text style={styles.locateOnMapText}>
                          Upload anyways
                        </Text>
                      </CustomButton>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <CustomButton onSelect={closeModalHandler}>
                      <Text style={styles.locateOnMapText}>Stop upload</Text>
                    </CustomButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={addressModalVisible}
            onRequestClose={() => {
              setAddressModalVisible(!addressModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Enter address</Text>
                <TextInput
                  placeholder="123 main street, mycity..."
                  style={styles.descriptionInput}
                  onChangeText={(text) => setAddress(text)}
                  value={address}
                  autoCapitaliz="words"
                />
                <View
                  style={[
                    styles.buttonContainer,
                    { marginTop: 15, justifyContent: 'center' },
                  ]}
                >
                  {fetchAnyways ? (
                    <CustomButton
                      style={{ flexDirection: 'row' }}
                      onSelect={addressUpload}
                    >
                      <Text style={styles.locateOnMapText}>Uploading...</Text>
                      <ActivityIndicator
                        color="white"
                        size="small"
                        style={{ paddingRight: 15 }}
                      />
                    </CustomButton>
                  ) : (
                    <CustomButton onSelect={addressUpload}>
                      <Text style={styles.locateOnMapText}>Address Upload</Text>
                    </CustomButton>
                  )}
                </View>
                <View style={styles.right}>
                  <MaterialCommunityIcons
                    name="close"
                    size={30}
                    style={styles.iconClose}
                    onPress={() => setAddressModalVisible(!addressModalVisible)}
                  />
                </View>
              </View>
            </View>
          </Modal>
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
  buttonsContainer: {},
  buttonContainer: {
    marginVertical: 8,
    marginBottom: 12,
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoading: {
    width: 200,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'cereal-bold',
    color: 'white',
  },
  buttonTextLoading: {
    fontSize: 20,
    marginRight: 7,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 25,
    paddingBottom: 20,
    marginHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontFamily: 'cereal-medium',
    fontSize: 16,
    textAlign: 'center',
  },
  locateOnMapText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontSize: 19,
  },
  right: {
    alignSelf: 'flex-end',
  },
  iconClose: {},
});

export default UploadScreen;
