import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import * as authActions from '../../store/actions/auth';

import { FORM_INPUT_UPDATE } from '../../store/types';
import { formReducer } from '../../helpers/formReducer';

import Colors from '../../constants/Colors';

const ForgotPasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const veriCode = useSelector((state) => state.auth.veriCode);

  const dispatch = useDispatch();

  useEffect(() => {
    if (veriCode) {
      props.navigation.navigate('Verification');
    }
  }, [veriCode]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
    },
    inputValidities: {
      email: false,
    },
    formIsValid: false,
  });

  //console.log(formState);

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

  const verificationHandler = async (email) => {
    setIsLoading(true);
    try {
      await dispatch(authActions.forgotPassword(email));
    } catch (err) {
      console.log(err.message);
    }
    setIsLoading(false);
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
            To reset your password, please enter the email address associated
            with your profile. An email will be sent to your email address with
            a 4-digit verification code.
          </Text>
          <View style={styles.authContainer}>
            <CustomInput
              id="email"
              label="Email:"
              labelColor="white"
              keyboardType="email-address"
              autoCapitalize="none"
              errorText="Please enter your email"
              onInputChange={inputChangeHandler}
              initialValue=""
              required
              style={styles.textInput}
            />
          </View>
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <CustomButton
                style={styles.loadingMainButton}
                onSelect={() =>
                  verificationHandler(formState.inputValues.email)
                }
                secureTextEntry
              >
                <Text style={styles.mainButtonText}>Getting Code...</Text>
                <ActivityIndicator color="white" size="small" />
              </CustomButton>
            ) : (
              <CustomButton
                style={styles.mainButton}
                onSelect={() =>
                  verificationHandler(formState.inputValues.email)
                }
                //onSelect={() => props.navigation.navigate('Verification')}
              >
                <Text style={styles.mainButtonText}>Get Verification Code</Text>
              </CustomButton>
            )}
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
  loadingMainButton: {
    width: 280,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
