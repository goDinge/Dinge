import React, { useState, useEffect } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Marker } from 'react-native-maps';

import * as dingActions from '../store/actions/ding';

const CustomMarker = (props) => {
  const [picOpacity, setPicOpacity] = useState(1);
  const [draggable, setDraggable] = useState(false);

  const authUser = useSelector((state) => state.auth.authUser);
  const dingId = props.data._id;

  const dispatch = useDispatch();

  useEffect(() => {
    if (authUser._id == props.data.user) {
      setDraggable(true);
    }
  }, [authUser]);

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

  // console.log(props.data.user);
  // console.log(authUser);

  //write function to update ding/event onDragEnd
  const dragEndHandler = async (e) => {
    console.log(e.nativeEvent);
    try {
      await dispatch(
        dingActions.updateDingLocation(dingId, e.nativeEvent.coordinate)
      );
    } catch (err) {
      console.log(err.message);
    }
    setPicOpacity(1);
  };

  return (
    <Pressable style={styles.markerContainer}>
      <Marker
        draggable={draggable}
        onDrag={() => setPicOpacity(0.2)}
        onDragEnd={(e) => dragEndHandler(e)}
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
        <Image
          style={[styles.pin, { opacity: picOpacity }]}
          source={require('../assets/pin.png')}
        />
      </Marker>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
