import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { ding, dingeState } from '../../store/interfaces';

import GoogleMapReact from 'google-map-react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';
import { Colors } from '../../constants/Colors';

import { AppState } from '../../store/reducers/rootReducer';
import * as dingeActions from '../../store/actions/dinge';

import { GOOGLE_MAPS } from '../../serverConfigs';
import CustomBlueMarker from '../../components/CustomBlueMarker';
import CustomMarker from '../../components/CustomMarker';

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

const Map = () => {
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [location, setLocation] =
    useState<GeolocationPosition>(defaultGeoPosition);

  const dinge: dingeState = useSelector((state: AppState) => state.dinge);
  const dingeArr: ding[] = dinge.dinge;

  const dispatch = useDispatch<Dispatch<any>>();

  const error = () => {
    console.log('error');
  };

  const loadData = useCallback(
    async (location: GeolocationPosition) => {
      //setError(null);
      try {
        await dispatch(dingeActions.getLocalDinge(location));
        // await dispatch(eventsActions.getLocalEvents(location));
        // await dispatch(authActions.getAuthUser());
      } catch (err) {
        //setError(err.message);
      }
    },
    [dispatch]
  );

  const getLocation = useCallback(async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position);
      loadData(position);
      setIsMapLoading(false);
    }, error);
  }, [loadData]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

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
            radius: settingConfigs[0].radius * 1000,
          })
        }
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
