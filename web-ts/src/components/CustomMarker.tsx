import React from 'react';
import pin from '../assets/pin.png';
import { dingObj } from '../store/interfaces';

const CustomMarker = (props: dingObj) => {
  const data = props.data;
  const imageUrl = props.data.thumbUrl;

  return (
    <div
      onClick={() => console.log(data)}
      style={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}
    >
      <img
        alt="marker-thumbnail"
        src={imageUrl}
        style={{
          height: 30,
          width: 30,
          borderRadius: 16,
          borderColor: 'red',
          borderWidth: 1.5,
          zIndex: 1,
          transform: 'translate(20%, 115%)',
        }}
      />
      <img alt="marker" src={pin} style={{ height: 42, width: 42 }}></img>
    </div>
  );
};

export default CustomMarker;
