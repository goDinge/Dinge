import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Geocode from 'react-geocode';
import { AppState } from '../../store/reducers/rootReducer';
import {
  event,
  region,
  eventsState,
  locationState,
  eventFormData,
  //eventState,
  //messageState,
  //eventFormState,
  //eventFormAction,
} from '../../store/interfaces';
//import { ActionTypes } from '../../store/types';
import {
  Box,
  FormGroup,
  FormControl,
  TextField,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  Typography,
} from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import { VscTriangleDown } from 'react-icons/vsc';

import * as eventsActions from '../../store/actions/events';
import { AWS_EVENT_TYPES, GOOGLE_MAPS } from '../../serverConfigs';
import GoogleMapReact from 'google-map-react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { Colors } from '../../constants/Colors';

import CustomMarkerCreateEvent from '../../components/CustomMarkerCreateEvent';
import CustomEventModal from '../../components/CustomEventModal';
import CustomError from '../../components/CustomError';

const mapStyle = require('../../helpers/mapStyles.json');
const settingConfigs = require('../../settingConfigs.json');

Geocode.setApiKey(GOOGLE_MAPS);

const defaultLocation = {
  center: {
    lat: settingConfigs[2].defaultLocation.coords.latitude,
    lng: settingConfigs[2].defaultLocation.coords.longitude,
  },
  zoom: 15,
};

