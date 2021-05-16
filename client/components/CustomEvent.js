import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import Colors from '../constants/Colors';

import { convertAMPM, properDate } from '../helpers/dateConversions';

const CustomEvent = (props) => (
  <View style={styles.eventContainer}>
    <View style={styles.eventTimeContainer}>
      <Text style={styles.eventText}>{properDate(props.item.date)}</Text>
      <Text style={styles.eventText}>
        {convertAMPM(props.item.date)} - {convertAMPM(props.item.endDate)}
      </Text>
    </View>
    <Pressable style={styles.eventInfoContainer} onPress={props.item.onSelect}>
      <Text style={styles.eventTextTitle}>{props.item.eventName}</Text>
      <Text style={styles.eventText}>
        {props.item.description.split(' ').slice(0, 9).join(' ') + '...'}
      </Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  eventContainer: {
    width: '100%',
    marginBottom: 5,
    marginTop: 2,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eeeeee',
  },
  eventTimeContainer: {
    width: '100%',
    marginBottom: 7,
  },
  eventInfoContainer: {
    width: '80%',
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: Colors.lightBlue,
    borderRadius: 20,
    marginBottom: 12,
  },
  eventTextTitle: {
    fontFamily: 'cereal-bold',
    fontSize: 18,
    paddingLeft: 10,
  },
  eventText: {
    fontFamily: 'cereal-medium',
    paddingLeft: 10,
  },
});

export default CustomEvent;
