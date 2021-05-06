import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

import * as userActions from '../../store/actions/user';
import Colors from '../../constants/Colors';

const PublicScreen = (props) => {
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const user = props.route.params;
  const userState = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadUser(user);
  }, []);

  const loadUser = async (user) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(userActions.getUser(user));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.idContainer}>
          <View style={styles.nameRankContainer}>
            <Text style={styles.userName}>{userState.name}</Text>
            <Text style={styles.userLevel}>{userState.level}</Text>
          </View>
          <Text style={styles.text}>Rep: {userState.reputation}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={{ uri: userState.avatar }}
            defaultSource={require('../../assets/avatar.png')}
          />
        </View>
      </View>
    </View>
  );
};

export default PublicScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    width: '90%',
    height: '80%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  idContainer: {
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontFamily: 'cereal-medium',
    fontSize: 24,
    color: '#444',
    marginBottom: 15,
  },
  userLevel: {
    fontFamily: 'cereal-book',
    fontSize: 16,
    color: '#999',
  },
  text: {
    fontFamily: 'cereal-book',
    fontSize: 14,
    color: '#999',
  },
  avatarContainer: {
    marginTop: 30,
    justifyContent: 'center',
  },
  avatar: {
    height: 240,
    width: 240,
    borderRadius: 120,
  },
});
