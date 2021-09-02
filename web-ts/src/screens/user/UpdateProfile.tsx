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
} from '@material-ui/core';
import { Colors } from '../../constants/Colors';

import * as authActions from '../../store/actions/auth';

const UpdateProfile = () => {
  const authState: AuthState = useSelector((state: AppState) => state.auth);
  const authUser = authState.authUser;

  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [formData, setFormData] = useState<profileObj>({
    name: authUser?.name,
    email: authUser?.email,
    website: authUser?.website,
    facebook: authUser?.facebook,
  });
  const [password, setPassword] = useState({
    currentPassword: '',
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
      await await dispatch(authActions.updateProfile(formData));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="calender-screen">
      <div className="profile-container">
        <div className="profile-inner-container">
          <p className="profile-title">Your Profile</p>
          <div className="profile-avatar-update-container">
            <img
              className="profile-avatar-update"
              alt="profile"
              src={authUser?.avatar}
              onClick={() => console.log('update avatar')}
            />
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
                    id="currentPassword"
                    type="password"
                    label="Current Password:"
                    inputProps={{ maxLength: 300 }}
                    value={password.currentPassword}
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
                    onClick={() => console.log('update password')}
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
    </div>
  );
};

export default UpdateProfile;

const buttonStyle = {
  backgroundColor: Colors.primary,
  marginTop: 20,
  marginBottom: 20,
  borderRadius: 20,
  padding: 0,
};

const centeredButtonStyle = {
  backgroundColor: Colors.primary,
  marginTop: 20,
  marginBottom: 20,
  borderRadius: 20,
  padding: 0,
  alignSelf: 'center',
};
