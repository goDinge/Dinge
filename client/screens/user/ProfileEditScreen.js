import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  View,
  Text,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import * as authActions from '../../store/actions/auth';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomMessageModal from '../../components/CustomMessageModal';
import CustomErrorModal from '../../components/CustomErrorModal';

import { PROFILE_UPDATE, PASSWORD_UPDATE } from '../../store/types';
import { profileReducer, passwordReducer } from '../../helpers/formReducer';

import Colors from '../../constants/Colors';

const ProfileEditScreen = (props) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);
  const [error, setError] = useState(undefined);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const authUser = props.route.params.authUser;

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(profileReducer, {
    inputValues: {
      name: authUser.name,
      email: authUser.email,
      website: authUser.website,
      facebook: authUser.facebook,
    },
    inputValidities: {
      name: false,
      email: false,
      website: false,
      facebook: false,
    },
    formIsValid: false,
  });

  const [passwordState, dispatchPasswordState] = useReducer(passwordReducer, {
    inputValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    inputValidities: {
      oldPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    },
    formIsValid: false,
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera permission to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (error) {
      setErrorModalVisible(true);
    }
  }, [error]);

  //update profile avatar
  const imagePickerHandler = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.2,
      });

      if (!result.cancelled) {
        setImage(result);
      }

      await dispatch(authActions.updateAuthAvatar(result));
    } catch (err) {
      setError(
        'Did not upload avatar. Please try again if you intended to upload a new avatar.'
      );
      setErrorModalVisible(true);
    }
  };

  const updateProfileHandler = async () => {
    setError(null);
    setIsUpdating(true);
    if (!formState.formIsValid) {
      setError(
        'Please make sure name and email fields are completed. Website and Facebook are not necessarily, but if you wish to list them, please make sure they are correct.'
      );
      setErrorModalVisible(true);
      return;
    }

    try {
      await dispatch(authActions.updateProfile(formState.inputValues));
      setModalMessage('Profile updated.');
      setModalVisible(true);
    } catch (err) {
      setError(err.message);
    }
    setIsUpdating(false);
  };

  const changePasswordHandler = async () => {
    if (
      passwordState.inputValues.newPassword !==
      passwordState.inputValues.confirmNewPassword
    ) {
      setError('Please make sure your new password inputs are identical.');
      setErrorModalVisible(true);
      return;
    }

    setError(null);
    setIsPasswordChanging(true);
    try {
      await dispatch(authActions.changePassword(passwordState.inputValues));
      setModalMessage('Password changed.');
      setModalVisible(true);
    } catch (err) {
      setError(err.message);
    }
    setIsPasswordChanging(false);
  };

  const closeModalHandler = async () => {
    setError(null);
    setModalMessage('');
    setModalVisible(false);
    setIsUpdating(false);
    setModalDeleteVisible(false);
    setErrorModalVisible(false);
  };

  const deleteAccountModalHandler = () => {
    setModalDeleteVisible(true);
  };

  const deleteAccountHandler = async () => {
    setError(null);
    try {
      await dispatch(authActions.logout());
      await dispatch(authActions.deleteAccount());
    } catch (err) {
      setError(err.message);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: PROFILE_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const passwordTextChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchPasswordState({
        type: PASSWORD_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchPasswordState]
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <ScrollView style={{ width: '100%' }}>
          <View style={styles.editProfileContainer}>
            <Text style={styles.title}>Your Profile</Text>
            <View style={styles.avatarContainer}>
              <Pressable onLongPress={imagePickerHandler}>
                <Image
                  style={styles.avatar}
                  source={{ uri: authUser.avatar }}
                  defaultSource={require('../../assets/avatar.png')}
                />
              </Pressable>
            </View>
            <View style={styles.fieldContainer}>
              <CustomInput
                id="name"
                label="Name:"
                labelColor="#999"
                keyboardType="default"
                autoCapitalize="none"
                errorText="Please update your name"
                onInputChange={inputChangeHandler}
                initialValue={authUser.name}
                initiallyValid="true"
                required
                style={styles.textInput}
              />
              <CustomInput
                id="email"
                label="Email:"
                labelColor="#999"
                keyboardType="default"
                autoCapitalize="none"
                errorText="Please update your email"
                onInputChange={inputChangeHandler}
                initialValue={authUser.email}
                initiallyValid="true"
                required
                email
                style={styles.textInput}
              />
              <CustomInput
                id="website"
                label="Website:"
                labelColor="#999"
                keyboardType="default"
                placeholder={
                  authUser.website ? null : 'example: www.mywebsite.com'
                }
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue={authUser.website ? authUser.website : null}
                initiallyValid="true"
                style={styles.textInput}
              />
              <CustomInput
                id="facebook"
                label="Facebook:"
                labelColor="#999"
                keyboardType="default"
                placeholder={
                  authUser.facebook ? null : 'find link in your facebook app'
                }
                autoCapitalize="none"
                onInputChange={inputChangeHandler}
                initialValue={authUser.facebook ? authUser.facebook : null}
                initiallyValid="true"
                facebook
                style={styles.textInput}
              />
            </View>
            <View style={styles.buttonContainer}>
              {isUpdating ? (
                <CustomButton
                  style={{ flexDirection: 'row' }}
                  onSelect={updateProfileHandler}
                >
                  <Text style={styles.buttonText}>Updating Profile...</Text>
                  <ActivityIndicator
                    color="white"
                    size="small"
                    style={{ paddingRight: 10 }}
                  />
                </CustomButton>
              ) : (
                <CustomButton
                  style={{ flexDirection: 'row' }}
                  onSelect={updateProfileHandler}
                >
                  <Text style={styles.buttonText}>Update Profile</Text>
                </CustomButton>
              )}
            </View>
          </View>
          <View style={styles.changePasswordContainer}>
            <Text style={styles.title}>Your Password</Text>
            <View style={styles.fieldContainer}>
              <CustomInput
                id="oldPassword"
                label="Current Password:"
                labelColor="#999"
                keyboardType="default"
                autoCapitalize="none"
                onInputChange={passwordTextChangeHandler}
                secureTextEntry
                initiallyValid="false"
                required
                style={styles.textInput}
              />
              <CustomInput
                id="newPassword"
                label="New Password:"
                labelColor="#999"
                keyboardType="default"
                autoCapitalize="none"
                onInputChange={passwordTextChangeHandler}
                secureTextEntry
                initiallyValid="false"
                required
                style={styles.textInput}
              />
              <CustomInput
                id="confirmNewPassword"
                label="Confirm New Password:"
                labelColor="#999"
                keyboardType="default"
                autoCapitalize="none"
                onInputChange={passwordTextChangeHandler}
                secureTextEntry
                initiallyValid="false"
                required
                style={styles.textInput}
              />
            </View>
            <View style={styles.buttonContainer}>
              {isPasswordChanging ? (
                <CustomButton
                  style={{ flexDirection: 'row' }}
                  onSelect={changePasswordHandler}
                >
                  <Text style={styles.buttonText}>Changing Password...</Text>
                  <ActivityIndicator
                    color="white"
                    size="small"
                    style={{ paddingRight: 10 }}
                  />
                </CustomButton>
              ) : (
                <CustomButton
                  style={{ flexDirection: 'row' }}
                  onSelect={changePasswordHandler}
                >
                  <Text style={styles.buttonText}>Change Password</Text>
                </CustomButton>
              )}
            </View>
          </View>
          <View style={styles.accountContainer}>
            <Text style={styles.title}>Your Account</Text>
            <View style={styles.buttonContainer}>
              <CustomButton
                style={{ flexDirection: 'row' }}
                onSelect={deleteAccountModalHandler}
              >
                <Text style={styles.buttonText}>Delete Account</Text>
              </CustomButton>
            </View>
          </View>
        </ScrollView>
        {/* MODALS  */}
        <CustomMessageModal
          message={modalMessage}
          messageModal={modalVisible}
          onClose={closeModalHandler}
        />
        <CustomErrorModal
          error={error}
          errorModal={errorModalVisible}
          onClose={closeModalHandler}
        />
        <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalDeleteVisible}
            onRequestClose={() => {
              setModalDeleteVisible(!modalDeleteVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  Are you sure you want to permanently delete your account?
                </Text>
                <View style={styles.buttonsContainer}>
                  <CustomButton onSelect={deleteAccountHandler}>
                    <Text style={styles.buttonText}>Yes</Text>
                  </CustomButton>
                  <CustomButton
                    onSelect={() => setModalDeleteVisible(!modalDeleteVisible)}
                  >
                    <Text style={styles.buttonText}>No</Text>
                  </CustomButton>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
  actIndicator: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    width: '90%',
    height: '93%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  editProfileContainer: {
    width: '100%',
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  changePasswordContainer: {
    paddingTop: 15,
    width: '100%',
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  accountContainer: {
    paddingTop: 15,
    width: '100%',
    paddingBottom: 20,
  },
  fieldContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
    paddingBottom: 5,
  },
  userName: {
    fontFamily: 'cereal-medium',
    fontSize: 24,
    color: '#444',
  },
  userEmail: {
    fontFamily: 'cereal-book',
    fontSize: 16,
    color: '#999',
  },
  title: {
    textAlign: 'left',
    fontFamily: 'cereal-medium',
    fontSize: 22,
    color: Colors.primary,
    paddingVertical: 10,
  },
  textInput: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    fontSize: 14,
  },
  text: {
    fontFamily: 'cereal-book',
    fontSize: 18,
    color: '#999',
    alignSelf: 'flex-start',
  },
  eventsList: {
    width: '100%',
    paddingTop: 4,
    paddingBottom: 8,
  },
  bottomContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderTopWidth: 1,
  },
  buttonContainer: {
    marginVertical: 15,
    alignItems: 'center',
  },
  button: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'cereal-bold',
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  modalView: {
    width: '96%',
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
  buttonsContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
