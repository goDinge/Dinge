import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
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

import { AWS_EVENT_TYPES } from '@env';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import * as eventActions from '../../store/actions/event';
import * as eventsActions from '../../store/actions/events';

import CustomButton from '../../components/CustomButton';
import CustomMarker from '../../components/CustomMarker';
import CustomMessageModal from '../../components/CustomMessageModal';
import CustomErrorModal from '../../components/CustomErrorModal';
import Colors from '../../constants/Colors';

import { convertAMPM, properDate } from '../../helpers/dateConversions';
import eventTypes from '../../helpers/eventTypes';

const mapStyle = require('../../helpers/mapStyle.json');
const FORM_INPUT = 'FORM_INPUT';
const SCREEN_WIDTH = Dimensions.get('window').width;

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
  const eventId = props.route.params ? props.route.params.event : null;
  const editedEvent = useSelector((state) =>
    state.events.events.find((event) => event._id === eventId)
  );

  const updatedEvent = useSelector((state) => state.event.event);
  const newEvent = useSelector((state) => state.events.newEvent);
  const userLocation = useSelector((state) => state.location.location);

  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMarker, setIsFetchingMarker] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [eventToPass, setEventToPass] = useState(null);
  const [date, setDate] = useState(
    editedEvent ? editedEvent.date : new Date(Date.now())
  );
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [datePicked, setDatePicked] = useState(editedEvent ? true : false);
  const [timePicked, setTimePicked] = useState(editedEvent ? true : false);
  const [image, setImage] = useState(editedEvent ? editedEvent.eventPic : null);
  const [region, setRegion] = useState(
    editedEvent
      ? {
          latitude: editedEvent.location.latitude,
          longitude: editedEvent.location.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }
      : userLocation
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const [eventLocation, setEventLocation] = useState(
    editedEvent
      ? {
          location: {
            latitude: editedEvent.location.latitude,
            longitude: editedEvent.location.longitude,
          },
          thumbUrl: editedEvent.thumbUrl,
        }
      : {
          location: {
            latitude: 0,
            longitude: 0,
          },
        }
  );
  const [eventType, setEventType] = useState(
    editedEvent ? editedEvent.eventType : 'community'
  );
  const [messageModal, setMessageModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    {
      editedEvent ? setMapLoaded(true) : null;
    }
  }, [editedEvent]);

  useEffect(() => {
    {
      newEvent ? setEventToPass(newEvent) : null;
    }
  }, [newEvent]);

  useEffect(() => {
    {
      updatedEvent ? setEventToPass(updatedEvent) : null;
    }
  }, [updatedEvent]);

  useEffect(() => {
    if (error) {
      setErrorModalVisible(true);
    }
  }, [error]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      setRegion(
        editedEvent
          ? {
              latitude: editedEvent.location.latitude,
              longitude: editedEvent.location.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }
          : userLocation
      );
    })();
  }, [setRegion]);

  //backwards calculation from event endDate to hours
  const calcEditedHours = () => {
    const result =
      (new Date(editedEvent.endDate).getTime() -
        new Date(editedEvent.date).getTime()) /
      (1000 * 60 * 60);
    const resultString = result.toString();
    return resultString;
  };

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      eventName: editedEvent ? editedEvent.eventName : '',
      date: editedEvent ? editedEvent.date : '',
      eventType: editedEvent ? editedEvent.eventType : 'community',
      eventPic: editedEvent ? editedEvent.eventPic : '',
      thumbUrl: editedEvent
        ? editedEvent.thumbUrl
        : `${AWS_EVENT_TYPES}/community.png`,
      address: editedEvent ? editedEvent.address : '',
      location: editedEvent ? editedEvent.location : '',
      description: editedEvent ? editedEvent.description : '',
      hours: editedEvent ? calcEditedHours() : '',
    },
    inputValidities: {
      eventName: editedEvent ? true : false,
      date: editedEvent ? true : false,
      eventType: true,
      eventPic: editedEvent ? true : false,
      thumbUrl: true,
      location: editedEvent ? true : false,
      description: editedEvent ? true : false,
      hours: editedEvent ? true : false,
    },
    formIsValid: editedEvent ? true : false,
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
      setModalMessage('Careful! Start time must be after this moment.');
      setMessageModalVisible(true);
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

  const imagePickerHandler = async () => {
    let isValid;
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.2,
      });

      if (!result.cancelled) {
        setImage(result.uri);
        isValid = true;
      }

      dispatchFormState({
        type: FORM_INPUT,
        value: result,
        isValid: isValid,
        input: 'eventPic',
      });
    } catch (err) {
      setError(err.message);
    }
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
        if (text) {
          setError('Duration of event needs to be between 1 to 8 hours.');
          setErrorModalVisible(true);
        }
        dispatchFormState({
          type: FORM_INPUT,
          value: null,
          isValid: isValid,
          input: inputType,
        });
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
          setEventLocation({
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
    setEventModalVisible(true);
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
    setEventModalVisible(false);
  };

  const createEventHandler = async () => {
    setError(null);

    if (!formState.formIsValid) {
      setError('Form not complete. Please complete all parts of form.');
      setErrorModalVisible(true);
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
    setConfirmModalVisible(true);
  };

  const updateEventHandler = async () => {
    setError(null);

    if (!formState.formIsValid) {
      setError('Form not complete. Please complete all parts of form.');
      setErrorModalVisible(true);
      return;
    }

    if (Date.parse(formState.inputValues.date) < Date.now()) {
      setError('Please make sure start date and time is after this moment.');
      setErrorModalVisible(true);
      return;
    }

    setIsCreatingEvent(true);
    try {
      await dispatch(eventActions.updateEvent(formState, eventId));
      await dispatch(eventsActions.getLocalEvents(userLocation));
    } catch (err) {
      setError(err.message);
    }
    setIsCreatingEvent(false);
    setConfirmModalVisible(true);
  };

  const toEventDetailsHandler = (eventToPass) => {
    setConfirmModalVisible(false);
    props.navigation.navigate('Event Details', eventToPass);
  };

  const closeModalHandler = async () => {
    setError(null);
    setModalMessage('');
    setMessageModalVisible(false);
    setErrorModalVisible(false);
  };

  const renderButton = () => {
    if (editedEvent) {
      if (isCreatingEvent) {
        return (
          <CustomButton
            onSelect={updateEventHandler}
            style={styles.buttonLoading}
          >
            <Text style={styles.creatingEventButtonText}>
              Updating Event...
            </Text>
            <ActivityIndicator
              color="white"
              size="small"
              style={{ marginRight: 15 }}
            />
          </CustomButton>
        );
      } else {
        return (
          <CustomButton onSelect={updateEventHandler}>
            <Text style={styles.creatingEventButtonText}>Update Event</Text>
          </CustomButton>
        );
      }
    } else if (isCreatingEvent) {
      return (
        <CustomButton
          onSelect={createEventHandler}
          style={styles.buttonLoading}
        >
          <Text style={styles.creatingEventButtonText}>Creating Event...</Text>
          <ActivityIndicator
            color="white"
            size="small"
            style={{ marginRight: 15 }}
          />
        </CustomButton>
      );
    } else {
      return (
        <CustomButton onSelect={createEventHandler}>
          <Text style={styles.creatingEventButtonText}>Create Event</Text>
        </CustomButton>
      );
    }
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
            <View style={styles.buttonContainer}>
              <CustomButton onSelect={imagePickerHandler}>
                <Text style={styles.locateOnMapText}>Pick Event Image</Text>
              </CustomButton>
            </View>
            <View>
              {image ? (
                <Image style={styles.image} source={{ uri: image }} />
              ) : null}
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
                  color={datePicked ? Colors.secondary : 'black'}
                  size={30}
                  onPress={showDatepicker}
                  style={{ marginRight: 40 }}
                />
                <SimpleLineIcons
                  name="clock"
                  color={timePicked ? Colors.secondary : 'black'}
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
                  style={styles.textInput}
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
                  {isFocused && mapLoaded && (
                    <CustomMarker data={eventLocation} />
                  )}
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
            <View style={styles.buttonContainer}>{renderButton()}</View>
            <View style={styles.extraSpace}></View>
          </ScrollView>
        </View>
        {/* *****Modals***** */}
        <CustomErrorModal
          error={error}
          errorModal={errorModalVisible}
          onClose={closeModalHandler}
        />
        <CustomMessageModal
          message={modalMessage}
          messageModal={messageModal}
          onClose={closeModalHandler}
        />
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={eventModalVisible}
            onRequestClose={() => {
              setEventModalVisible(!eventModalVisible);
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
                    onPress={() => setModalVisible(!eventModalVisible)}
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
            visible={confirmModalVisible}
            onRequestClose={() => {
              setConfirmModalVisible(!confirmModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  {editedEvent ? 'Event Edited!' : 'Event Created!'}
                </Text>
                <View style={styles.buttonContainer}>
                  {editedEvent ? (
                    <CustomButton
                      onSelect={() => toEventDetailsHandler(updatedEvent)}
                    >
                      <Text style={styles.locateOnMapText}>
                        Go See Your Updated Event
                      </Text>
                    </CustomButton>
                  ) : (
                    <CustomButton
                      onSelect={() => toEventDetailsHandler(eventToPass)}
                    >
                      <Text style={styles.locateOnMapText}>
                        Go See Your New Event
                      </Text>
                    </CustomButton>
                  )}
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
            display={mode === 'date' ? 'default' : 'spinner'}
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
  image: {
    width: '100%',
    height: (SCREEN_WIDTH * 9) / 16,
    marginBottom: 15,
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
  dateContainer: {
    marginTop: 15,
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
  createEventButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 12,
    paddingHorizontal: 26,
    fontSize: 20,
  },
  creatingEventButtonText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 20,
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
  buttonLoading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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
  //modals
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

// Alert.alert(
//   'Duration invalid',
//   'Duration of event needs to be between 1 to 8 hours.',
//   [
//     {
//       text: 'Ok',
//       onPress: () => {
//         dispatchFormState({
//           type: FORM_INPUT,
//           value: null,
//           isValid: isValid,
//           input: inputType,
//         });
//       },
//     },
//   ]
// );
