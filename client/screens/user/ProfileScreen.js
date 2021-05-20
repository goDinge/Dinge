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
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';

import * as authActions from '../../store/actions/auth';
import * as eventsActions from '../../store/actions/events';
import CustomButton from '../../components/CustomButton';
import CustomEvent from '../../components/CustomEvent';
import Colors from '../../constants/Colors';
import getMonthName from '../../helpers/getMonth';

import { sortEvents } from '../../helpers/sort';

const ProfileScreen = (props) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showEvents, setShowEvents] = useState(null);

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);
  const authEvents = useSelector((state) => state.events.authEvents);

  useEffect(() => {
    loadAuthUser();
  }, []);

  const loadAuthUser = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.getAuthUser());
      await dispatch(eventsActions.getEventsByAuth());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  //Calculate 'joined: (date)'
  const date = new Date(authUser.createdAt);
  const monthNumber = date.getMonth() + 1;
  const month = getMonthName(monthNumber);
  const year = date.getFullYear();

  //Show user's active events
  const currentTime = Date.now();

  const activeAuthUserEvents = authEvents.filter(
    (event) => currentTime < Date.parse(event.endDate)
  );

  activeAuthUserEvents.sort(sortEvents);

  //update profile avatar
  const imagePickerHandler = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });

      if (!result.cancelled) {
        setImage(result);
      }

      await dispatch(authActions.updateAuthAvatar(result));
    } catch (err) {
      Alert.alert('Could not upload avatar!', 'Please try again later.', [
        { text: 'Okay' },
      ]);
      console.log(err.message);
    }
  };

  const eventDetailsHandler = (event) => {
    props.navigation.navigate('Event Details', event);
  };

  const browserHandler = (url) => {
    WebBrowser.openBrowserAsync(url);
  };

  const logout = async () => {
    await dispatch(authActions.logout());
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        color={Colors.primary}
        size="large"
        style={styles.actIndicator}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.avatarContainer}>
            <Pressable onPressIn={imagePickerHandler}>
              <Image
                style={styles.avatar}
                source={{ uri: authUser.avatar }}
                defaultSource={require('../../assets/avatar.png')}
              />
            </Pressable>
          </View>
          <View style={styles.idContainer}>
            <Text style={[styles.userName, { marginBottom: 5 }]}>
              {authUser.name}
            </Text>
            <Text style={styles.userEmail}>{authUser.email}</Text>
            <Text style={styles.text}>
              Joined: {month} {year}
            </Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.title}>Statistics</Text>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Rank</Text>
              <Text style={styles.stats}>{authUser.level}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Reputation</Text>
              <Text style={styles.stats}>{authUser.reputation}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Followers</Text>
              <Text style={styles.stats}>{authUser.followers.length}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Following</Text>
              <Text style={styles.stats}>{authUser.following.length}</Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.title}>Socials</Text>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Website:</Text>
              {authUser.website ? (
                <Pressable onPressIn={() => browserHandler(authUser.website)}>
                  <Text style={styles.stats}>{authUser.website}</Text>
                </Pressable>
              ) : (
                <Text style={styles.stats}>no website</Text>
              )}
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Facebook:</Text>
              {authUser.facebook ? (
                <Pressable onPressIn={() => browserHandler(authUser.facebook)}>
                  <Text style={styles.stats}>{authUser.facebook}</Text>
                </Pressable>
              ) : (
                <Text style={styles.stats}>no facebook</Text>
              )}
            </View>
          </View>
          <View style={styles.eventsContainer}>
            <Text style={styles.title}>Active Events</Text>
            <View style={styles.eventsList}>
              {activeAuthUserEvents.map((item, index) => (
                <CustomEvent
                  item={item}
                  key={index}
                  onSelect={() => eventDetailsHandler(item)}
                />
              ))}
            </View>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.buttonContainer}>
              <CustomButton style={styles.button} onSelect={logout}>
                <Text style={styles.buttonText}>Log out</Text>
              </CustomButton>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  actIndicator: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
  idContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventsContainer: {
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
  statBox: {
    marginBottom: 10,
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
  eventsList: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 8,
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
