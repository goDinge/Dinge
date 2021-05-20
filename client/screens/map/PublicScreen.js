import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import * as userActions from '../../store/actions/user';

import CustomEvent from '../../components/CustomEvent';
import Colors from '../../constants/Colors';

import { sortEvents } from '../../helpers/sort';

const PublicScreen = (props) => {
  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const user = props.route.params;
  const userState = useSelector((state) => state.user.user);
  const events = useSelector((state) => state.events.events);

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

  //Show user's active events
  const currentTime = Date.now();

  const activeUserEvents = events
    .filter((event) => currentTime < Date.parse(event.endDate))
    .filter((event) => userState._id === event.user);

  activeUserEvents.sort(sortEvents);

  const eventDetailsHandler = (event) => {
    props.navigation.navigate('Event Details', event);
  };

  const browserHandler = (url) => {
    if (url.length > 8 && url.slice(0, 8) === 'https://') {
      WebBrowser.openBrowserAsync(url);
    }
    if (url.length > 7 && url.slice(0, 7) === 'http://') {
      WebBrowser.openBrowserAsync(url);
    }
    WebBrowser.openBrowserAsync('https://' + url);
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
        <ScrollView style={{ width: '100%' }}>
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
          <View style={styles.statsContainer}>
            <Text style={styles.title}>Socials</Text>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Website:</Text>
              {userState.website ? (
                <Pressable onPressIn={() => browserHandler(userState.website)}>
                  <Text style={styles.stats}>{userState.website}</Text>
                </Pressable>
              ) : (
                <Text style={styles.stats}>no website</Text>
              )}
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statsTitle}>Facebook:</Text>
              {userState.facebook ? (
                <Pressable onPressIn={() => browserHandler(userState.facebook)}>
                  <Text style={styles.stats}>{userState.facebook}</Text>
                </Pressable>
              ) : (
                <Text style={styles.stats}>no facebook</Text>
              )}
            </View>
          </View>
          <View style={styles.eventsContainer}>
            <Text style={styles.title}>Active Events</Text>
            <View style={styles.eventsList}>
              {activeUserEvents.map((item, index) => (
                <CustomEvent
                  item={item}
                  key={index}
                  onSelect={() => eventDetailsHandler(item)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
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
    height: '93%',
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
    marginVertical: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    height: 240,
    width: 240,
    borderRadius: 120,
  },
  statsContainer: {
    width: '100%',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  statBox: {
    marginBottom: 10,
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
  eventsList: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 8,
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
});
