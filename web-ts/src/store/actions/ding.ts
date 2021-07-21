import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import { Get_Dinge_By_Id, Remove_Ding, ding_data } from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

export const getDing = (dingId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get<ding_data>(
        `${CURRENT_IP}/api/dinge/${dingId}`
      );
      const ding = response.data.data;

      dispatch<Get_Dinge_By_Id>({
        type: ActionTypes.GET_DING_BY_ID,
        ding: ding,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const removeDing = () => {
  return (dispatch: Dispatch) => {
    dispatch<Remove_Ding>({
      type: ActionTypes.REMOVE_DING,
      ding: {},
    });
  };
};

// export const removeMessage = (id: string) => {
//   return (dispatch: Dispatch) => {
//     dispatch({
//       type: ActionTypes.REMOVE_MESSAGE,
//       message: id,
//     });
//   };
// };
