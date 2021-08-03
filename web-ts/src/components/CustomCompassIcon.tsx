import React from 'react';
import compass from '../assets/compass.png';

const CustomCompassIcon = (props: { onSelect: () => void }) => {
  return (
    <div className="compass-container" onClick={props.onSelect}>
      <img alt="compass" src={compass} />
    </div>
  );
};

export default CustomCompassIcon;
