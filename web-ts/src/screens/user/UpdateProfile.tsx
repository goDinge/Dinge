import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { AppState } from '../../store/reducers/rootReducer';
import { AuthState, profileObj } from '../../store/interfaces';
import {
  Box,
  FormGroup,
  FormControl,
  TextField,
  Button,
  Input,
} from '@material-ui/core';
import { Colors } from '../../constants/Colors';

import * as authActions from '../../store/actions/auth';
import CustomError from '../../components/CustomError';
import CustomLocalMessage from '../../components/CustomLocalMessage';
import CustomAvatarEditor from '../../components/CustomAvatarEditor';

const UpdateProfile = () => {
  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = authState.authUser;

  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarCroppedUrl, setAvatarCroppedUrl] = useState<string>('');
  //const [avatar, setAvatar] = useState<Blob | string | null>(null);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<profileObj>({
    name: authUser?.name,
    email: authUser?.email,
    website: authUser?.website,
    facebook: authUser?.facebook,
  });
  const [password, setPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const dispatch = useDispatch<Dispatch<any>>();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onChangePassword = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPassword({ ...password, [e.target.id]: e.target.value });
  };

  const updateProfileHandler = async () => {
    setError(null);
    setUpdating(true);

    if (formData.name === '' || formData.email === '') {
      setUpdating(false);
      setError('Please make sure at least name and email fields are filled.');
      return;
    }

    try {
      await dispatch(authActions.updateProfile(formData));
      setMessage('Profile updated');
      setUpdating(false);
    } catch (err) {
      setError(err.message);
    }
    setUpdating(false);
  };

  const changePasswordHandler = async () => {
    setError(null);
    setPasswordUpdating(true);

    if (password.newPassword !== password.confirmNewPassword) {
      setError('Please make sure your new password inputs are identical.');
      setPasswordUpdating(false);
      return;
    }

    try {
      await dispatch(authActions.changePassword(password));
      setPasswordUpdating(false);
      setMessage('Password updated');
      setPassword({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err) {
      setError(err.message);
    }
    setPasswordUpdating(false);
  };

  const onClose = () => {
    setError(null);
    setMessage(null);
    setAvatarUrl('');
  };

  return (
    <div className="calender-screen">
      <div className="profile-container">
        <div className="profile-inner-container">
          <p className="profile-title">Your Profile</p>
          <div className="profile-avatar-update-container">
            <FormControl style={{ alignSelf: 'center' }}>
              <Button
                htmlFor="avatar"
                component="label"
                style={{ width: 130, borderRadius: 65 }}
              >
                {avatarCroppedUrl ? (
                  <img
                    className="profile-avatar-update"
                    alt="profile"
                    src={avatarCroppedUrl}
                  />
                ) : (
                  <img
                    className="profile-avatar-update"
                    alt="profile"
                    src={authUser?.avatar}
                  />
                )}
              </Button>
              <Input
                type="file"
                id="avatar"
                style={{ display: 'none' }}
                //onChange will not be triggered if user selects the same pic
                onChange={(e: any) => {
                  if (e !== null) {
                    setAvatarUrl(URL.createObjectURL(e.target.files[0]));
                    // setAvatar(e.target.files[0]);
                  } else {
                    return;
                  }
                }}
              />
            </FormControl>
            <p style={{ alignSelf: 'center' }}>
              Click image to choose new avatar
            </p>
          </div>
          <div className="create-event-inner-container">
            <FormGroup sx={{ fontFamily: 'AirbnbCerealMedium' }}>
              <Box className="create-event-input-container">
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    required
                    id="name"
                    type="text"
                    label="Name:"
                    inputProps={{ maxLength: 300 }}
                    value={formData.name}
                    onChange={(e) => onChange(e)}
                  />
                </FormControl>
              </Box>
              <Box className="create-event-input-container">
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    required
                    id="email"
                    type="email"
                    label="Email:"
                    inputProps={{ maxLength: 300 }}
                    value={formData.email}
                    onChange={(e) => onChange(e)}
                  />
                </FormControl>
              </Box>
              <Box className="create-event-input-container">
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    required
                    id="website"
                    type="text"
                    label="Website:"
                    inputProps={{ maxLength: 300 }}
                    value={formData.website}
                    onChange={(e) => onChange(e)}
                  />
                </FormControl>
              </Box>
              <Box className="create-event-input-container">
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    required
                    id="facebook"
                    type="text"
                    label="Facebook:"
                    inputProps={{ maxLength: 300 }}
                    value={formData.facebook}
                    onChange={(e) => onChange(e)}
                  />
                </FormControl>
              </Box>
              <FormControl>
                {updating ? (
                  <Button
                    className="generic-create-event-button"
                    component="label"
                    style={centeredButtonStyle}
                  >
                    <p className="button-text">Updating...</p>
                  </Button>
                ) : (
                  <Button
                    className="generic-create-event-button"
                    component="label"
                    style={centeredButtonStyle}
                    onClick={() => updateProfileHandler()}
                  >
                    <p className="button-text">Update Profile</p>
                  </Button>
                )}
              </FormControl>
            </FormGroup>
            <div className="profile-input-line"></div>
            <p className="profile-title">Your Password</p>
            <FormGroup sx={{ fontFamily: 'AirbnbCerealMedium' }}>
              <Box className="create-event-input-container">
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    required
                    id="oldPassword"
                    type="password"
                    label="Current Password:"
                    inputProps={{ maxLength: 300 }}
                    value={password.oldPassword}
                    onChange={(e) => onChangePassword(e)}
                  />
                </FormControl>
              </Box>
              <Box className="create-event-input-container">
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    required
                    id="newPassword"
                    type="password"
                    label="New Password:"
                    inputProps={{ maxLength: 300 }}
                    value={password.newPassword}
                    onChange={(e) => onChangePassword(e)}
                  />
                </FormControl>
              </Box>
              <Box className="create-event-input-container">
                <FormControl style={{ width: '100%' }}>
                  <TextField
                    required
                    id="confirmNewPassword"
                    type="password"
                    label="Password Confirm:"
                    inputProps={{ maxLength: 300 }}
                    value={password.confirmNewPassword}
                    onChange={(e) => onChangePassword(e)}
                  />
                </FormControl>
              </Box>
              <FormControl>
                {passwordUpdating ? (
                  <Button
                    className="generic-create-event-button"
                    component="label"
                    style={centeredButtonStyle}
                  >
                    <p className="button-text">Updating...</p>
                  </Button>
                ) : (
                  <Button
                    className="generic-create-event-button"
                    component="label"
                    style={centeredButtonStyle}
                    onClick={() => changePasswordHandler()}
                  >
                    <p className="button-text">Update Password</p>
                  </Button>
                )}
              </FormControl>
            </FormGroup>
            <div className="profile-input-line"></div>
          </div>
        </div>
      </div>
      {error ? (
        <CustomError
          message={error}
          onClose={onClose}
          errorType="error-events"
          overlayType="error-events-calendar-overlay"
        />
      ) : null}
      {message ? (
        <CustomLocalMessage
          message={message}
          onClose={onClose}
          overlayType="error-events-calendar-overlay"
        />
      ) : null}
      {avatarUrl !== '' ? (
        <CustomAvatarEditor
          onClose={onClose}
          getCroppedUrl={setAvatarCroppedUrl}
          avatarUrl={avatarUrl}
        />
      ) : null}
    </div>
  );
};

export default UpdateProfile;

const centeredButtonStyle = {
  backgroundColor: Colors.primary,
  marginTop: 20,
  marginBottom: 20,
  borderRadius: 20,
  padding: 0,
  alignSelf: 'center',
};
