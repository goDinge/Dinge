import axios from 'axios';
import {
  POST_EVENT_COMMENT,
  EDIT_EVENT_COMMENT,
  LIKE_EVENT_COMMENT,
  UNLIKE_EVENT_COMMENT,
  REPORT_EVENT_COMMENT,
} from '../types';
import { CURRENT_IP } from '../../serverConfigs.js';

export const postComment = (text, eventId) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.post(
        `${CURRENT_IP}/api/eventcomments/${eventId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch({
        type: POST_EVENT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const editComment = (text, commentId) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.put(
        `${CURRENT_IP}/api/eventcomments/${commentId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch({
        type: EDIT_EVENT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const deleteComment = (commentId, eventId) => {
  return async () => {
    try {
      await axios.delete(
        `${CURRENT_IP}/api/eventcomments/${commentId}/${eventId}`
      );
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const likeComment = (commentId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/eventcomments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch({
        type: LIKE_EVENT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeComment = (commentId) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${CURRENT_IP}/api/eventcomments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch({
        type: UNLIKE_EVENT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const reportComment = (commentId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${CURRENT_IP}/api/eventcomments/reports/${commentId}`
      );
      const comment = response.data.data;

      dispatch({
        type: REPORT_EVENT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      if (!err.response) {
        throw new Error('Cannot connect with server. Please try again.');
      } else {
        throw new Error(err.response.data);
      }
    }
  };
};
