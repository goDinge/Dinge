import React from 'react';
import { View, Image, Modal, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Marker } from 'react-native-maps';

const CustomMarker = (props) => {
  const getCenterOffsetForAnchor = (anchor, markerWidth, markerHeight) => ({
    x: markerWidth * 0.5 - markerWidth * anchor.x,
    y: markerHeight * 0.5 - markerHeight * anchor.y,
  });

  const MARKER_WIDTH = 50;
  const MARKER_HEIGHT = 50;

  const ANCHOR = { x: 0.5, y: 1 + 3 / MARKER_HEIGHT };
  const iOSANCHOR = { x: 0.5, y: 1.7 };
  const CENTEROFFSET = getCenterOffsetForAnchor(
    iOSANCHOR,
    MARKER_WIDTH,
    MARKER_HEIGHT
  );

  return (
    <TouchableOpacity style={styles.markerContainer}>
      <Marker
        coordinate={{
          latitude: props.data.location.latitude,
          longitude: props.data.location.longitude,
        }}
        centerOffset={CENTEROFFSET} //iOS
        anchor={ANCHOR} //google maps
        // centerOffset={{ x: -9, y: -52 }} //iOS
        // anchor={{ x: 0.75, y: 0.95 }} //google maps
        tracksViewChanges={true}
        onPress={props.onSelect}
      >
        <Image style={styles.pic} source={{ uri: props.data.thumbUrl }} />
        <Image style={styles.pin} source={require('../assets/pin.png')} />
      </Marker>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  markerContainer: {},
  pic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 2,
    top: 42,
    zIndex: 1,
  },
  pin: {
    width: 50,
    height: 50,
  },
});

export default CustomMarker;
