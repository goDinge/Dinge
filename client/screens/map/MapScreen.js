import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';

import CustomMarker from '../../components/CustomMarker';
import CustomCameraIcon from '../../components/CustomCameraIcon';
import CustomReloadIcon from '../../components/CustomReloadIcon';
import Colors from '../../constants/Colors';

import * as dingeActions from '../../store/actions/dinge';

// import CustomBillboard from '../components/CustomBillboard';
// import { dummyBillboards } from '../data/dummyBillboards';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MapScreen = (props) => {
  //need to render MapScreen on navigation after upload pic AND manually whenever user wants
  const [error, setError] = useState(undefined);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [region, setRegion] = useState({
    latitude: 43.650609,
    longitude: -79.389441,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const dispatch = useDispatch();
  const dinge = useSelector((state) => state.dinge.dinge);

  useEffect(() => {
    loadData();
    console.log('useEffect runs');
    setMapLoaded(true);
  }, [setMapLoaded]);

  const loadData = async () => {
    setError(null);
    try {
      await dispatch(dingeActions.getDinge());
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

  const reloadHandler = () => {
    loadData();
    setMapLoaded(true);
  };

  //load map
  if (!mapLoaded) {
    return (
      <View>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <MapView
        style={styles.map}
        region={region}
        minZoomLevel={14}
        maxZoomLevel={16}
      >
        {dinge.map((item, index) => (
          <CustomMarker
            key={index}
            data={item}
            onSelect={() => selectDingHandler(item)}
          />
        ))}
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
