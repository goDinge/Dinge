import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import * as dingActions from '../store/actions/ding';
import * as messageActions from '../store/actions/message';
import pin from '../assets/pin.png';
import { dingObj } from '../store/interfaces';

const CustomMarker = (props: dingObj) => {
  const imageUrl = props.data.thumbUrl;
  const data = props.data;

  const dispatch = useDispatch<Dispatch<any>>();

  const onDetails = (id: string) => {
    try {
      dispatch(dingActions.getDing(id));
    } catch (err) {
      dispatch(messageActions.addMessage('Unable to get Ding info'));
    }
  };

  return (
    <div
      className="marker-container"
      style={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}
      onClick={() => onDetails(data._id)}
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