const CreateEvent = () => {
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  const locationRedux: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationReduxObj: GeolocationPosition = locationRedux.location;

  const [error, setError] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMarker, setIsFetchingMarker] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date(Date.now()));
  const [eventPicUrl, setEventPicUrl] = useState<string | null>(null);
  const [eventPic, setEventPic] = useState<Blob | null>(null);
  const [formData, setFormData] = useState<eventFormData>({
    eventName: '',
    hours: '',
    address: '',
    description: '',
  });
  const [eventType, setEventType] = useState({
    type: 'community',
    thumbUrl: `${AWS_EVENT_TYPES}community.png`,
  });
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationData, setLocationData] = useState<any>();

  const dispatch = useDispatch<Dispatch<any>>();

  const coordLookUp = async (address: string) => {
    setError(null);
    let coordsMongo = {
      latitude: null,
      longitude: null,
    };
    try {
      const geocodeData = await Geocode.fromAddress(address);
      setLocationData(geocodeData.results);
      coordsMongo = {
        latitude: geocodeData.results[0].geometry.location.lat,
        longitude: geocodeData.results[0].geometry.location.lng,
      };
      setRegion({
        latitude: geocodeData.results[0].geometry.location.lat,
        longitude: geocodeData.results[0].geometry.location.lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      });
      return coordsMongo;
    } catch (err) {
      setError(err.message);
    }
  };

  const loadMapHandler = async (region: region, address: string) => {
    setError(null);
    setIsFetchingMarker(true);
    try {
      await coordLookUp(address);
    } catch (err) {
      setError(err.message);
    }
    setMapLoaded(true);
    setIsFetchingMarker(false);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const eventTypeHandler = () => {
    setEventModalVisible(true);
  };

  const chooseEventHandler = (type: string) => {
    setEventType({ type, thumbUrl: `${AWS_EVENT_TYPES}${type}.png` });
  };

  const closeChooseEventHandler = () => {
    setEventModalVisible(false);
  };

  const onClose = () => {
    setError(null);
  };

  const createEventHandler = async () => {
    setError(null);
    setIsCreatingEvent(true);
    try {
      await dispatch(
        eventsActions.createEvent(
          date,
          eventPic,
          formData,
          eventType,
          locationData
        )
      );
      await dispatch(eventsActions.getLocalEvents(locationReduxObj));
    } catch (err) {
      setError(err.message);
    }
    setIsCreatingEvent(false);
  };

  return (
    <div className="create-event-screen">
      <div className="calendar-container">
        <div className="create-event-inner-container">
          <Typography component="div">
            <FormGroup sx={{ fontFamily: 'AirbnbCerealMedium' }}>
              <Box className="create-event-input-container">
                <FormControl>
                  <InputLabel
                    sx={{ fontFamily: 'AirbnbCerealMedium' }}
                    htmlFor="eventName"
                  >
                    Event Name
                  </InputLabel>
                  <Input
                    sx={{ fontFamily: 'AirbnbCerealBook' }}
                    id="eventName"
                    onChange={(e) => onChange(e)}
                  />
                </FormControl>
              </Box>
              <FormControl>
                <Box className="create-event-type">
                  <FormHelperText sx={{ fontFamily: 'AirbnbCerealMedium' }}>
                    Event Type:
                  </FormHelperText>
                  <p style={{ marginRight: 20, marginLeft: 20 }}>
                    {eventType.type}
                  </p>
                  <VscTriangleDown
                    cursor="pointer"
                    size={25}
                    onClick={eventTypeHandler}
                  />
                  <img
                    alt="event-type"
                    className="create-event-pic"
                    src={`${eventType.thumbUrl}`}
                  />
                </Box>
              </FormControl>
              <FormControl>
                <Box className="date-picker-container">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="DateTimePicker"
                      value={date}
                      onChange={(date) => {
                        setDate(date);
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </FormControl>
              <FormControl>
                <Button
                  htmlFor="eventPic"
                  className="generic-create-event-button"
                  component="label"
                  style={buttonStyle}
                >
                  <p className="button-text">Pick Event Image</p>
                </Button>
                <Input
                  type="file"
                  id="eventPic"
                  style={{ display: 'none' }}
                  onChange={(e: any) => {
                    if (e !== null) {
                      setEventPicUrl(URL.createObjectURL(e.target.files[0]));
                      setEventPic(e.target.files[0]);
                    } else {
                      return;
                    }
                  }}
                />
              </FormControl>
              <Box>
                {eventPicUrl ? <img alt="event-pic" src={eventPicUrl} /> : null}
              </Box>
              <Box className="create-event-input-container">
                <FormControl>
                  <InputLabel
                    sx={{ fontFamily: 'AirbnbCerealMedium' }}
                    htmlFor="hours"
                  >
                    Event Duration:
                  </InputLabel>
                  <Input
                    sx={{ fontFamily: 'AirbnbCerealBook' }}
                    id="hours"
                    type="number"
                    onChange={(e) => onChange(e)}
                  />
                  <FormHelperText sx={{ fontFamily: 'AirbnbCerealLight' }}>
                    Number of hours
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box className="create-event-input-container">
                <FormControl>
                  <InputLabel
                    sx={{ fontFamily: 'AirbnbCerealMedium' }}
                    htmlFor="address"
                  >
                    Event Location:
                  </InputLabel>
                  <Input
                    sx={{ fontFamily: 'AirbnbCerealBook' }}
                    id="address"
                    style={{ width: 300 }}
                    onChange={(e) => onChange(e)}
                  />
                  <FormHelperText sx={{ fontFamily: 'AirbnbCerealLight' }}>
                    Event address, landmark or closest intersection
                  </FormHelperText>
                </FormControl>
              </Box>
              <FormControl>
                <Button
                  htmlFor="map-marker"
                  className="generic-create-event-button"
                  component="label"
                  style={buttonStyle}
                  onClick={() => loadMapHandler(region, formData.address)}
                >
                  <p className="button-text">Add Map Marker</p>
                </Button>
              </FormControl>
              {mapLoaded ? (
                <Box className="event-map-container">
                  <GoogleMapReact
                    bootstrapURLKeys={{ key: GOOGLE_MAPS }}
                    defaultCenter={defaultLocation.center}
                    defaultZoom={defaultLocation.zoom}
                    center={locationData[0].geometry.location}
                    options={{ styles: mapStyle, scrollwheel: false }}
                    yesIWantToUseGoogleMapApiInternals={true}
                  >
                    <CustomMarkerCreateEvent
                      data={eventType}
                      lat={locationData[0].geometry.location.lat}
                      lng={locationData[0].geometry.location.lng}
                    />
                  </GoogleMapReact>
                </Box>
              ) : isFetchingMarker ? (
                <Box className="event-map-container">
                  <div
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <Loader
                      type="Oval"
                      color={Colors.primary}
                      height={40}
                      width={40}
                    />
                  </div>
                </Box>
              ) : null}
              <Box
                className="create-event-input-container"
                style={{ marginTop: 15 }}
              >
                <FormControl>
                  <InputLabel
                    sx={{ fontFamily: 'AirbnbCerealMedium' }}
                    htmlFor="description"
                  >
                    Event Description:
                  </InputLabel>
                  <Input
                    sx={{ fontFamily: 'AirbnbCerealBook' }}
                    id="description"
                    multiline
                    rows={2}
                    style={{ width: 300 }}
                    onChange={(e) => onChange(e)}
                  />
                </FormControl>
              </Box>

              <FormControl>
                {isCreatingEvent ? (
                  <Button
                    className="generic-create-event-button"
                    component="label"
                    style={centeredButtonStyle}
                  >
                    <p className="button-text">Creating Event...</p>
                  </Button>
                ) : (
                  <Button
                    className="generic-create-event-button"
                    component="label"
                    style={centeredButtonStyle}
                    onClick={() => createEventHandler()}
                  >
                    <p className="button-text">Create Event</p>
                  </Button>
                )}
              </FormControl>
            </FormGroup>
          </Typography>
        </div>
      </div>
      {eventModalVisible ? (
        <CustomEventModal
          component="message-ding"
          chooseEvent={chooseEventHandler}
          onClose={closeChooseEventHandler}
        />
      ) : null}
      {error ? (
        <CustomError
          message={error}
          onClose={onClose}
          errorType="error-events"
          overlayType="error-events-calendar-overlay"
        />
      ) : null}
    </div>
  );
};

export default CreateEvent;

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

// const formReducer = (
//   state: eventFormState,
//   action: eventFormAction
// ): eventFormState => {
//   if (action.type) {
//     const updatedValues = {
//       ...state.inputValues,
//       [action.input]: action.value,
//     };
//     const updatedValidities: any = {
//       //: { [key: string]: boolean }
//       ...state.inputValidities,
//       [action.input]: action.isValid,
//     };
//     let formIsValid = true;
//     for (const key in updatedValidities) {
//       formIsValid = formIsValid && updatedValidities[key];
//     }
//     return {
//       formIsValid: formIsValid,
//       inputValues: updatedValues,
//       inputValidities: updatedValidities,
//     };
//   }
//   return state;
// };

// const [formState, dispatchFormState] = useReducer(formReducer, {
//   inputValues: {
//     eventName: '',
//     date: '',
//     eventType: 'community',
//     eventPic: '',
//     thumbUrl:
//       'https://dinge.s3.us-east-2.amazonaws.com/event-types-2/community.png',
//     address: '',
//     location: '',
//     description: '',
//     hours: '',
//   },
//   inputValidities: {
//     eventName: false,
//     date: false,
//     eventType: true,
//     eventPic: false,
//     thumbUrl: true,
//     location: false,
//     description: false,
//     hours: false,
//   },
//   formIsValid: false,
// });
