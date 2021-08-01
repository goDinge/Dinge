import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../store/reducers/rootReducer';
import { ding, event, messageState } from '../store/interfaces';
import * as MessageActions from '../store/actions/message';

const CustomMessage = (props: {
  overlay: 'message-ding-overlay' | 'message-map-overlay';
  component: 'message-ding' | 'message-map' | 'message-event';
  item: ding | event;
  delete?: boolean | null;
  isDeleting?: boolean | null;
  onDelete: (dingId: string) => void;
}) => {
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;

  const { overlay, component, item, isDeleting, onDelete } = props;
  let deleteDing = props.delete;

  const dispatch = useDispatch<Dispatch<any>>();

  const onClose = () => {
    dispatch(MessageActions.resetMessage());
    deleteDing = false;
  };

  return (
    <div className={overlay}>
      <div className={component}>
        <p>{messageStr}</p>
        {deleteDing && messageStr ? (
          <div className="delete-button-container">
            {isDeleting ? (
              <button className="btn btn-edit-modal">Deleting...</button>
            ) : (
              <button
                onClick={() => onDelete(item._id)}
                className="btn btn-edit-modal"
              >
                Yes!
              </button>
            )}
            <button onClick={onClose} className="btn btn-edit-modal">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={onClose} className="btn btn-edit-modal">
            Okay
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomMessage;
