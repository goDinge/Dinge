import React from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';

const CustomCameraIcon = (props) => {
  return (
    <Pressable onPress={props.onSelect}>
      <Image
        style={styles.cameraIcon}
        source={require('../assets/camera-icon.png')}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cameraIcon: {
    height: 70,
    width: 70,
  },
});

export default CustomCameraIcon;
