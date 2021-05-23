import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResetPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Reset Password Screen</Text>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
