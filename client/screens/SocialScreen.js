import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SocialScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Social Screen</Text>
    </View>
  );
};

export default SocialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
