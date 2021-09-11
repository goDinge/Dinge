import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import {
  ding,
  event,
  dingeState,
  dingState,
  eventsState,
  eventState,
  messageState,
  locationState,
} from '../../store/interfaces';
import { AppState } from '../../store/reducers/rootReducer';
import * as dingeActions from '../../store/actions/dinge';
import * as eventsActions from '../../store/actions/events';
import * as authActions from '../../store/actions/auth';
import * as locationActions from '../../store/actions/location';

import GoogleMapReact from 'google-map-react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { Colors } from '../../constants/Colors';

import { GOOGLE_MAPS } from '../../serverConfigs';
import CustomDing from '../../components/CustomDing';
import CustomEvent from '../../components/CustomEvent';
import CustomBlueMarker from '../../components/CustomBlueMarker';
import CustomMarker from '../../components/CustomMarker';
import CustomError from '../../components/CustomError';
import CustomMessage from '../../components/CustomMessage';
import CustomTimeFilter from '../../components/CustomTimeFilter';
import CustomReloadIcon from '../../components/CustomReloadIcon';
//import CustomCompassIcon from '../../components/CustomCompassIcon';

const mapStyle = require('../../helpers/mapStyles.json');
const settingConfigs = require('../../settingConfigs.json');

const defaultLocation = {
  center: {
    lat: settingConfigs[2].defaultLocation.coords.latitude,
    lng: settingConfigs[2].defaultLocation.coords.longitude,
  },
  zoom: 15,
};

const defaultGeoPosition = {
  coords: settingConfigs[2].defaultLocation.coords,
  timestamp: 0,
};

//vars for time filters
const now = new Date(Date.now()).getTime();
const endOfDay = new Date().setHours(23, 59, 59, 999);
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStart = tomorrow.setHours(0, 0, 0, 0);
const tomorrowEnd = tomorrow.setHours(23, 59, 59, 999);

const Map = () => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeSelected, setTimeSelected] = useState('now');
  const [location, setLocation] =
    useState<GeolocationPosition>(defaultGeoPosition);

  const dinge: dingeState = useSelector((state: AppState) => state.dinge);
  const dingeArr: ding[] = dinge.dinge;
  const events: eventsState = useSelector((state: AppState) => state.events);
  const eventsArr: event[] = events.events;
  const ding: dingState = useSelector((state: AppState) => state.ding);
  const dingObj = ding.ding;
  const event: eventState = useSelector((state: AppState) => state.event);
  const eventObj = event.event;
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;
  const locationRedux: locationState = useSelector(
    (state: AppState) => state.location
  );
  const locationReduxObj: GeolocationPosition = locationRedux.location;

  const dispatch = useDispatch<Dispatch<any>>();

  const loadData = useCallback(
    async (location: GeolocationPosition) => {
      setError(null);
      try {
        await dispatch(dingeActions.getLocalDinge(location));
        await dispatch(eventsActions.getLocalEvents(location));
        await dispatch(authActions.getAuthUser());
      } catch (err: any) {
        setError(err.message);
      }
    },
    [dispatch]
  );

  const getLocation = useCallback(async () => {
    if (!locationReduxObj.coords) {
      // if (true) {
      await navigator.geolocation.getCurrentPosition((position) => {
        dispatch(locationActions.setLocation(position));
        setLocation(position);
        loadData(position);
        setIsMapLoading(false);
      }, errorCallback);
    } else {
      setLocation(locationReduxObj);
      loadData(locationReduxObj);
      setIsMapLoading(false);
    }
  }, [dispatch, loadData, locationReduxObj]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const deleteDingHandler = () => {}; //empty fn to pass TS

  const reloadHandler = async (location: GeolocationPosition) => {
    await loadData(location);
  };

  const timeNow = () => {
    setTimeSelected('now');
  };

  const timeToday = () => {
    setTimeSelected('today');
  };

  const timeTomorrow = () => {
    setTimeSelected('tomorrow');
  };

  const errorCallback = () => {
    setError('error');
  };

  const onClose = () => {
    setError(null);
  };

  const userLocation = {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };

  if (isMapLoading) {
    return (
      <div className="map">
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Loader type="Oval" color={Colors.primary} height={70} width={70} />
        </div>
      </div>
    );
  }

  return (
    <div className="map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS }}
        defaultCenter={defaultLocation.center}
        defaultZoom={defaultLocation.zoom}
        center={userLocation}
        options={{ styles: mapStyle, minZoom: 13, maxZoom: 17 }}
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={({ map, maps }) =>
          new maps.Circle({
            strokeColor: Colors.primary,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: 'rgba(0, 166, 153)',
            fillOpacity: 0.05,
            map,
            center: {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            },
            cursor: 'grab',
            radius: settingConfigs[0].radius * 1000,
          })
        }
      >
        <CustomBlueMarker lat={userLocation.lat} lng={userLocation.lng} />
        {timeSelected === 'now' && dingeArr
          ? dingeArr.map((item: ding, index) => (
              <CustomMarker
                data={item}
                key={index}
                lat={item.location.latitude}
                lng={item.location.longitude}
                ding
              />
            ))
          : null}
        {eventsArr
          ? eventsArr.map((item: event, index) => {
              if (timeSelected === 'now') {
                if (
                  new Date(item.date).getTime() < now &&
                  new Date(item.endDate).getTime() > now
                ) {
                  return (
                    <CustomMarker
                      key={index}
                      data={item}
                      lat={item.location.latitude}
                      lng={item.location.longitude}
                    />
                  );
                }
              } else if (timeSelected === 'today') {
                if (
                  new Date(item.date).getTime() > now &&
                  new Date(item.date).getTime() < endOfDay
                ) {
                  return (
                    <CustomMarker
                      key={index}
                      data={item}
                      lat={item.location.latitude}
                      lng={item.location.longitude}
                    />
                  );
                }
              } else if (timeSelected === 'tomorrow') {
                if (
                  new Date(item.date).getTime() > tomorrowStart &&
                  new Date(item.date).getTime() < tomorrowEnd
                ) {
                  return (
                    <CustomMarker
                      key={index}
                      data={item}
                      lat={item.location.latitude}
                      lng={item.location.longitude}
                    />
                  );
                }
              }
              return null;
            })
          : null}
        {error ? (
          <CustomError
            message={error}
            onClose={onClose}
            errorType="error-map"
            overlayType="error-map-overlay"
          />
        ) : null}
      </GoogleMapReact>

      {dingObj.user !== '' ? <CustomDing /> : null}
      {eventObj.user !== '' ? <CustomEvent /> : null}
      {messageStr && message.screen === 'map' ? (
        <CustomMessage
          overlay="message-map-overlay"
          component="message-map"
          item={dingObj}
          onDelete={deleteDingHandler} //does nothing;
        />
      ) : null}
      <div className="time-filter-container">
        <CustomTimeFilter
          name="now"
          text="Now"
          timeSelected={timeSelected}
          onSelect={timeNow}
        />
        <CustomTimeFilter
          name="today"
          text="Later"
          timeSelected={timeSelected}
          onSelect={timeToday}
        />
        <CustomTimeFilter
          name="tomorrow"
          text="Next Day"
          timeSelected={timeSelected}
          onSelect={timeTomorrow}
        />
      </div>
      <CustomReloadIcon onSelect={() => reloadHandler(location)} />
    </div>
  );
};

export default Map;
