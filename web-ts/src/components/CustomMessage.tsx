import React from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '../store/reducers/rootReducer';
import { Message } from '../store/interfaces';

const CustomMessage = () => {
  const messages: Message[] = useSelector((state: AppState) => state.message);
  console.log('custom message: ', messages);

  return (
    <div>
      {messages && messages.length > 0
        ? messages.map((message) => (
            <div
              key={message.id}
              className={`alert alert-${message.messageType}`}
            >
              {message.text}
            </div>
          ))
        : null}
    </div>
  );
};

export default CustomMessage;
