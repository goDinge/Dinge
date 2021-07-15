import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

import { GOOGLE_MAPS } from '../../serverConfigs';
import CustomBlueMarker from '../../components/CustomBlueMarker';
import website from '../../assets/website.png';

const mapStyle = require('../../helpers/mapStyles.json');

const error = () => {
  console.log('error');
};

const defaultProps = {
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
    latitude: defaultProps.center.lat,
    longitude: defaultProps.center.lng,
  },
  timestamp: 0,
};

const Map = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] =
    useState<GeolocationPosition>(defaultGeoPosition);

  const getLocation = async () => {
    await navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position);
      setIsLoading(false);
    }, error);
  };

  useEffect(() => {
    getLocation();
  }, [location]);

  const userLocation = {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };

  if (isLoading) {
    console.log('Loading');
    return (
      <div style={{ height: '100vh', width: '100%' }}>
        <img alt="logo" src={website} style={{ height: 300, width: 300 }} />
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        center={userLocation}
        options={{ styles: mapStyle, minZoom: 15, maxZoom: 17 }}
      >
        <CustomBlueMarker lat={userLocation.lat} lng={userLocation.lng} />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
