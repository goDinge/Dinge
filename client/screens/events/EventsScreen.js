import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as eventsActions from '../../store/actions/events';
import Colors from '../../constants/Colors';
import CustomButton from '../../components/CustomButton';

const EventsScreen = (props) => {
  const [error, setError] = useState(undefined);
  const [showEvents, setShowEvents] = useState([]);
  const [dateChosen, setDateChosen] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const events = useSelector((state) => state.events.events);
  const authUser = useSelector((state) => state.auth.authUser);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setError[null];
    setLoading(true);
    try {
      await dispatch(eventsActions.getEvents());
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const sortEvents = (a, b) => {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  };

  const pickDateHandler = (date, index) => {
    let eventsToPush = [];
    setDateChosen(index);
    for (const event of events) {
      if (date === convertDate(event.date)) {
        eventsToPush.push(event);
      }
    }
    eventsToPush.sort(sortEvents);
    setShowEvents(eventsToPush);
  };

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

  const Item = ({ item }) => (
    <View style={styles.eventContainer}>
      <View style={styles.eventTimeContainer}>
        <Text style={styles.eventText}>
          {convertAMPM(item.date)} - {convertAMPM(item.endDate)}
        </Text>
      </View>
      <View style={styles.eventInfoContainer}>
        <Text style={styles.eventTextTitle}>{item.eventName}</Text>
        <Text style={styles.eventText}>
          {item.description.split(' ').slice(0, 9).join(' ') + '...'}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => <Item item={item} />;

  const createEventHandler = (authUser) => {
    console.log('create event authUser', authUser);
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
      <View style={styles.innerContainer}>
        <View style={styles.datesContainer}>
          {nextSevenDaysArray.map((item, index) => {
            return (
              <Pressable
                key={index}
                style={
                  index !== dateChosen
                    ? styles.dateContainer
                    : styles.chosenDateContainer
                }
                onPress={() => pickDateHandler(item.date, index)}
              >
                <Text
                  style={[styles.dateText, { fontSize: 12, paddingBottom: 9 }]}
                >
                  {item.date}
                </Text>
                <Text style={styles.dateText}>{item.day}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.eventsList}>
          <FlatList
            data={showEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            style={styles.createEventButton}
            onSelect={() => createEventHandler(authUser._id)}
          >
            <Text style={styles.createEventButtonText}>Create Event</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  datesContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dateContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRightWidth: 0.2,
    borderLeftWidth: 0.2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
  },
  chosenDateContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    borderRightWidth: 0.2,
    borderLeftWidth: 0.2,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: Colors.lightSecondary,
  },
  dateText: {
    textAlign: 'center',
    fontFamily: 'cereal-medium',
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
    height: '75%',
    paddingVertical: 10,
    shadowColor: 'black',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  createEventButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createEventButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontSize: 16,
  },
});

//DATE FUNCTIONS
const currentDateInMilli = Date.now();
const datePlusOneInMilli = currentDateInMilli + 1000 * 60 * 60 * 24;
const datePlusTwoInMilli = currentDateInMilli + 1000 * 60 * 60 * 24 * 2;
const datePlusThreeInMilli = currentDateInMilli + 1000 * 60 * 60 * 24 * 3;
const datePlusFourInMilli = currentDateInMilli + 1000 * 60 * 60 * 24 * 4;
const datePlusFiveInMilli = currentDateInMilli + 1000 * 60 * 60 * 24 * 5;
const datePlusSixInMilli = currentDateInMilli + 1000 * 60 * 60 * 24 * 6;
const datePlusSevenInMilli = currentDateInMilli + 1000 * 60 * 60 * 24 * 7;

const currentDate = new Date(currentDateInMilli).toLocaleDateString();
const datePlusOne = new Date(datePlusOneInMilli).toLocaleDateString();
const datePlusTwo = new Date(datePlusTwoInMilli).toLocaleDateString();
const datePlusThree = new Date(datePlusThreeInMilli).toLocaleDateString();
const datePlusFour = new Date(datePlusFourInMilli).toLocaleDateString();
const datePlusFive = new Date(datePlusFiveInMilli).toLocaleDateString();
const datePlusSix = new Date(datePlusSixInMilli).toLocaleDateString();
const datePlusSeven = new Date(datePlusSevenInMilli).toLocaleDateString();

const convertWeekDay = (num) => {
  const day = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  };
  return day[num];
};

const convertDate = (dateInMilli) => {
  const dateObj = new Date(dateInMilli).toLocaleDateString();
  return dateObj.slice(0, 5);
};

const nextSevenDaysArray = [
  {
    date: convertDate(currentDate),
    day: convertWeekDay(new Date(currentDateInMilli).getDay()),
  },
  {
    date: convertDate(datePlusOne),
    day: convertWeekDay(new Date(datePlusOneInMilli).getDay()),
  },
  {
    date: convertDate(datePlusTwo),
    day: convertWeekDay(new Date(datePlusTwoInMilli).getDay()),
  },
  {
    date: convertDate(datePlusThree),
    day: convertWeekDay(new Date(datePlusThreeInMilli).getDay()),
  },
  {
    date: convertDate(datePlusFour),
    day: convertWeekDay(new Date(datePlusFourInMilli).getDay()),
  },
  {
    date: convertDate(datePlusFive),
    day: convertWeekDay(new Date(datePlusFiveInMilli).getDay()),
  },
  {
    date: convertDate(datePlusSix),
    day: convertWeekDay(new Date(datePlusSixInMilli).getDay()),
  },
  {
    date: convertDate(datePlusSeven),
    day: convertWeekDay(new Date(datePlusSevenInMilli).getDay()),
  },
];
