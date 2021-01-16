import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const CustomBillboard = (props) => {
  const getCenterOffsetForAnchor = (anchor, markerWidth, markerHeight) => ({
    x: markerWidth * 0.5 - markerWidth * anchor.x,
    y: markerHeight * 0.5 - markerHeight * anchor.y,
  });

  const MARKER_WIDTH = 100;
  const MARKER_HEIGHT = 90;

  const ANCHOR = { x: 0.5, y: 1 };
  const iOSANCHOR = { x: 0.5, y: 1.2 };
  const CENTEROFFSET = getCenterOffsetForAnchor(
    iOSANCHOR,
    MARKER_WIDTH,
    MARKER_HEIGHT
  );
  return (
    <View style={styles.markerContainer}>
      <Marker
        coordinate={{
          latitude: props.data.lat,
          longitude: props.data.lng,
        }}
        centerOffset={CENTEROFFSET} //iOS
        anchor={ANCHOR} //google maps
        // centerOffset={{ x: -9, y: -52 }} //iOS
        // anchor={{ x: 0.75, y: 0.95 }} //google maps
        tracksViewChanges={true}
      >
        <Image style={styles.pic} source={{ uri: props.data.url }} />
        <Image style={styles.pin} source={require('../assets/billboard.png')} />
      </Marker>
    </View>
  );
};

const styles = StyleSheet.create({
  markerContainer: {},
  pic: {
    width: 92,
    height: 44,
    borderRadius: 10,
    top: 51,
    left: 4,
    zIndex: 1,
  },
  pin: {
    width: 100,
    height: 90,
  },
});

export default CustomBillboard;
