import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const CustomBlueMarker = (props) => {
  const getCenterOffsetForAnchor = (anchor, markerWidth, markerHeight) => ({
    x: markerWidth * 0.5 - markerWidth * anchor.x,
    y: markerHeight * 0.5 - markerHeight * anchor.y,
  });

  const MARKER_WIDTH = 50;
  const MARKER_HEIGHT = 50;

  const ANCHOR = { x: 0.6, y: 0.9 };
  const iOSANCHOR = { x: 0.5, y: 1.7 };
  const CENTEROFFSET = getCenterOffsetForAnchor(
    iOSANCHOR,
    MARKER_WIDTH,
    MARKER_HEIGHT
  );

  return (
    <Pressable style={styles.markerContainer}>
      <Marker
        coordinate={{
          latitude: props.data.coords.latitude,
          longitude: props.data.coords.longitude,
        }}
        centerOffset={CENTEROFFSET} //iOS
        anchor={ANCHOR} //google maps
        // centerOffset={{ x: -9, y: -52 }} //iOS
        // anchor={{ x: 0.75, y: 0.95 }} //google maps
        tracksViewChanges={true}
        onPress={props.onSelect}
      >
        {/* <Image style={styles.pic} source={{ uri: props.user.avatar }} /> */}
        <Image
          style={styles.pin}
          source={require('../assets/blue-circle.png')}
        />
      </Marker>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  markerContainer: {},
  pin: {
    width: 30,
    height: 30,
  },
});

export default CustomBlueMarker;
