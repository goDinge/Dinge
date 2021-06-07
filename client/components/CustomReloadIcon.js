import React from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';

const CustomReloadIcon = (props) => {
  return (
    <Pressable onPress={props.onSelect}>
      <Image
        style={styles.reloadIcon}
        source={require('../assets/reload.png')}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  reloadIcon: {
    height: 40,
    width: 40,
  },
});

export default CustomReloadIcon;
