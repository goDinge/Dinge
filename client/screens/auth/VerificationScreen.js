import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomErrorModal from '../../components/CustomErrorModal';

import * as authActions from '../../store/actions/auth';

import { FORM_INPUT_UPDATE } from '../../store/types';
import { formReducer } from '../../helpers/formReducer';

import Colors from '../../constants/Colors';

const ForgotPasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const verified = useSelector((state) => state.auth.verified);

  const dispatch = useDispatch();

  useEffect(() => {
    if (verified) {
      props.navigation.navigate('Reset Password');
    }
  }, [verified]);

  useEffect(() => {
    if (error) {
      setErrorModalVisible(true);
    }
  }, [error]);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      code: '',
    },
    inputValidities: {
      code: false,
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

  const verificationCodeHandler = async (code) => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.verifyCode(code));
    } catch (err) {
      setError(err.messsage);
    }
    setIsLoading(false);
  };

  const closeModalHandler = () => {
    setError(null);
    setErrorModalVisible(false);
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
            {isLoading ? (
              <CustomButton
                style={styles.loadingMainButton}
                onSelect={() =>
                  verificationCodeHandler(formState.inputValues.code)
                }
                secureTextEntry
              >
                <Text style={styles.mainButtonText}>Verifying My Code...</Text>
                <ActivityIndicator color="white" size="small" />
              </CustomButton>
            ) : (
              <CustomButton
                style={styles.mainButton}
                onSelect={() =>
                  verificationCodeHandler(formState.inputValues.code)
                }
                //onSelect={() => props.navigation.navigate('Reset Password')}
              >
                <Text style={styles.mainButtonText}>Verify My Code</Text>
              </CustomButton>
            )}
          </View>
        </View>
      </ScrollView>
      <CustomErrorModal
        error={error}
        errorModal={errorModalVisible}
        onClose={closeModalHandler}
      />
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
