import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import {
  Entypo,
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import * as Location from 'expo-location';

import * as eventsActions from '../../store/actions/events';
import Colors from '../../constants/Colors';
import CustomButton from '../../components/CustomButton';
import CustomMarker from '../../components/CustomMarker';
import CustomInput from '../../components/CustomInput';

import { convertAMPM, properDate } from '../../helpers/dateConversions';

import { GOOGLE_MAPS, AWS_EVENT_TYPES } from '@env';

Geocoder.init(GOOGLE_MAPS);

const FORM_INPUT = 'FORM_INPUT';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let formIsValid = true;
    for (const key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }
    return {
      formIsValid: formIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const CreateEventScreen = (props) => {
  const authUser = props.route.params;

  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [eventToPass, setEventToPass] = useState(null);
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [datePicked, setDatePicked] = useState(false);
  const [timePicked, setTimePicked] = useState(false);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(location);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tempEvent, setTempEvent] = useState({
    location: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [eventType, setEventType] = useState('community');
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const newEvent = useSelector((state) => state.events.newEvent);
  if (newEvent) {
    console.log('newEvent', newEvent.eventName);
  }

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    {
      newEvent ? setEventToPass(newEvent) : console.log('no new event');
    }
  }, [newEvent]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [setLocation, setRegion]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      eventName: '',
      date: '',
      eventType: 'community',
      thumbUrl: '',
      address: '',
      location: '',
      description: '',
      hours: null,
    },
    inputValidities: {
      eventName: false,
      date: false,
      eventType: true,
      thumbUrl: false,
      location: false,
      description: false,
      hours: false,
    },
    formIsValid: false,
  });

  //console.log(formState);

  //Date and Time picker functions
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let isValid;
    if (currentDate > Date.now()) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT,
      value: currentDate,
      isValid: isValid,
      input: 'date',
    });
    if (mode === 'time') {
      setTimePicked(true);
    } else {
      setDatePicked(true);
    }
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };
  const showTimepicker = () => {
    showMode('time');
  };

  //Text input
  const inputChangeHandler = (inputType, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    if (inputType === 'hours' && text === Number) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT,
      value: text,
      isValid: isValid,
      input: inputType,
    });
  };

  //Map and marker
  const loadMapHandler = async (region, address) => {
    await coordLookUp(address);
    setMapLoaded(true);
  };

  const coordLookUp = async (address) => {
    let coordsMongo = {
      latitude: null,
      longitude: null,
    };
    try {
      const json = await Geocoder.from(address);
      const coordsGoogle = json.results[0].geometry.location;

      let isValid = false;
      if (coordsGoogle) {
        (coordsMongo = {
          latitude: coordsGoogle.lat,
          longitude: coordsGoogle.lng,
        }),
          setTempEvent({
            location: {
              latitude: coordsGoogle.lat,
              longitude: coordsGoogle.lng,
            },
            thumbUrl: `${AWS_EVENT_TYPES}${eventType}.png`,
          }),
          setRegion({
            latitude: coordsGoogle.lat,
            longitude: coordsGoogle.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }),
          (isValid = true),
          dispatchFormState({
            type: FORM_INPUT,
            value: coordsMongo,
            isValid: isValid,
            input: 'location',
          });
      }
      return coordsMongo;
    } catch (err) {
      console.log(err);
    }
  };

  //Event types
  const eventTypes = [
    'arts',
    'business',
    'community',
    'culture',
    'health',
    'music',
    'party',
    'political',
    'sports',
    'other',
  ];

  const eventTypeHandler = () => {
    setModalVisible(true);
  };

  const chooseEventType = (text) => {
    setEventType(text);
    let isValid = false;
    if (text) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT,
      value: text,
      isValid: isValid,
      input: 'eventType',
    });
    dispatchFormState({
      type: FORM_INPUT,
      value: `${AWS_EVENT_TYPES}${text}.png`,
      isValid: isValid,
      input: 'thumbUrl',
    });
    setModalVisible(false);
  };

  const createEventHandler = async () => {
    setError(null);
    try {
      await dispatch(eventsActions.createEvent(formState));
      await dispatch(eventsActions.getEvents());
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    }
    //props.navigation.navigate('Map');
    //props.navigation.navigate('Event Details', eventToPass);
    setConfirmVisible(true);
  };

  const toEventDetailsHandler = () => {
    setConfirmVisible(false);
    props.navigation.navigate('Event Details', eventToPass);
  };

  if (isLoading || !location) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView>
            <View style={styles.eventNameContainer}>
              <Text style={styles.instructionText}>Event Name:</Text>
              <TextInput
                placeholder="enter event name"
                style={styles.tempInput}
                value={formState.inputValues.eventName}
                onChangeText={(text) => inputChangeHandler('eventName', text)}
              />
            </View>
            <View style={styles.eventTypeContainer}>
              <Text style={[styles.instructionText, { marginRight: 15 }]}>
                Event Type:
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.chosenEventTypeText}>{eventType}</Text>
                <Entypo
                  name="triangle-down"
                  size={18}
                  onPress={eventTypeHandler}
                  style={{ paddingHorizontal: 2 }}
                />
              </View>
              <Image
                style={styles.pic}
                source={{
                  uri: `${AWS_EVENT_TYPES}${eventType}.png`,
                }}
              />
            </View>

            <View style={styles.dateContainer}>
              <View style={styles.pickDateContainer}>
                <Text style={[styles.instructionText, { marginRight: 20 }]}>
                  Select date and time
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={30}
                  onPress={showDatepicker}
                  style={{ marginRight: 40 }}
                />
                <SimpleLineIcons
                  name="clock"
                  size={30}
                  onPress={showTimepicker}
                  style={{ marginRight: 20 }}
                />
              </View>
              <Text style={[styles.instructionText, styles.chosenDateText]}>
                {formState.inputValidities.date && datePicked && timePicked
                  ? properDate(date) + '  /  ' + convertAMPM(date)
                  : null}
              </Text>
              <View
                style={[styles.durationContainer, { flexDirection: 'row' }]}
              >
                <Text
                  style={[
                    styles.instructionText,
                    { marginRight: 10 },
                    { alignSelf: 'center' },
                  ]}
                >
                  Event Duration:
                </Text>
                <TextInput
                  placeholder="hours"
                  keyboardType="numeric"
                  style={[styles.tempInput]}
                  value={formState.inputValues.hours}
                  onChangeText={(text) => inputChangeHandler('hours', text)}
                />
              </View>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.instructionText}>Event Location:</Text>
              <TextInput
                placeholder="enter street address & city name"
                style={styles.tempInput}
                value={formState.inputValues.address}
                onChangeText={(text) => inputChangeHandler('address', text)}
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  onSelect={() =>
                    loadMapHandler(region, formState.inputValues.address)
                  }
                >
                  <Text style={styles.locateOnMapText}>Add Map Marker</Text>
                </CustomButton>
              </View>
            </View>
            <View style={styles.mapContainer}>
              {mapLoaded ? (
                <MapView
                  style={styles.map}
                  region={region}
                  minZoomLevel={12}
                  maxZoomLevel={17}
                >
                  {isFocused && mapLoaded && <CustomMarker data={tempEvent} />}
                </MapView>
              ) : null}
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.instructionText}>Description:</Text>
              <TextInput
                style={styles.tempInput}
                value={formState.inputValues.description}
                multiline={true}
                returnKeyType="done"
                onChangeText={(text) => inputChangeHandler('description', text)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton onSelect={createEventHandler}>
                <Text style={styles.locateOnMapText}>Create Event</Text>
              </CustomButton>
            </View>
            <View style={styles.extraSpace}></View>
          </ScrollView>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {eventTypes.map((item, index) => (
                  <Text
                    key={index}
                    style={styles.modalText}
                    onPress={() => chooseEventType(item)}
                  >
                    {item}
                  </Text>
                ))}
                <View style={styles.right}>
                  <MaterialCommunityIcons
                    name="close"
                    size={30}
                    style={styles.iconClose}
                    onPress={() => setModalVisible(!modalVisible)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={confirmVisible}
            onRequestClose={() => {
              seConfirmVisible(!confirmVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Event Created!</Text>
                <View style={styles.buttonContainer}>
                  <CustomButton onSelect={() => toEventDetailsHandler()}>
                    <Text style={styles.locateOnMapText}>
                      Go see your event
                    </Text>
                  </CustomButton>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={Date.now()}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateEventScreen;

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
    width: '94%',
    paddingVertical: 10,
  },
  eventNameContainer: {
    marginVertical: 15,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'cereal-medium',
    marginBottom: 4,
  },
  chosenDateText: {
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 15,
  },
  tempInput: {
    borderColor: '#dddddd',
    borderRadius: 10,
    borderWidth: 0.5,
    fontSize: 16,
    fontFamily: 'cereal-light',
    paddingLeft: 15,
    paddingRight: 15,
  },
  pickDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 15,
  },
  dateTimeButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  durationContainer: {
    marginVertical: 15,
  },
  locateOnMapText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  mapContainer: {
    justifyContent: 'center',
    marginBottom: 18,
  },
  map: {
    height: 200,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  eventTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 15,
  },
  chosenEventTypeText: {
    width: 120,
    height: 22,
    fontSize: 16,
    fontFamily: 'cereal-medium',
    textAlign: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#dddddd',
  },
  pic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 2,
    top: -15,
    marginLeft: 20,
  },
  descriptionContainer: {
    width: '100%',
    marginVertical: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 25,
    paddingBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontFamily: 'cereal-medium',
    fontSize: 16,
    textAlign: 'center',
  },
  right: {
    width: '100%',
    alignSelf: 'flex-end',
  },
  iconClose: {
    alignItems: 'flex-end',
  },
  extraSpace: {
    height: 100,
  },
});
