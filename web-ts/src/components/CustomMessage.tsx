import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { AppState } from '../store/reducers/rootReducer';
import { messageState } from '../store/interfaces';
import * as MessageActions from '../store/actions/message';

type component = 'message-ding';

const CustomMessage = (props: { component: component; delete: boolean }) => {
  const message: messageState = useSelector((state: AppState) => state.message);
  const messageStr = message.message;

  const { component } = props;
  let deleteDing = props.delete;

  const dispatch = useDispatch<Dispatch<any>>();

  const onClose = () => {
    dispatch(MessageActions.resetMessage());
    deleteDing = false;
    console.log(deleteDing);
  };

  return (
    <div className="message-overlay">
      <div className={component}>
        <p>{messageStr}</p>
        {deleteDing && messageStr ? (
          <div className="delete-button-container">
            <button onClick={onClose} className="btn btn-edit-modal">
              Okay
            </button>
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

// {deleteDing ? (
//   messageStr ? (
//     <div>
//       <button onClick={onClose} className="btn btn-primary">
//         Okay
//       </button>
//       <button onClick={onClose} className="btn btn-primary">
//         Cancel
//       </button>
//     </div>
//   ) : null
// ) : (
//   <button onClick={onClose} className="btn btn-primary">
//     Okay
//   </button>
// )}
