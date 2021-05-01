import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import {
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
import { GOOGLE_MAPS } from '@env';

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

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

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
      eventType: '',
      address: '',
      location: '',
      description: '',
      hours: null,
    },
    inputValidities: {
      eventName: false,
      date: false,
      eventType: false,
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
    } else {
      Alert.alert('Wrong date!', 'Please pick a date/time in the future.', [
        { text: 'Ok' },
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
  //End of Date and time picker function

  const inputChangeHandler = (inputType, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
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
            thumbUrl:
              'https://dinge.s3.us-east-2.amazonaws.com/avatar/avatar.png',
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

  const eventTypeHandler = () => {
    setModalVisible(true);
  };

  const chooseEventType = (text) => {
    console.log(text);
    setModalVisible(false);
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
          <TextInput
            placeholder="enter event name"
            style={styles.tempInput}
            value={formState.inputValues.eventName}
            onChangeText={(text) => inputChangeHandler('eventName', text)}
          />
          <View style={styles.dateContainer}>
            <View style={styles.pickDateContainer}>
              <Text style={[styles.instructionText, { width: '50%' }]}>
                Pick date and time:
              </Text>
              <Ionicons
                name="calendar-outline"
                size={30}
                onPress={showDatepicker}
                style={{ marginRight: 20 }}
              />
              <SimpleLineIcons
                name="clock"
                size={30}
                onPress={showTimepicker}
                style={{ marginRight: 20 }}
              />
            </View>
            <View>
              <Text style={styles.instructionText}>
                Event Date:{' '}
                {formState.inputValidities.date && datePicked && timePicked
                  ? date.toISOString()
                  : null}
              </Text>
            </View>
          </View>

          <View>
            <TextInput
              placeholder="enter street address"
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
                minZoomLevel={10}
                maxZoomLevel={17}
              >
                {isFocused && mapLoaded && <CustomMarker data={tempEvent} />}
              </MapView>
            ) : null}
          </View>
          <View style={styles.eventTypeContainer}>
            <View
              style={[styles.buttonContainer, { alignItems: 'flex-start' }]}
            >
              <CustomButton onSelect={eventTypeHandler}>
                <Text style={styles.locateOnMapText}>Event Type:</Text>
              </CustomButton>
            </View>
            <View style={styles.eventTypeField}>
              <Text style={styles.instructionText}>{eventType}</Text>
            </View>
          </View>
        </View>
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text
                  style={styles.modalText}
                  onPress={() => chooseEventType('arts')}
                >
                  arts
                </Text>
                <Text style={styles.modalText}>business</Text>
                <Text style={styles.modalText}>community</Text>
                <Text style={styles.modalText}>culture</Text>
                <Text style={styles.modalText}>health</Text>
                <Text style={styles.modalText}>music</Text>
                <Text style={styles.modalText}>political</Text>
                <Text style={styles.modalText}>sports</Text>
                <Text style={styles.modalText}>other</Text>
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

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onDateChange}
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
    paddingVertical: 14,
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'cereal-medium',
  },
  tempInput: {
    borderColor: '#dddddd',
    borderRadius: 10,
    borderWidth: 0.5,
    fontSize: 16,
    fontFamily: 'cereal-light',
    paddingLeft: 15,
  },
  dateContainer: {
    marginVertical: 15,
  },
  pickDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
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
  locateOnMapText: {
    color: 'white',
    fontFamily: 'cereal-bold',
    paddingVertical: 8,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  mapContainer: {
    justifyContent: 'center',
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
    justifyContent: 'center',
  },
  eventTypeField: {
    marginVertical: 10,
    justifyContent: 'center',
    marginLeft: 20,
  },
  eventTypePicker: {
    height: 40,
    width: '50%',
    fontSize: 10,
    fontFamily: 'cereal-medium',
  },
  eventTypeText: {
    fontFamily: 'cereal-medium',
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
    padding: 20,
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
});

// dummy
// location: {
//   latitude: 43.65226097211218,
//   longitude: -79.39249034483628,
// },
// thumbUrl: 'https://dinge.s3.us-east-2.amazonaws.com/avatar/avatar.png',
