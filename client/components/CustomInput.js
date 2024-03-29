import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { INPUT_CHANGE, INPUT_BLUR } from '../store/types';

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const CustomInput = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: props.initialValue ? true : false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    // if (inputState.touched) {
    //   onInputChange(id, inputState.value, inputState.isValid);
    // }
    onInputChange(id, inputState.value, inputState.isValid);
  }, [inputState, onInputChange, id]);

  const textChangeHandler = (text) => {
    const facebookRegex = /www.facebook.com/;
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.facebook) {
      if (text !== '' && !facebookRegex.test(text.toLowerCase())) {
        isValid = false;
      }
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    dispatch({
      type: INPUT_CHANGE,
      value: text,
      isValid: isValid,
    });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.formControl}>
      <Text style={[styles.label, { color: props.labelColor }]}>
        {props.label}
      </Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
        returnKeyType="next"
      />
      {/* {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: '100%',
    marginVertical: 8,
  },
  label: {
    fontFamily: 'cereal-book',
    fontSize: 18,
    color: '#999',
    alignSelf: 'flex-start',
  },
  input: {
    fontSize: 16,
    fontFamily: 'cereal-book',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderColor: '#ccc',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    marginVertical: 2,
    marginBottom: 4,
  },
  errorText: {
    fontFamily: 'cereal-book',
    color: 'blue',
    fontSize: 12,
  },
});

export default CustomInput;
