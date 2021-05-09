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
import Colors from '../../constants/Colors';

import * as dingeActions from '../../store/actions/dinge';
import * as authActions from '../../store/actions/auth';
import * as eventsActions from '../../store/actions/events';

import { getLocationFn } from '../../helpers/locations';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MapScreen = (props) => {
  const [error, setError] = useState(undefined);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(location);
  const [modalVisible, setModalVisible] = useState(false);

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

      let count = 0;
      const getLocation = async () => {
        let location;
        try {
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          if (count > 9) {
            //after too many attempts, just set location and launch app anyways
            setLocation(location);
            //console.log('count over 9', location);
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025,
            });
            setModalVisible(true);
            return;
          } else if ((location != null && location.coords.accuracy) > 30) {
            //if accuracy is over 30, rerun
            getLocation();
            count = count + 1;
            // console.log('reran', location.coords.accuracy);
            // console.log('count', count);
          } else {
            //if not too many attempts and accuracy at or below 30
            setLocation(location);
            // console.log(location);
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.025,
              longitudeDelta: 0.025,
            });
            return;
          }
        } catch (err) {
          console.log(err.message);
        }
      };
      getLocation();
      try {
        //const x = getLocationFn();
        getLocationFn().then((resp) => console.log(resp));
      } catch (err) {
        console.log(err.message);
      }
    })();
  }, []);

  useEffect(() => {
    loadData();
    setMapLoaded(true);
  }, [setMapLoaded]);

  const loadData = async () => {
    setError(null);
    try {
      await dispatch(dingeActions.getDinge());
      await dispatch(eventsActions.getEvents());
      await dispatch(authActions.getAuthUser());
    } catch (err) {
      setError(err.message);
    }
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const selectDingHandler = (item) => {
    props.navigation.navigate('Ding', item);
  };

  const selectCameraHandler = () => {
    props.navigation.navigate('Upload');
  };

  const selectEventHandler = (item) => {
    props.navigation.navigate('Events', {
      screen: 'Event Details',
      params: item,
    });
  };

  const closeModalHandler = () => {
    setModalVisible(false);
  };

  const reloadHandler = () => {
    loadData();
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
      <View style={styles.reloadContainer}>
        <CustomReloadIcon onSelect={reloadHandler} />
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
                are in a large open space, try turning your WIFI off.
              </Text>
              <View style={styles.modalButtonContainer}>
                <CustomButton onSelect={() => closeModalHandler()}>
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

//export default MapScreen;

// Location.installWebGeolocationPolyfill();
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(
//     (location) => console.log(location),
//     (error) => console.log(error),
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// }
