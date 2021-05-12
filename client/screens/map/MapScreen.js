import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';

import CustomButton from '../../components/CustomButton';
import CustomMarker from '../../components/CustomMarker';
import CustomBlueMarker from '../../components/CustomBlueMarker';
import CustomCameraIcon from '../../components/CustomCameraIcon';
import CustomReloadIcon from '../../components/CustomReloadIcon';
import CustomCompassIcon from '../../components/CustomCompassIcon';
import Colors from '../../constants/Colors';

import * as dingeActions from '../../store/actions/dinge';
import * as authActions from '../../store/actions/auth';
import * as eventsActions from '../../store/actions/events';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MapScreen = (props) => {
  const [error, setError] = useState(undefined);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(location);
  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const dinge = useSelector((state) => state.dinge.dinge);
  const events = useSelector((state) => state.events.events);
  const authUser = useSelector((state) => state.auth.authUser);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      getLocation();
    })();
  }, []);

  const regionData = (location) => {
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.015,
    };
  };

  const getLocation = async () => {
    setMapLoaded(false);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation(location);
      setRegion(regionData(location));
      if (count > 6) {
        //after too many attempts, just set location and launch app anyways
        setRegion(regionData(location));
        loadData(location);
        setMapLoaded(true);
        setModalVisible(true);
      } else if (location.coords.accuracy > 30) {
        //if accuracy is over 30, rerun
        getLocation();
        setCount(count + 1);
        console.log('count: ', count);
      } else {
        //if not too many attempts and accuracy at or below 30
        setRegion(regionData(location));
        loadData(location);
        setMapLoaded(true);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const loadData = async (location) => {
    setError(null);
    try {
      await dispatch(dingeActions.getLocalDinge(location));
      await dispatch(eventsActions.getEvents());
      await dispatch(authActions.getAuthUser());
    } catch (err) {
      setError(err.message);
    }
  };

  const selectDingHandler = (item) => {
    props.navigation.navigate('Ding', item);
  };

  const selectCameraHandler = () => {
    props.navigation.navigate('Upload');
  };

  //need to fix lack of back button when going to a specific event from Map Screen
  //immediately after the app loads
  //maybe this bug occurs because there is no screen to go 'back' to
  //when Event Details Screen is called first
  const selectEventHandler = (item) => {
    props.navigation.navigate('Events', {
      screen: 'Event Details',
      params: item,
    });
  };

  const closeModalHandler = () => {
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

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <MapView
        style={styles.map}
        region={region}
        minZoomLevel={13}
        maxZoomLevel={18}
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
      </MapView>
      <View style={styles.buttonContainer}>
        <CustomCameraIcon onSelect={selectCameraHandler} />
      </View>
      <View style={styles.compassContainer}>
        <CustomCompassIcon onSelect={compassHandler} />
      </View>
      <View style={styles.reloadContainer}>
        <CustomReloadIcon onSelect={() => reloadHandler(location)} />
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            seConfirmVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Dinge is not able to find an accurate location for you. If you
                are in a large open space, try turning your WIFI off and
                restarting your phone.
              </Text>
              <View style={styles.modalButtonContainer}>
                <CustomButton onSelect={closeModalHandler}>
                  <Text style={styles.locateOnMapText}>Okay</Text>
                </CustomButton>
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
  locateOnMapText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  right: {
    width: '100%',
    alignSelf: 'flex-end',
  },
});

export default MapScreen;
