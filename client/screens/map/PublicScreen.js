import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PublicScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Public Screen</Text>
    </View>
  );
};

export default PublicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
