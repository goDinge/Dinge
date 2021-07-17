import React from 'react';
import pin from '../assets/pin.png';
import { dingObj } from '../store/interfaces';

const CustomMarker = (props: dingObj) => {
  const data = props.data;
  const imageUrl = props.data.thumbUrl;

  return (
    <div
      className="marker-container"
      onClick={() => console.log(data)}
      style={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}
    >
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

export default CustomMarker;
