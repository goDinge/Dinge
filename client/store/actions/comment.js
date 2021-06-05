import axios from 'axios';
import {
  POST_COMMENT,
  EDIT_COMMENT,
  LIKE_COMMENT,
  UNLIKE_COMMENT,
  REPORT_COMMENT,
} from '../types';
import { HOME_IP } from '@env';

export const postComment = (text, dingId) => {
  return async (dispatch) => {
    try {
      console.log('comment action - IP used:', HOME_IP);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.post(
        `${HOME_IP}/api/comments/${dingId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch({
        type: POST_COMMENT,
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
        `${HOME_IP}/api/comments/${commentId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch({
        type: EDIT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};
export const deleteComment = (commentId, dingId) => {
  return async () => {
    try {
      await axios.delete(`${HOME_IP}/api/comments/${commentId}/${dingId}`);
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const likeComment = (commentId) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${HOME_IP}/api/comments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch({
        type: LIKE_COMMENT,
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
        `${HOME_IP}/api/comments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch({
        type: UNLIKE_COMMENT,
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
        `${HOME_IP}/api/comments/reports/${commentId}`
      );
      const comment = response.data.data;

      dispatch({
        type: REPORT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};
