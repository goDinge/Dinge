import {
  GET_DINGE,
  GET_DING,
  POST_DING,
  GET_LOCAL_DINGE,
  UPDATE_DING_LOCATION,
} from '../types';

const initialState = {
  dinge: [],
  newDing: {},
  ding: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DINGE:
      return {
        ...state,
        dinge: action.dinge,
      };
    case GET_LOCAL_DINGE:
      return {
        ...state,
        dinge: action.dinge,
      };
    case GET_DING:
      return {
        ...state,
        ding: action.ding,
      };
    case POST_DING:
      return {
        ...state,
        newDing: action.dinge,
      };
    case UPDATE_DING_LOCATION:
      return {
        ...state,
        dinge: state.dinge.map((ding, index) => {
          if (ding._id === action.payload._id) {
            return {
              ...ding,
              location: {
                latitude: action.payload.location.latitude,
                longitude: action.payload.location.longitude,
              },
            };
          }
          return ding;
        }),
      };
  }
  return state;
};
