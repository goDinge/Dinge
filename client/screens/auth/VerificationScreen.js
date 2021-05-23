import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import * as authActions from '../../store/actions/auth';

import { FORM_INPUT_UPDATE } from '../../store/types';
import Colors from '../../constants/Colors';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const ForgotPasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const verified = useSelector((state) => state.auth.verified);

  const dispatch = useDispatch();

  useEffect(() => {
    if (verified) {
      props.navigation.navigate('Reset Password');
    }
  }, [verified]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      code: '',
    },
    inputValidities: {
      code: false,
    },
    formIsValid: false,
  });

  console.log(formState);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const verificationCodeHandler = async (code) => {
    console.log('code: ', code);
    await dispatch(authActions.verifyCode(code));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={15}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.outerContainer}>
        <View style={styles.container}>
          <Text style={styles.titleText}>Dinge</Text>
          <Text style={styles.mainText}>
            Enter your 4-digit verification code here. If you did not receive an
            email from Dinge. Please go back and get another verification code.
          </Text>
          <View style={styles.authContainer}>
            <CustomInput
              id="code"
              label="Verification Code:"
              labelColor="white"
              keyboardType="numeric"
              autoCapitalize="none"
              errorText="Please enter the verification code"
              onInputChange={inputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
            />
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              style={styles.mainButton}
              onSelect={() =>
                verificationCodeHandler(formState.inputValues.code)
              }
              //onSelect={() => props.navigation.navigate('Reset Password')}
            >
              <Text style={styles.mainButtonText}>Verify My Code</Text>
            </CustomButton>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  outerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '94%',
    paddingTop: 20,
    paddingBottom: 30,
  },
  indicatorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    alignSelf: 'flex-start',
    fontFamily: 'cereal-black',
    fontSize: 40,
    color: '#fff',
  },
  authContainer: {
    width: '100%',
    maxHeight: 600,
    paddingVertical: 20,
    alignItems: 'center',
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  buttonGroupContainer: {
    marginTop: 15,
  },
  buttonContainer: {
    marginVertical: 3,
    marginTop: 30,
    alignSelf: 'center',
  },
  mainText: {
    fontSize: 18,
    paddingTop: 30,
    textAlign: 'left',
    fontFamily: 'cereal-bold',
    color: 'white',
  },
  mainButtonText: {
    fontSize: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontFamily: 'cereal-bold',
    color: 'white',
  },
  bottomContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainButton: {
    width: 280,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
  },
});
