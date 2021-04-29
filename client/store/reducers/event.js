import { GET_EVENT } from '../types';

const initialState = {
  event: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_EVENT:
      return {
        ...state,
        event: action.event,
      };
  }
  return state;
};
