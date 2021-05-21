import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';

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

const Auth = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [isSignup, setIsSignup] = useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: '',
      email: '',
      password: '',
      password2: '',
    },
    inputValidities: {
      name: false,
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      console.log(formState);
      if (formState.inputValues.password !== formState.inputValues.password2) {
        Alert.alert(
          'Password Invalid',
          'Please make sure your confirm password is identical to your password',
          [{ text: 'Okay' }]
        );
        return;
      }
      action = authActions.register(
        formState.inputValues.name,
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
      console.log(formState);
    }
    setError(null);
    try {
      await dispatch(action);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={15}
      style={styles.screen}
    >
      {isLoading ? (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.outerContainer}>
          <View style={styles.container}>
            <Text style={styles.titleText}>Dinge</Text>
            <View style={styles.authContainer}>
              <Text style={styles.subtitleText}>
                {isSignup ? 'Sign-up' : 'Login'}
              </Text>
              {isSignup ? (
                <CustomInput
                  id="name"
                  label="Name:"
                  labelColor="white"
                  keyboardType="default"
                  autoCapitalize="none"
                  errorText="Please enter your name"
                  onInputChange={inputChangeHandler}
                  initialValue=""
                  required
                  style={styles.textInput}
                />
              ) : null}
              <CustomInput
                id="email"
                label="Email:"
                labelColor="white"
                keyboardType="email-address"
                autoCapitalize="none"
                errorText="Please enter a valid email"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
              <CustomInput
                id="password"
                label="Password:"
                labelColor="white"
                keyboardType="default"
                secureTextEntry
                autoCapitalize="none"
                minLength={6}
                errorText="Please enter a valid password"
                onInputChange={inputChangeHandler}
                initialValue=""
                required
                style={styles.textInput}
              />
              {isSignup ? (
                <CustomInput
                  id="password2"
                  label="Confirm Password:"
                  labelColor="white"
                  keyboardType="default"
                  secureTextEntry
                  autoCapitalize="none"
                  minLength={6}
                  errorText="Please confirm your password"
                  onInputChange={inputChangeHandler}
                  initialValue=""
                  required
                  style={styles.textInput}
                />
              ) : null}
              <View style={styles.buttonContainer}>
                <CustomButton style={styles.mainButton} onSelect={authHandler}>
                  <Text style={styles.mainButtonText}>
                    {isSignup ? 'Sign-up' : 'Login'}
                  </Text>
                </CustomButton>
              </View>
            </View>
            <View style={styles.bottomContainer}>
              <CustomButton
                title="Sign-up"
                style={styles.buttonContainer}
                onSelect={() => setIsSignup((prevState) => !prevState)}
              >
                <Text style={styles.buttonText}>
                  {isSignup ? 'Login' : 'Sign-up'}
                </Text>
              </CustomButton>
              <CustomButton
                title="Forgot Password"
                style={styles.buttonContainer}
                onSelect={() => props.navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.buttonText}>Forgot Password</Text>
              </CustomButton>
            </View>
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
};

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
    justifyContent: 'space-between',
    width: '80%',
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
    alignItems: 'center',
  },
  subtitleText: {
    color: '#fff',
    fontSize: 28,
    fontFamily: 'cereal-bold',
    alignSelf: 'flex-start',
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
  },
  buttonText: {
    fontSize: 18,
    paddingVertical: 8,
    paddingHorizontal: 2,
    textAlign: 'center',
    fontFamily: 'cereal-bold',
    color: 'white',
  },
  mainButtonText: {
    fontSize: 24,
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
    width: 200,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
  },
});

export default Auth;
