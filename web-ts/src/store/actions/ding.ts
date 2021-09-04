import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import {
  Get_Ding_By_Id,
  Remove_Ding,
  Like_Ding,
  Unlike_Ding,
  Report_Ding,
  ding_data,
  Update_Ding_Description,
} from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

export const getDingById = (dingId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.get<ding_data>(
        `${CURRENT_IP}/api/dinge/${dingId}`
      );
      const ding = response.data.data;

      dispatch<Get_Ding_By_Id>({
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

export const likeDing = (dingId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put<ding_data>(
        `${CURRENT_IP}/api/ding/likes/${dingId}`
      );
      const ding = response.data.data;

      dispatch<Like_Ding>({
        type: ActionTypes.LIKE_DING,
        ding: ding,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeDing = (dingId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.delete<ding_data>(
        `${CURRENT_IP}/api/ding/likes/${dingId}`
      );
      const ding = response.data.data;

      dispatch<Unlike_Ding>({
        type: ActionTypes.UNLIKE_DING,
        ding: ding,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const reportDingById = (dingId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put<ding_data>(
        `${CURRENT_IP}/api/ding/reports/${dingId}`
      );
      const ding = response.data.data;

      dispatch<Report_Ding>({
        type: ActionTypes.REPORT_DING,
        ding: ding,
      });
    } catch (err: any) {
      if (!err.response) {
        throw new Error('Cannot connect with server. Please try again.');
      } else {
        throw new Error(err.response.data);
      }
    }
  };
};

export const updateDingDescription = (text: string, dingId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.put<ding_data>(
        `${CURRENT_IP}/api/ding/${dingId}`,
        body,
        config
      );
      const description = response.data.data;

      dispatch<Update_Ding_Description>({
        type: ActionTypes.UPDATE_DING_DESCRIPTION,
        ding: description,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};
