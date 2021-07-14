import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

import { GOOGLE_MAPS } from '../../serverConfigs';
import { Marker } from '../../store/interfaces';

const mapStyle = require('../../helpers/mapStyles.json');

const AnyReactComponent = ({ text }: Marker) => <div>{text}</div>;

const error = () => {
  console.log('error');
};

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 14,
};

const Map = () => {
  const [location, setLocation] = useState<GeolocationPosition>({
    coords: {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0,
      latitude: 0,
      longitude: 0,
    },
    timestamp: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation(position);
    }, error);
  }, [location]);

  const userLocation = {
    lat: location.coords.latitude,
    lng: location.coords.longitude,
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: GOOGLE_MAPS }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        center={userLocation}
        options={{ styles: mapStyle }}
      >
        <AnyReactComponent
          lat={10.99835602}
          lng={77.01502627}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
};

export default Map;
