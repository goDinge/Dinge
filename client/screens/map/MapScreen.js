import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import CustomMarker from '../../components/CustomMarker';
import CustomCameraIcon from '../../components/CustomCameraIcon';
import * as dingeActions from '../../store/actions/dinge';

// import CustomBillboard from '../components/CustomBillboard';
// import { dummyBillboards } from '../data/dummyBillboards';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MapScreen = (props) => {
  const [error, setError] = useState(undefined);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 43.650609,
    longitude: -79.389441,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const dispatch = useDispatch();

  //state.reducer.sliceOfReducer
  const dinge = useSelector((state) => state.dinge.dinge);

  useEffect(() => {
    loadData();
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
    //console.log(item);
  };

  const selectCameraHandler = () => {
    props.navigation.navigate('Upload');
  };

  //load map
  if (!mapLoaded) {
    return (
      <View>
        <ActivityIndicator size="large" />
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
});

export default MapScreen;
