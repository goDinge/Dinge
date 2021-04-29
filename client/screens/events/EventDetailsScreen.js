import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import * as eventActions from '../../store/actions/events';
import * as userActions from '../../store/actions/user';
import Colors from '../../constants/Colors';
import CustomMarker from '../../components/CustomMarker';

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

  if (isLoading) {
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
            <Text style={styles.eventInfo}>Organizer: {user.name}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={{ uri: authUser.avatar }}
              defaultSource={require('../../assets/avatar.png')}
            />
          </View>
        </View>
        <ScrollView>
          <View style={styles.lowerInfoContainer}>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={region}
                minZoomLevel={14}
                maxZoomLevel={16}
              >
                <CustomMarker data={event} />
              </MapView>
            </View>
            <View style={styles.aboutInfoContainer}>
              <Text style={[styles.eventTitle, { fontSize: 20 }]}>
                About this event
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
    width: '90%',
  },
  topInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  eventTitle: {
    fontFamily: 'cereal-bold',
    fontSize: 26,
    marginTop: 4,
    marginBottom: 8,
  },
  eventInfo: {
    fontFamily: 'cereal-medium',
    fontSize: 15,
    color: Colors.gray,
  },
  eventText: {
    fontFamily: 'cereal-light',
    fontSize: 16,
  },
  avatarContainer: {},
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
  },
  lowerInfoContainer: {
    width: '100%',
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: 200,
  },
  aboutInfoContainer: {
    backgroundColor: 'yellow',
    height: 500,
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//DATE FUNCTIONS
const convertAMPM = (time) => {
  let displayTime;
  const hourSliced = new Date(time).toTimeString().slice(0, 2);
  const minutesSliced = new Date(time).toTimeString().slice(2, 5);
  if (hourSliced > 12) {
    displayTime = hourSliced - 12 + minutesSliced + 'PM';
  } else {
    displayTime = hourSliced - 0 + minutesSliced + 'AM';
  }
  return displayTime;
};

const convertFullWeekDayNames = (day) => {
  const converted = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };
  return converted[day];
};

const properDate = (date) => {
  let displayDate;
  const weekDayShort = new Date(date).toDateString().slice(0, 3);
  const restOfDate = new Date(date).toDateString().slice(4);
  const dateArray = restOfDate.split(' ');
  dateArray.splice(1, 1, dateArray[1].concat(', '));
  const goodRestOfDate = dateArray.join(' ');
  const weekDayLong = convertFullWeekDayNames(weekDayShort);

  displayDate = weekDayLong + ',  ' + goodRestOfDate;
  return displayDate;
};
