import React, { useState, useReducer } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import DateTimePicker from '@react-native-community/datetimepicker';
import Geocoder from 'react-native-geocoding';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';

import * as eventsActions from '../../store/actions/events';
import Colors from '../../constants/Colors';
import CustomButton from '../../components/CustomButton';
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

  const [date, setDate] = useState(new Date(Date.now()));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();

  const coordLookUp = async () => {
    try {
      const json = await Geocoder.from('393 Dundas St W, Toronto, ON M5T 1G6');
      var location = json.results[0].geometry.location;
      console.log(location);
    } catch (err) {
      console.log(err);
    }
  };

  //coordLookUp();

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
      date: true,
      eventType: false,
      location: false,
      description: false,
      hours: false,
    },
    formIsValid: false,
  });

  console.log(formState);

  //Date and Time picker functions
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let isValid;
    if (currentDate > date) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT,
      value: currentDate,
      isValid: isValid,
      input: 'date',
    });
  };
  console.log(date);
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
    console.log('input change');
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text>{authUser.name}</Text>
          <TextInput
            placeholder="Event Name"
            value={formState.inputValues.eventName}
            onChangeText={(text) => inputChangeHandler('eventName', text)}
          />
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
              Date: {date.toISOString()}
            </Text>
          </View>
          <View>
            <TextInput
              placeholder="address"
              value={formState.inputValues.address}
              onChangeText={(text) => inputChangeHandler('address', text)}
            />
          </View>
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
  innerContainer: {
    width: '90%',
    paddingVertical: 10,
    backgroundColor: 'yellow',
  },
  instructionText: {
    fontSize: 16,
    fontFamily: 'cereal-medium',
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
});
