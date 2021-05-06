import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import { useIsFocused } from '@react-navigation/native';

import * as eventActions from '../../store/actions/events';
import * as userActions from '../../store/actions/user';
import Colors from '../../constants/Colors';
import CustomMarker from '../../components/CustomMarker';

import { convertAMPM, properDate } from '../../helpers/dateConversions';

const EventDetailsScreen = (props) => {
  const event = props.route.params;
  const authUser = useSelector((state) => state.auth.authUser);
  const eventState = useSelector((state) => state.ding.ding);
  const user = useSelector((state) => state.user.user);

  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(location);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  console.log('details', event);

  useEffect(() => {
    loadUser(event.user);
    loadEvent(event._id);
    loadAuthUser();
    let location = event.location;
    setLocation(location);
    setRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, [loadUser, loadEvent, loadAuthUser, setIsLoading, setRegion]);

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

  const loadAuthUser = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.getAuthUser());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const loadEvent = async (dingId) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(eventActions.getEvent(dingId));
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  };

  const toUserNameHandler = (user) => {
    props.navigation.navigate('Map', {
      screen: 'Public',
      params: user,
    });
  };

  if (isLoading || !location) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.topInfoContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.eventTitle}>{event.eventName}</Text>
            <Text style={[styles.eventInfo, { marginBottom: 3 }]}>
              {properDate(event.date)}
            </Text>
            <Text style={[styles.eventInfo, { marginBottom: 8 }]}>
              {convertAMPM(event.date)} - {convertAMPM(event.endDate)}
            </Text>
            <Pressable onPress={() => toUserNameHandler(user)}>
              <Text style={styles.eventInfo}>Organizer: {user.name}</Text>
            </Pressable>
          </View>
          {/* <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: authUser.avatar }}
              defaultSource={require('../../assets/avatar.png')}
            />
          </View> */}
        </View>
        <ScrollView>
          <View style={styles.lowerInfoContainer}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={region}
                minZoomLevel={13}
                maxZoomLevel={17}
              >
                {isFocused && <CustomMarker data={event} />}
              </MapView>
            </View>
            <View style={styles.aboutInfoContainer}>
              <Text style={[styles.eventTitle, { fontSize: 20 }]}>
                About this event
              </Text>
              <Text style={[styles.eventInfo, { marginBottom: 8 }]}>
                {event.address}
              </Text>
              <Text style={styles.eventText}>{event.description}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  innerContainer: {
    margin: 10,
    width: '94%',
  },
  topInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 20,
  },
  eventTitle: {
    fontFamily: 'cereal-bold',
    fontSize: 23,
    marginBottom: 12,
  },
  eventInfo: {
    fontFamily: 'cereal-medium',
    fontSize: 15,
    color: Colors.gray,
  },
  eventText: {
    fontFamily: 'cereal-light',
    fontSize: 16,
    color: Colors.gray,
  },
  avatarContainer: {},
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  lowerInfoContainer: {
    width: '100%',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    height: 200,
  },
  aboutInfoContainer: {
    height: 500,
    marginTop: 16,
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    width: 50,
    height: 50,
  },
});
