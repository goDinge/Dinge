import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Geocode from 'react-geocode';
import Resizer from 'react-image-file-resizer';
import { AppState } from '../../store/reducers/rootReducer';
import { StaticContext } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';
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
import {
  Box,
  FormGroup,
  FormControl,
  TextField,
  Input,
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

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { Colors } from '../../constants/Colors';

import CustomMarkerCreateEvent from '../../components/CustomMarkerCreateEvent';
import CustomEventModal from '../../components/CustomEventModal';
import CustomConfirmMessage from '../../components/CustomConfirmMessage';
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

const calcEditedHours = (eventProp: event) => {
  let result = 0;
  if (eventProp) {
    result =
      (new Date(eventProp.endDate).getTime() -
        new Date(eventProp.date).getTime()) /
      (1000 * 60 * 60);
  }
  const resultString = result.toString();
  return resultString;
};

const CreateEvent = (props: RouteComponentProps<{}, StaticContext, event>) => {
  const eventId = props.location.state ? props.location.state._id : null;
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;

  const editedEvent: event | undefined = useSelector((state) =>
    eventsArr.find((event) => event._id === eventId)
  );
  console.log('editedEvent: ', editedEvent);

  const locationRedux: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationReduxObj: GeolocationPosition = locationRedux.location;

  const [error, setError] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMarker, setIsFetchingMarker] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date(Date.now()));
  const [eventPicUrl, setEventPicUrl] = useState<string | null>(null);
  const [eventPic, setEventPic] = useState<Blob | null>(null);
  const [compressedEventPic, setCompressedEventPic] = useState<
    string | Blob | File | ProgressEvent<FileReader> | null
  >(null);
  const [formData, setFormData] = useState<eventFormData>(
    editedEvent
      ? {
          eventName: editedEvent.eventName,
          hours: calcEditedHours(editedEvent),
          address: editedEvent.address,
          description: editedEvent.description,
        }
      : {
          eventName: '',
          hours: '',
          address: '',
          description: '',
        }
  );
  const [eventType, setEventType] = useState({
    type: 'community',
    thumbUrl: `${AWS_EVENT_TYPES}community.png`,
  });
  const [region, setRegion] = useState(
    editedEvent
      ? {
          latitude: editedEvent.location.latitude,
          longitude: editedEvent.location.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }
      : {
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }
  );
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(editedEvent ? true : false);
  const [confirmMessage, setConfirmMessage] = useState(false);
  const [locationData, setLocationData] = useState<any>(
    editedEvent
      ? {
          lat: editedEvent.location.latitude,
          lng: editedEvent.location.longitude,
        }
      : null
  );

  const dispatch = useDispatch<Dispatch<any>>();

  //console.log('formData: ', formData);
  console.log('locationData: ', locationData);

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

  const onDateChangeHandler = (date: Date | null) => {
    setError(null);
    const dateString = date?.toString();
    if (dateString && Date.parse(dateString) + 100000 < Date.now()) {
      setError('Careful! Start time must be after this moment.');
    } else {
      setDate(date);
    }
  };

  const resizeImage = async (file: Blob) => {
    try {
      await Resizer.imageFileResizer(
        file,
        700,
        700,
        'JPEG',
        70,
        0,
        (uri) => {
          setCompressedEventPic(uri);
        },
        'file',
        200,
        200
      );
    } catch (err) {
      setError('Image file type incompatible');
    }
  };

  const createEventHandler = async () => {
    setError(null);
    setIsCreatingEvent(true);

    const { eventName, hours, description, address } = formData;

    if (
      eventName === '' ||
      hours === '' ||
      description === '' ||
      address === '' ||
      !eventPic ||
      !locationData
    ) {
      setError('Please complete this Create Event form.');
      return;
    }

    try {
      await dispatch(
        eventsActions.createEvent(
          date,
          compressedEventPic,
          formData,
          eventType,
          locationData
        )
      );
      await dispatch(eventsActions.getLocalEvents(locationReduxObj));
      setIsCreatingEvent(false);
      setConfirmMessage(true);
    } catch (err) {
      setIsCreatingEvent(false);
      setError(err.message);
    }
  };

  return (
    <div className="create-event-screen">
      <div className="calendar-container">
        <div className="create-event-inner-container">
          <FormGroup sx={{ fontFamily: 'AirbnbCerealMedium' }}>
            <Box className="create-event-input-container">
              <FormControl>
                <TextField
                  required
                  id="eventName"
                  type="text"
                  label="Event Name:"
                  inputProps={{ maxLength: 200 }}
                  value={formData.eventName}
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
                    onChange={(date) => onDateChangeHandler(date)}
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
                    resizeImage(e.target.files[0]);
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
                <TextField
                  required
                  id="hours"
                  type="number"
                  label="Event Duration:"
                  InputProps={{
                    inputProps: { min: '1', max: '8' },
                  }}
                  value={formData.hours}
                  onChange={(e) => onChange(e)}
                />
                <FormHelperText sx={{ fontFamily: 'AirbnbCerealLight' }}>
                  Number of hours - max: 8
                </FormHelperText>
              </FormControl>
            </Box>
            <Box className="create-event-input-container">
              <FormControl>
                <TextField
                  required
                  type="text"
                  inputProps={{ maxLength: 200 }}
                  id="address"
                  style={{ width: 300 }}
                  label="Event Location:"
                  value={formData.address}
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
                  center={
                    editedEvent
                      ? locationData
                      : locationData[0].geometry.location
                  }
                  //center={defaultLocation.center}
                  options={{ styles: mapStyle, scrollwheel: false }}
                  yesIWantToUseGoogleMapApiInternals={true}
                >
                  <CustomMarkerCreateEvent
                    data={eventType}
                    lat={
                      editedEvent
                        ? locationData.lat
                        : locationData[0].geometry.location.lat
                    }
                    lng={
                      editedEvent
                        ? locationData.lng
                        : locationData[0].geometry.location.lng
                    }
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
              <FormControl style={{ width: '100%' }}>
                <TextField
                  required
                  multiline
                  type="text"
                  inputProps={{ maxLength: 500 }}
                  id="description"
                  rows={2}
                  style={{ width: '100%' }}
                  label="Event Description:"
                  value={formData.description}
                  onChange={(e) => onChange(e)}
                />
                <FormHelperText sx={{ fontFamily: 'AirbnbCerealLight' }}>
                  Tell us about the event
                </FormHelperText>
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
      {confirmMessage ? (
        <CustomConfirmMessage
          message="Event Created. Go to your profile screen to view it."
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
