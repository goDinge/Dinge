import React from 'react';
import { Marker } from '../store/interfaces';
import circle from '../assets/blue-circle.png';

const CustomBlueMarker = (props: Marker) => {
  return (
    <div style={{ position: 'absolute', transform: 'translate(-70%, -70%)' }}>
      <img alt="logo" src={circle} style={{ height: 30, width: 30 }} />
    </div>
  );
};

export default CustomBlueMarker;
