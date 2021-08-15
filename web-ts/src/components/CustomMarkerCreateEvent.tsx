import React from 'react';
import pin from '../assets/pin.png';
//import { createEventObj } from '../store/interfaces';

const CustomMarkerCreateEvent = (props: any) => {
  const imageUrl = props.data.thumbUrl;
  console.log('CMCE: ', imageUrl);

  return (
    <div className="marker-container">
      <img
        alt="marker-thumbnail"
        src={imageUrl}
        style={{
          height: 38,
          width: 38,
          borderRadius: 19,
          border: '1px solid red',
          zIndex: 1,
          transform: 'translate(5%, 100%)',
        }}
      />
      <img alt="marker" src={pin} style={{ height: 42, width: 42 }}></img>
    </div>
  );
};

export default CustomMarkerCreateEvent;
