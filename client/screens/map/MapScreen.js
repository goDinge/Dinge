import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Modal,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Circle } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';

import CustomButton from '../../components/CustomButton';
import CustomMarker from '../../components/CustomMarker';
import CustomBlueMarker from '../../components/CustomBlueMarker';
import CustomReloadIcon from '../../components/CustomReloadIcon';
import CustomCompassIcon from '../../components/CustomCompassIcon';
import CustomMessageModal from '../../components/CustomMessageModal';
//import CustomCameraIcon from '../../components/CustomCameraIcon';

import Colors from '../../constants/Colors';

import * as dingeActions from '../../store/actions/dinge';
import * as authActions from '../../store/actions/auth';
import * as eventsActions from '../../store/actions/events';
import * as locationActions from '../../store/actions/location';
import * as messageActions from '../../store/actions/message';

const mapStyle = require('../../helpers/mapStyle.json');
const settingConfigs = require('../../settingConfigs.json');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MapScreen = (props) => {
  const [error, setError] = useState(undefined);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation] = useState({});
  const [region, setRegion] = useState(location);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [address, setAddress] = useState('');
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const dinge = useSelector((state) => state.dinge.dinge);
  const events = useSelector((state) => state.events.events);
  const authUser = useSelector((state) => state.auth.authUser);
  const messageState = useSelector((state) => state.message.message);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied. ');
        return;
      }
      getLocation();
    })();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  useEffect(() => {
    if (messageState) {
      setModalVisible(true);
      setModalMessage(messageState);
    }
  }, [messageState]);

  const addressLocation = () => {
    setAddressModal(true);
  };

  const addressSearch = async (address) => {
    setError(null);
    setIsAddressLoading(true);
    try {
      const location = await Location.geocodeAsync(address); //returns array (of 1 element)
      location.coords = location[0];
      setLocation(location);
      setRegion(regionData(location));
      setIsAddressLoading(false);
      setAddressModal(false);
    } catch (err) {
      setError(err.message);
    }
    setAddress('');
    setIsAddressLoading(false);
    setAddressModal(false);
  };

  const regionData = (location) => {
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
  };

  let count = 0;
  let target = 15;
  //remember: useEffect calls getLocation(), loadData() gets called inside getLocation
  const getLocation = async () => {
    setError(null);
    setMapLoaded(false);

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      if (!location) {
        //if can't find any location, ask user to enter address
        addressLocation();
        setMapLoaded(true);
      }
      setLocation(location);
      //await dispatch(locationActions.setLocation(location));
      if (count > settingConfigs[1].count) {
        //after too many attempts for accurate location, just set location and launch app anyways
        await dispatch(locationActions.setLocation(location));
        setRegion(regionData(location));
        loadData(location);
        setMapLoaded(true);
        setModalVisible(true);
        setModalMessage(
          'Dinge is not able to find an accurate location for you. If you are in a large open space, try turning your WIFI off and restarting your phone.'
        );
        return;
      } else if (location.coords.accuracy > target) {
        //if accuracy is over dynamic target, rerun
        count = count + 1;
        target = target + 5;
        getLocation();
      } else {
        //if not too many attempts and accuracy at or below target
        await dispatch(locationActions.setLocation(location));
        setRegion(regionData(location));
        loadData(location);
        setMapLoaded(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const loadData = async (location) => {
    setError(null);
    try {
      await dispatch(dingeActions.getLocalDinge(location));
      await dispatch(eventsActions.getLocalEvents(location));
      await dispatch(authActions.getAuthUser());
    } catch (err) {
      setError(err.message);
    }
  };

  const selectDingHandler = (item) => {
    props.navigation.navigate('Ding', item);
  };

  // const selectCameraHandler = () => {
  //   props.navigation.navigate('Camera');
  // };

  const selectEventHandler = (item) => {
    props.navigation.navigate('Event Details', item);
  };

  const closeModalHandler = async () => {
    setError(null);
    try {
      await dispatch(messageActions.resetMessage());
    } catch (err) {
      setError(err.message);
    }
    setModalMessage('');
    setModalVisible(false);
  };

  const reloadHandler = async (location) => {
    setMapLoaded(false);
    await loadData(location);
    setMapLoaded(true);
  };

  const compassHandler = async () => {
    setMapLoaded(false);
    await getLocation();
    setMapLoaded(true);
  };

  const now = new Date(Date.now()).getTime();

  if (!mapLoaded || !location || !authUser) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  //current mapStyle - retro eco
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <MapView
        style={styles.map}
        region={region}
        minZoomLevel={13}
        maxZoomLevel={18}
        customMapStyle={mapStyle}
      >
        {isFocused &&
          dinge.map((item, index) => (
            <CustomMarker
              key={index}
              data={item}
              onSelect={() => selectDingHandler(item)}
            />
          ))}
        {isFocused &&
          events.map((item, index) => {
            if (
              new Date(item.date).getTime() < now &&
              new Date(item.endDate).getTime() > now
            ) {
              return (
                <CustomMarker
                  key={index}
                  data={item}
                  onSelect={() => selectEventHandler(item)}
                />
              );
            }
          })}
        {isFocused && location ? (
          <CustomBlueMarker data={location} user={authUser} />
        ) : null}
        <Circle
          center={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          radius={settingConfigs[0].radius * 1000}
          strokeColor={Colors.primary}
          fillColor={'rgba(0, 166, 153, 0.05)'}
        />
      </MapView>
      {/* <View style={styles.buttonContainer}>
        <CustomCameraIcon onSelect={selectCameraHandler} />
      </View> */}
      <View style={styles.compassContainer}>
        <CustomCompassIcon onSelect={compassHandler} />
      </View>
      <View style={styles.reloadContainer}>
        <CustomReloadIcon onSelect={() => reloadHandler(location)} />
      </View>
      {/* MODALS */}
      <CustomMessageModal
        message={modalMessage}
        messageModal={modalVisible}
        onClose={closeModalHandler}
      />
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={addressModal}
          onRequestClose={() => {
            setAddressModal(!addressModal);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Dinge is not able to find an accurate location for you with GPS.
                Please enter your location or address here.
              </Text>
              <TextInput
                placeholder="123 main street, mycity..."
                style={styles.textInput}
                onChangeText={(text) => setAddress(text)}
                value={address}
                autoCapitaliz="words"
              />
              <View style={styles.modalButtonContainer}>
                {isAddressLoading ? (
                  <CustomButton
                    style={styles.buttonFlexRow}
                    onSelect={() => addressSearch(address)}
                  >
                    <Text style={styles.buttonText}>Loading...</Text>
                    <ActivityIndicator color="white" size="small" />
                  </CustomButton>
                ) : (
                  <CustomButton onSelect={() => addressSearch(address)}>
                    <Text style={styles.buttonText}>Search</Text>
                  </CustomButton>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  buttonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  reloadContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  compassContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  modalView: {
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
  textInput: {
    borderColor: '#dddddd',
    borderRadius: 10,
    borderWidth: 0.5,
    fontSize: 16,
    fontFamily: 'cereal-light',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 8,
    fontSize: 16,
  },
  modalButtonContainer: {
    width: 170,
    marginVertical: 5,
  },
  buttonFlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  right: {
    width: '100%',
    alignSelf: 'flex-end',
  },
});

export default MapScreen;

// backup code for using a default location to open mapscreen, instead of asking user for address
// setLocation(settingConfigs[2].defaultLocation.coords);
// await dispatch(
//   locationActions.setLocation(settingConfigs[2].defaultLocation.coords)
// );
// setRegion(regionData(settingConfigs[2].defaultLocation.coords));
// Alert.alert(
//   'Location not found.',
//   'Please either turn off your WIFI and restart your phone, or do not use any GPS functionalities. Our apologies.',
//   [{ text: 'Okay' }]
// );
