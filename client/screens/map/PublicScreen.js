import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet, Image } from 'react-native';

import * as userAction from '../../store/actions/user';
import Colors from '../../constants/Colors';

const PublicScreen = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.idContainer}>
          <View style={styles.nameRankContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userLevel}>{user.level}</Text>
          </View>
          <Text style={styles.text}>Rep: 1852</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} source={{ uri: user.avatar }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  userName: {
    fontFamily: 'cereal-medium',
    fontSize: 24,
    color: '#444',
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
