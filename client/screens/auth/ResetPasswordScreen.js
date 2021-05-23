import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import * as authActions from '../../store/actions/auth';

import { FORM_INPUT_UPDATE } from '../../store/types';
import { formReducer } from '../../helpers/formReducer';

import Colors from '../../constants/Colors';

const ResetPasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const veriCode = useSelector((state) => state.auth.veriCode);
  const newPasswordState = useSelector((state) => state.auth.newPassword);

  useEffect(() => {
    if (newPasswordState) {
      Alert.alert(
        'New Password Setup.',
        'You now have a new password. Please try logging in again.',
        [{ text: 'Okay', onPress: () => props.navigation.navigate('Auth') }]
      );
    }
  }, [newPasswordState]);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      password: '',
      passwordConfirm: '',
    },
    inputValidities: {
      password: false,
      passwordConfirm: false,
    },
    formIsValid: false,
  });

  //console.log('formState: ', formState);

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

  const setNewPasswordHandler = async (password, confirmPassword, veriCode) => {
    setIsLoading(true);
    try {
      await dispatch(
        authActions.setNewPassword(password, confirmPassword, veriCode)
      );
      //props.navigation.navigate('Auth');
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
            Enter your new password. Please make sure to confirm your new
            password by entering it again.
          </Text>
          <View style={styles.authContainer}>
            <CustomInput
              id="password"
              label="New Password:"
              labelColor="white"
              keyboardType="default"
              autoCapitalize="none"
              errorText="Please enter your new password"
              onInputChange={inputChangeHandler}
              initialValue=""
              secureTextEntry
              required
              style={styles.textInput}
            />
            <CustomInput
              id="passwordConfirm"
              label="Confirm New Password:"
              labelColor="white"
              keyboardType="default"
              autoCapitalize="none"
              errorText="Please confirm your new password"
              onInputChange={inputChangeHandler}
              initialValue=""
              secureTextEntry
              required
              style={styles.textInput}
            />
          </View>
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <CustomButton
                style={styles.loadingMainButton}
                onSelect={() =>
                  setNewPasswordHandler(
                    formState.inputValues.password,
                    formState.inputValues.passwordConfirm,
                    veriCode
                  )
                }
              >
                <Text style={styles.mainButtonText}>Setting Password... </Text>
                <ActivityIndicator color="white" size="small" />
              </CustomButton>
            ) : (
              <CustomButton
                style={styles.mainButton}
                onSelect={() =>
                  setNewPasswordHandler(
                    formState.inputValues.password,
                    formState.inputValues.passwordConfirm,
                    veriCode
                  )
                }
              >
                <Text style={styles.mainButtonText}>Set New Password</Text>
              </CustomButton>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;

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
