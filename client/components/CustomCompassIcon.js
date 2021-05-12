import React from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';

const CustomCompassIcon = (props) => {
  return (
    <Pressable onPress={props.onSelect}>
      <Image
        style={styles.compassIcon}
        source={require('../assets/compass.png')}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  compassIcon: {
    height: 40,
    width: 40,
  },
});

export default CustomCompassIcon;
