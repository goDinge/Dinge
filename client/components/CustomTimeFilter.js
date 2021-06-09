import React, { useState, useEffect } from 'react';
import { View, Image, Pressable, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Marker } from 'react-native-maps';

import * as dingeActions from '../store/actions/dinge';
import * as eventsActions from '../store/actions/events';

import Colors from '../constants/Colors';

const CustomTimeFilter = (props) => {
  const { name, text, onSelect, timeSelected } = props;

  return name === timeSelected ? (
    <Pressable style={stylesClicked.timeIcon} onPress={onSelect}>
      <View style={stylesClicked.buttonContainer}>
        <Text style={stylesClicked.iconText}>{text}</Text>
      </View>
    </Pressable>
  ) : (
    <Pressable style={styles.timeIcon} onPress={onSelect}>
      <View style={styles.buttonContainer}>
        <Text style={styles.iconText}>{text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  timeIcon: {
    height: 54,
    width: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: 'white',
    marginHorizontal: 10,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  iconText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'cereal-black',
    fontSize: 12,
  },
});

const stylesClicked = StyleSheet.create({
  timeIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginHorizontal: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  iconText: {
    textAlign: 'center',
    color: Colors.primary,
    fontFamily: 'cereal-black',
    fontSize: 14,
  },
});

export default CustomTimeFilter;
