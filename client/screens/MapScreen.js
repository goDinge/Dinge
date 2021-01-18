import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import CustomMarker from '../components/CustomMarker';
import CustomBillboard from '../components/CustomBillboard';
import { dummyMarkers } from '../data/dummyMarkers';
import { dummyBillboards } from '../data/dummyBillboards';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const MapScreen = (props) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [region, setRegion] = useState({
    latitude: 43.650609,
    longitude: -79.389441,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    setMapLoaded(true);
  }, [setMapLoaded]);

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
        {dummyMarkers.map((item, index) => (
          <CustomMarker key={index} data={item} />
        ))}
        {dummyBillboards.map((item, index) => (
          <CustomBillboard key={index} data={item} />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

export default MapScreen;
