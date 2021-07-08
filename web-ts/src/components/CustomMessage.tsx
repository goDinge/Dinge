import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../store/reducers/rootReducer';
import { Message } from '../store/interfaces';
import * as MessageActions from '../store/actions/message';

const CustomMessage = () => {
  const messages: Message[] = useSelector((state: AppState) => state.message);

  const dispatch = useDispatch<Dispatch<any>>();

  const onClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const element = e.target as HTMLButtonElement;
    dispatch(MessageActions.removeMessage(element.value));
  };

  return (
    <div>
      {messages && messages.length > 0
        ? messages.map((message) => (
            <div key={message.id} className="message">
              <p>{message.text}</p>
              <button
                onClick={(e) => onClose(e)}
                className="btn btn-primary"
                value={message.id} //to close the message div
              >
                Okay
              </button>
            </div>
          ))
        : null}
    </div>
  );
};

export default CustomMessage;
