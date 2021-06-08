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
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';
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

import { convertAMPM, properDate } from '../../helpers/dateConversions';
import eventTypes from '../../helpers/eventTypes';

import { AWS_EVENT_TYPES } from '@env';

const mapStyle = require('../../helpers/mapStyle.json');

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
  const [isFetchingMarker, setIsFetchingMarker] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventToPass, setEventToPass] = useState(null);
  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [datePicked, setDatePicked] = useState(false);
  const [timePicked, setTimePicked] = useState(false);
  const [region, setRegion] = useState(userLocation);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [event, setEvent] = useState({
    location: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [eventType, setEventType] = useState('community');
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const newEvent = useSelector((state) => state.events.newEvent);
  const userLocation = useSelector((state) => state.location.location);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    {
      newEvent ? setEventToPass(newEvent) : null;
    }
  }, [newEvent]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [setRegion]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      eventName: '',
      date: '',
      eventType: 'community',
      thumbUrl:
        'https://dinge.s3.us-east-2.amazonaws.com/event-types-2/community.png',
      address: '',
      location: '',
      description: '',
      hours: '',
    },
    inputValidities: {
      eventName: false,
      date: false,
      eventType: true,
      thumbUrl: true,
      location: false,
      description: false,
      hours: false,
    },
    formIsValid: false,
  });

  //Date and Time picker functions
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let isValid;
    if (Date.parse(currentDate) + 100000 > Date.now()) {
      isValid = true;
    } else {
      Alert.alert('Careful', 'Start time must be after right now.', [
        { text: 'Okay' },
      ]);
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
    let isValid = true;
    if (text.trim().length === 0) {
      isValid = false;
    }
    if (inputType === 'hours') {
      if (text > 8 || text < 1) {
        isValid = false;
        Alert.alert(
          'Duration invalid',
          'Duration of event needs to be between 1 to 8 hours.',
          [
            {
              text: 'Ok',
              onPress: () => {
                dispatchFormState({
                  type: FORM_INPUT,
                  value: '',
                  isValid: isValid,
                  input: inputType,
                });
              },
            },
          ]
        );
      }
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
    setError(null);
    setIsFetchingMarker(true);
    try {
      await coordLookUp(address);
    } catch (err) {
      setError(err.message);
    }
    setIsFetchingMarker(false);
    setMapLoaded(true);
  };

  const coordLookUp = async (address) => {
    setError(null);
    let coordsMongo = {
      latitude: null,
      longitude: null,
    };
    try {
      const locationData = await Location.geocodeAsync(address);

      let isValid = false;
      if (locationData) {
        (coordsMongo = {
          latitude: locationData[0].latitude,
          longitude: locationData[0].longitude,
        }),
          setEvent({
            location: {
              latitude: locationData[0].latitude,
              longitude: locationData[0].longitude,
            },
            thumbUrl: `${AWS_EVENT_TYPES}${eventType}.png`,
          }),
          setRegion({
            latitude: locationData[0].latitude,
            longitude: locationData[0].longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
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
      setError(err.message);
    }
  };

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

    if (!formState.formIsValid) {
      Alert.alert('Form not complete.', 'Please complete all parts of form', [
        { text: 'Okay' },
      ]);
      return;
    }

    setIsCreatingEvent(true);
    try {
      await dispatch(eventsActions.createEvent(formState));
      await dispatch(eventsActions.getLocalEvents(userLocation));
    } catch (err) {
      setError(err.message);
    }
    setIsCreatingEvent(false);
    setConfirmVisible(true);
  };

  const toEventDetailsHandler = () => {
    setConfirmVisible(false);
    props.navigation.navigate('Event Details', eventToPass);
  };

  if (isLoading || !userLocation) {
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
                style={styles.textInput}
                value={formState.inputValues.eventName}
                onChangeText={(text) => inputChangeHandler('eventName', text)}
              />
            </View>
            <View style={styles.eventTypeContainer}>
              <Text style={[styles.instructionText, { marginBottom: 15 }]}>
                Event Type:
              </Text>
              <View style={styles.eventTypeIconContainer}>
                <Text style={styles.chosenEventTypeText}>{eventType}</Text>
                <Entypo
                  name="triangle-down"
                  size={22}
                  onPress={eventTypeHandler}
                  style={{ paddingHorizontal: 2 }}
                />
                <View>
                  <Image
                    style={styles.pic}
                    source={{
                      uri: `${AWS_EVENT_TYPES}${eventType}.png`,
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.dateContainer}>
              <View style={styles.pickDateContainer}>
                <Text style={[styles.instructionText, { marginBottom: 5 }]}>
                  Select date and time:
                </Text>
              </View>
              <View
                style={[
                  styles.eventTypeIconContainer,
                  { marginBottom: 15, justifyContent: 'space-evenly' },
                ]}
              >
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
                  style={[styles.textInput]}
                  value={formState.inputValues.hours}
                  onChangeText={(text) => inputChangeHandler('hours', text)}
                />
              </View>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.instructionText}>Event Location:</Text>
              <TextInput
                placeholder="123 main street, mycity..."
                style={styles.textInput}
                autoCapitalize="words"
                value={formState.inputValues.address}
                onChangeText={(text) => inputChangeHandler('address', text)}
              />
              <View style={styles.buttonContainer}>
                {isFetchingMarker ? (
                  <CustomButton
                    onSelect={() =>
                      loadMapHandler(region, formState.inputValues.address)
                    }
                    style={{ flexDirection: 'row' }}
                  >
                    <Text style={styles.locateOnMapText}>Loading... </Text>
                    <ActivityIndicator
                      color="white"
                      size="small"
                      style={{ paddingRight: 15 }}
                    />
                  </CustomButton>
                ) : (
                  <CustomButton
                    onSelect={() =>
                      loadMapHandler(region, formState.inputValues.address)
                    }
                  >
                    <Text style={styles.locateOnMapText}>Add Map Marker</Text>
                  </CustomButton>
                )}
              </View>
            </View>
            <View style={styles.mapContainer}>
              {mapLoaded ? (
                <MapView
                  style={styles.map}
                  region={region}
                  minZoomLevel={12}
                  maxZoomLevel={17}
                  customMapStyle={mapStyle}
                >
                  {isFocused && mapLoaded && <CustomMarker data={event} />}
                </MapView>
              ) : null}
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.instructionText}>Description:</Text>
              <TextInput
                style={styles.textInput}
                value={formState.inputValues.description}
                multiline={true}
                returnKeyType="done"
                onChangeText={(text) => inputChangeHandler('description', text)}
              />
            </View>
            <View style={styles.buttonContainer}>
              {isCreatingEvent ? (
                <CustomButton
                  onSelect={createEventHandler}
                  style={{ flexDirection: 'row' }}
                >
                  <Text style={styles.locateOnMapText}>Creating Event</Text>
                  <ActivityIndicator
                    color="white"
                    size="small"
                    style={{ paddingRight: 15 }}
                  />
                </CustomButton>
              ) : (
                <CustomButton onSelect={createEventHandler}>
                  <Text style={styles.locateOnMapText}>Create Event</Text>
                </CustomButton>
              )}
            </View>
            <View style={styles.extraSpace}></View>
          </ScrollView>
        </View>
        {/* *****Modals***** */}
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
  textInput: {
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
    justifyContent: 'flex-start',
    marginVertical: 15,
  },
  eventTypeIconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  chosenEventTypeText: {
    width: 170,
    height: 30,
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
  iconClose: {},
  extraSpace: {
    height: 100,
  },
});
