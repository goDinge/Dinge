import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

import CustomButton from '../../components/CustomButton';

import * as authActions from '../../store/actions/auth';

const ProfileScreen = (props) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);

  const logout = async () => {
    await dispatch(authActions.logout());
  };

  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
      <Text>{authUser.name}</Text>
      <CustomButton style={styles.button} onSelect={logout}>
        <Text style={styles.buttonText}>Log out</Text>
      </CustomButton>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'cereal-bold',
    color: 'white',
  },
});
