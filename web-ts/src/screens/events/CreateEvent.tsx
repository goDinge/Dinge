import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Geocode from 'react-geocode';
import { AppState } from '../../store/reducers/rootReducer';
import {
  event,
  eventsState,
  eventState,
  messageState,
  locationState,
  eventFormState,
  eventFormAction,
} from '../../store/interfaces';
import { ActionTypes } from '../../store/types';
import {
  FormGroup,
  FormControl,
  TextField,
  Input,
  InputLabel,
  FormHelperText,
  Button,
} from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DateTimePicker from '@material-ui/lab/DateTimePicker';
import { VscTriangleDown } from 'react-icons/vsc';

import * as eventsActions from '../../store/actions/events';
import { AWS_EVENT_TYPES, GOOGLE_MAPS } from '../../serverConfigs';
import GoogleMapReact from 'google-map-react';
import { Colors } from '../../constants/Colors';

import CustomMarkerCreateEvent from '../../components/CustomMarkerCreateEvent';
import CustomEventModal from '../../components/CustomEventModal';

const mapStyle = require('../../helpers/mapStyles.json');
const settingConfigs = require('../../settingConfigs.json');

const defaultLocation = {
  center: {
    lat: settingConfigs[2].defaultLocation.coords.latitude,
    lng: settingConfigs[2].defaultLocation.coords.longitude,
  },
  zoom: 15,
};

const FORM_INPUT = ActionTypes.FORM_INPUT;

interface region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

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
  // const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date(Date.now()));
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: null,
    address: '',
  });
  const [eventType, setEventType] = useState({
    type: 'community',
    thumbUrl: `${AWS_EVENT_TYPES}community.png`,
  });
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationData, setLocationData] = useState<any>();
  const [eventLocation, setEventLocation] = useState({
    location: {
      latitude: 0,
      longitude: 0,
    },
    //thumbUrl: `${AWS_EVENT_TYPES}community.png`,
  });

  const dispatch = useDispatch<Dispatch>();

  Geocode.setApiKey(GOOGLE_MAPS);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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
        latitude: locationData[0].geometry.location.lat,
        longitude: locationData[0].geometry.location.lng,
      };
      console.log('CE eventtype: ', eventType.thumbUrl);
      setEventLocation({
        location: {
          latitude: locationData[0].geometry.location.lat,
          longitude: locationData[0].geometry.location.lng,
        },
        // thumbUrl: `${AWS_EVENT_TYPES}${eventType.thumbUrl}.png`,
      });
      setRegion({
        latitude: locationData[0].geometry.location.lat,
        longitude: locationData[0].geometry.location.lng,
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
    setIsFetchingMarker(false);
    setMapLoaded(true);
  };

  //eventLocation is one step behind as it is dependent on eventType
  //it is picking up the previous eventType when it uses it for thumbUrl
  console.log('CE eventLocation: ', eventLocation);
  console.log('CE eventType: ', eventType.thumbUrl);

  const eventTypeHandler = () => {
    setEventModalVisible(true);
  };

  const chooseEventHandler = (type: string) => {
    setEventType({ type, thumbUrl: `${AWS_EVENT_TYPES}${type}.png` });
    // setEventLocation({
    //   ...eventLocation,
    //   thumbUrl: `${AWS_EVENT_TYPES}${eventType}.png`,
    // });
  };

  const closeChooseEventHandler = () => {
    setEventModalVisible(false);
  };

  return (
    <div className="create-event-screen">
      <div className="calendar-container">
        <div className="create-event-inner-container">
          <FormGroup>
            <div className="create-event-input-container">
              <FormControl>
                <InputLabel htmlFor="name">Event Name</InputLabel>
                <Input id="name" onChange={(e) => onChange(e)} />
              </FormControl>
            </div>
            <FormControl>
              <div className="create-event-type">
                <p style={{ marginRight: 20 }}>{eventType.type}</p>
                <VscTriangleDown onClick={eventTypeHandler} />
                <img
                  alt="event-type"
                  className="create-event-pic"
                  src={`${eventType.thumbUrl}`}
                />
              </div>
            </FormControl>
            <FormControl>
              <div className="date-picker-container">
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
              </div>
            </FormControl>
            <FormControl>
              <Button
                htmlFor="eventPic"
                className="pick-image-button"
                component="label"
                style={{
                  backgroundColor: Colors.primary,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <p className="button-text">Pick Event Image</p>
              </Button>
              <Input
                type="file"
                id="eventPic"
                style={{ display: 'none' }}
                onChange={(e: any) => {
                  setImage(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </FormControl>
            <div>{image ? <img alt="event-pic" src={image} /> : null}</div>
            <div className="create-event-input-container">
              <FormControl>
                <InputLabel htmlFor="duration">Event Duration: </InputLabel>
                <Input id="duration" onChange={(e) => onChange(e)} />
                <FormHelperText>Number of hours</FormHelperText>
              </FormControl>
            </div>
            <div className="create-event-input-container">
              <FormControl>
                <InputLabel htmlFor="address">Event Location:</InputLabel>
                <Input
                  id="address"
                  style={{ width: 300 }}
                  onChange={(e) => onChange(e)}
                />
                <FormHelperText>
                  Event address, landmark or closest intersection
                </FormHelperText>
              </FormControl>
            </div>
            <FormControl>
              <Button
                htmlFor="map-marker"
                className="pick-image-button"
                component="label"
                style={{
                  backgroundColor: Colors.primary,
                  marginTop: 20,
                  marginBottom: 20,
                }}
                onClick={() => loadMapHandler(region, formData.address)}
              >
                <p className="button-text">Add Map Marker</p>
              </Button>
            </FormControl>
            <div className="event-map-container">
              {mapLoaded ? (
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
              ) : null}
            </div>
          </FormGroup>
        </div>
      </div>
      {eventModalVisible ? (
        <CustomEventModal
          component="message-ding"
          chooseEvent={chooseEventHandler}
          onClose={closeChooseEventHandler}
        />
      ) : null}
    </div>
  );
};

export default CreateEvent;

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
