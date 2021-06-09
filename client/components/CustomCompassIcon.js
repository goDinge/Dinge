import React from 'react';
import { Pressable, StyleSheet, Image } from 'react-native';

import Colors from '../constants/Colors';

const CustomCompassIcon = (props) => {
  return (
    <Pressable style={styles.container} onPress={props.onSelect}>
      <Image
        style={styles.compassIcon}
        source={require('../assets/compass.png')}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: Colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  compassIcon: {
    height: 40,
    width: 40,
  },
});

export default CustomCompassIcon;
