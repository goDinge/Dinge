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
  const [formData, setFormData] = useState<profileObj>({
    name: authUser?.name,
    email: authUser?.email,
    website: authUser?.website,
    facebook: authUser?.facebook,
  });

  const dispatch = useDispatch<Dispatch<any>>();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const updateProfileHandler = async () => {
    console.log('update profile');
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
          <p className="profile-title">Profile Update</p>
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
                <Button
                  className="generic-create-event-button"
                  component="label"
                  style={centeredButtonStyle}
                  onClick={() => updateProfileHandler()}
                >
                  <p className="button-text">Update Profile</p>
                </Button>
              </FormControl>
            </FormGroup>
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
