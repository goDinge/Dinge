import React, { useState } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet } from 'react-native';

import Colors from '../constants/Colors';

const CustomInput = (props) => {
  const [value, onChangeText] = useState('');
  return (
    <TextInput
      {...props}
      style={styles.inputField}
      onChangeText={(text) => onChangeText(text)}
      value={value}
    />
  );
};

const styles = StyleSheet.create({
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    width: '100%',
    fontFamily: 'cereal-light',
    fontSize: 16,
    color: Colors.gray,
  },
});

export default CustomInput;
