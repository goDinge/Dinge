import React from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Colors from '../constants/Colors';

const CustomButton = (props) => {
  return (
    <View style={styles.customButton}>
      <Pressable style={{ ...props.style }} onPress={props.onSelect}>
        {props.children}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  customButton: {
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
});

export default CustomButton;
