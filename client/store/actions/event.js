import axios from 'axios';
import { GET_EVENT, UPDATE_EVENT_LOCATION } from '../types';
import { HOME_IP } from '@env';

export const getEvent = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://${HOME_IP}/api/events/${id}`);
      const event = response.data.data;

      dispatch({
        type: GET_EVENT,
        event: event,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again. ');
    }
  };
};

// export const updateEventLocation = (eventId, location) => {
//   return async (dispatch) => {
//     try {
//       console.log('event action - IP used:', HOME_IP);

//       const response = await axios.put(
//         `${HOME_IP}/api/event/${eventId}/location?longitude=${location.longitude}&latitude=${location.latitude}`
//       );

//       const newLocation = response.data.data.location;
//       dispatch({
//         type: UPDATE_EVENT_LOCATION,
//         event: newLocation,
//       });
//     } catch (err) {
//       console.log(err.message);
//       throw new Error('Cannot connect with server. Please try again');
//     }
//   };
// };
