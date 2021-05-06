import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';
import * as Location from 'expo-location';

import CustomMarker from '../../components/CustomMarker';
import CustomBlueMarker from '../../components/CustomBlueMarker';
import CustomCameraIcon from '../../components/CustomCameraIcon';
import CustomReloadIcon from '../../components/CustomReloadIcon';
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

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const dinge = useSelector((state) => state.dinge.dinge);
  const events = useSelector((state) => state.events.events);
  const authUser = useSelector((state) => state.auth.authUser);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        timeout: 5000,
        accuracy: 6,
      });
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
    })();
  }, []);

  console.log(location);

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

  const reloadHandler = () => {
    loadData();
    setMapLoaded(true);
  };

  const now = new Date(Date.now()).getTime();

  //console.log(location);

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
        maxZoomLevel={17}
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
});

export default MapScreen;
