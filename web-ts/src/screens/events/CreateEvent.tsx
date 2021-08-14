import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
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

import CustomEventModal from '../../components/CustomEventModal';

const mapStyle = require('../../helpers/mapStyles.json');
const FORM_INPUT = ActionTypes.FORM_INPUT;

const CreateEvent = () => {
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj: event = event.event;
  const locationRedux: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationReduxObj: GeolocationPosition = locationRedux.location;

  // const [error, setError] = useState(undefined);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isFetchingMarker, setIsFetchingMarker] = useState(false);
  // const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [date, setDate] = useState<Date | null>(new Date(Date.now()));
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
  });
  const [eventModalVisible, setEventModalVisible] = useState(false);
  // const [region, setRegion] = useState(locationRedux);
  // const [mapLoaded, setMapLoaded] = useState(false);
  // const [eventLocation, setEventLocation] = useState({
  //   location: {
  //     latitude: 0,
  //     longitude: 0,
  //   },
  // });
  const [eventType, setEventType] = useState('community');

  const dispatch = useDispatch<Dispatch>();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log('onChange: ', e.target.value);
  };

  const eventTypeHandler = () => {
    setEventModalVisible(true);
  };

  const chooseEventHandler = (event: string) => {
    setEventType(event);
  };

  const closeChooseEventHandler = () => {
    setEventModalVisible(false);
  };

  return (
    <div className="create-event-screen">
      <div className="calendar-container">
        <div className="create-event-inner-container">
          <FormGroup>
            <FormControl>
              <div className="create-event-name">
                <InputLabel htmlFor="name">Event Name</InputLabel>
                <Input id="name" onChange={(e) => onChange(e)} />
              </div>
            </FormControl>
            <FormControl>
              <div className="create-event-type">
                <p style={{ marginRight: 20 }}>{eventType}</p>
                <VscTriangleDown onClick={eventTypeHandler} />
                <img
                  alt="event-type"
                  className="create-event-pic"
                  src={`${AWS_EVENT_TYPES}${eventType}.png`}
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
