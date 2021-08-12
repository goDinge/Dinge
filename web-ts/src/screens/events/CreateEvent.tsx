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

import * as eventsActions from '../../store/actions/events';
import { AWS_EVENT_TYPES, GOOGLE_MAPS } from '../../serverConfigs';
import GoogleMapReact from 'google-map-react';
import { stringify } from 'css-what';

const mapStyle = require('../../helpers/mapStyles.json');

const formReducer = (
  state: eventFormState,
  action: eventFormAction
): eventFormState => {
  if (action.type) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities: any = {
      //: { [key: string]: boolean }
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let formIsValid = true;
    for (const key in updatedValidities) {
      formIsValid = formIsValid && updatedValidities[key];
    }
    return {
      formIsValid: formIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const CreateEvent = () => {
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj: event = event.event;
  const locationRedux: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationReduxObj: GeolocationPosition = locationRedux.location;

  const [error, setError] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMarker, setIsFetchingMarker] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));
  const [image, setImage] = useState(null);
  const [region, setRegion] = useState(locationRedux);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [eventLocation, setEventLocation] = useState({
    location: {
      latitude: 0,
      longitude: 0,
    },
  });
  const [eventType, setEventType] = useState('community');

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      eventName: '',
      date: '',
      eventType: 'community',
      eventPic: '',
      thumbUrl:
        'https://dinge.s3.us-east-2.amazonaws.com/event-types-2/community.png',
      address: '',
      location: '',
      description: '',
      hours: '',
    },
    inputValidities: {
      eventName: false,
      date: false,
      eventType: true,
      eventPic: false,
      thumbUrl: true,
      location: false,
      description: false,
      hours: false,
    },
    formIsValid: false,
  });

  return <div></div>;
};

export default CreateEvent;
