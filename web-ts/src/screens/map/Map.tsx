import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { ding, dingeState } from '../../store/interfaces';

import GoogleMapReact from 'google-map-react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { AppState } from '../../store/reducers/rootReducer';
import * as dingeActions from '../../store/actions/dinge';

import { GOOGLE_MAPS } from '../../serverConfigs';
import CustomBlueMarker from '../../components/CustomBlueMarker';
import CustomMarker from '../../components/CustomMarker';

const mapStyle = require('../../helpers/mapStyles.json');

const error = () => {
  console.log('error');
};

const defaultLocation = {
  center: {
    lat: 43.67028846899895,
    lng: -79.38671623993413,
  },
  zoom: 15,
};

const defaultGeoPosition = {
  coords: {
    accuracy: 0,
    altitude: 0,
    altitudeAccuracy: 0,
    heading: 0,
    speed: 0,
    latitude: defaultLocation.center.lat,
    longitude: defaultLocation.center.lng,
  },
  timestamp: 0,
};

const Map = () => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [location, setLocation] =
    useState<GeolocationPosition>(defaultGeoPosition);

  const dinge: dingeState = useSelector((state: AppState) => state.dinge);
  const dingeArr: ding[] = dinge.dinge;

  const dispatch = useDispatch<Dispatch<any>>();

  const getLocation = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position);
      loadData(position);
      setIsMapLoading(false);
    }, error);
  };

  useEffect(() => {
    getLocation();
  });

  const loadData = async (location: GeolocationPosition) => {
    //setError(null);
    try {
      await dispatch(dingeActions.getLocalDinge(location));
      // await dispatch(eventsActions.getLocalEvents(location));
      // await dispatch(authActions.getAuthUser());
    } catch (err) {
      //setError(err.message);
    }
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
          <Loader type="Oval" color="#FF5A5F" height={70} width={70} />
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
        options={{ styles: mapStyle, minZoom: 15, maxZoom: 17 }}
      >
        <CustomBlueMarker lat={userLocation.lat} lng={userLocation.lng} />
        {dingeArr
          ? dingeArr.map((item: ding, index) => (
              <CustomMarker
                key={index}
                data={item}
                lat={item.location.latitude}
                lng={item.location.longitude}
              />
            ))
          : null}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
