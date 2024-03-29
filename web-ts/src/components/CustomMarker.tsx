import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import * as dingActions from '../store/actions/ding';
import * as eventActions from '../store/actions/event';
import * as messageActions from '../store/actions/message';
import pin from '../assets/pin.png';
import { itemObj } from '../store/interfaces';

const CustomMarker = (props: itemObj) => {
  const imageUrl = props.data.thumbUrl;
  const data = props.data;
  const ding = props.ding;

  const messageScreen = 'map';

  const dispatch = useDispatch<Dispatch<any>>();

  const onDetails = (id: string) => {
    try {
      if (ding) {
        dispatch(dingActions.getDingById(id));
      } else {
        dispatch(eventActions.getEventById(id));
      }
    } catch (err) {
      dispatch(
        messageActions.setMessage(
          `Unable to get ${ding ? 'ding' : 'event'} info`,
          messageScreen
        )
      );
    }
  };

  return (
    <div className="marker-container" onClick={() => onDetails(data._id)}>
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
