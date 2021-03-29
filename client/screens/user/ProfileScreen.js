import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';

import CustomButton from '../../components/CustomButton';
import Colors from '../../constants/Colors';
import getMonthName from '../../helpers/getMonth';

const ProfileScreen = (props) => {
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);

  const date = new Date(authUser.createdAt);
  const monthNumber = date.getMonth() + 1;
  const month = getMonthName(monthNumber);
  const year = date.getFullYear();

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const imagePickerHandler = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.2,
      });

      if (!result.cancelled) {
        setImage(result);
      }

      console.log('image object on device: ', result);

      //await dispatch(userActions.updateCurrentUserAvatar(image));
      await dispatch(authActions.updateAuthAvatar(result));
    } catch (err) {
      Alert.alert('Could not upload avatar!', 'Please try again later.', [
        { text: 'Okay' },
      ]);
      console.log(err.message);
    }
  };

  const logout = async () => {
    await dispatch(authActions.logout());
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.idContainer}>
          <View style={styles.leftContainer}>
            <View style={styles.nameEmailContainer}>
              <Text style={styles.userName}>{authUser.name}</Text>
              <Text style={styles.userEmail}>{authUser.email}</Text>
            </View>
            <Text style={styles.text}>
              Joined: {month} {year}
            </Text>
          </View>
          <Pressable onPressIn={imagePickerHandler}>
            <Image style={styles.avatar} source={{ uri: authUser.avatar }} />
          </Pressable>
        </View>
        <ScrollView style={styles.statsContainer}>
          <Text style={styles.title}>Statistics</Text>
          <View style={styles.rowStat}>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Rank</Text>
              <Text style={styles.stats}>{authUser.level}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Rep</Text>
              <Text style={styles.stats}>1852</Text>
            </View>
          </View>
          <View style={styles.rowStat}>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Followers</Text>
              <Text style={styles.stats}>{authUser.followers.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Following</Text>
              <Text style={styles.stats}>{authUser.following.length}</Text>
            </View>
          </View>
          <View style={styles.rowStat}>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Likes / Ding</Text>
              <Text style={styles.stats}>3.2</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Ding / Day</Text>
              <Text style={styles.stats}>2.8</Text>
            </View>
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <CustomButton style={styles.button} onSelect={logout}>
              <Text style={styles.buttonText}>Log out</Text>
            </CustomButton>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    width: '90%',
    height: '93%',
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
  leftContainer: {
    justifyContent: 'space-between',
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  userName: {
    fontFamily: 'cereal-medium',
    fontSize: 24,
    color: '#444',
  },
  userEmail: {
    fontFamily: 'cereal-book',
    fontSize: 16,
    color: '#999',
  },
  statsContainer: {
    height: 300,
    width: '100%',
  },
  title: {
    textAlign: 'left',
    fontFamily: 'cereal-medium',
    fontSize: 22,
    color: Colors.primary,
    paddingVertical: 10,
  },
  text: {
    fontFamily: 'cereal-book',
    fontSize: 14,
    color: '#999',
  },
  rowStat: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statBox: {
    width: '50%',
  },
  statsTitle: {
    textAlign: 'left',
    fontFamily: 'cereal-medium',
    fontSize: 18,
    color: '#777',
    paddingVertical: 5,
  },
  stats: {
    textAlign: 'left',
    fontFamily: 'cereal-book',
    fontSize: 16,
    color: '#777',
  },
  bottomContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderTopWidth: 1,
  },
  buttonContainer: {
    marginVertical: 15,
    alignItems: 'center',
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
