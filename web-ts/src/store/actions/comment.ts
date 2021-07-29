import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import {
  Post_Comment,
  Like_Comment,
  Unlike_Comment,
  Edit_Comment,
  comment_data,
  Report_Comment,
} from '../interfaces';
import { CURRENT_IP } from '../../serverConfigs';

export const postComment = (text: string, dingId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.post<comment_data>(
        `${CURRENT_IP}/api/comments/${dingId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch<Post_Comment>({
        type: ActionTypes.POST_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const deleteComment = (commentId: string, dingId: string) => {
  return async () => {
    try {
      await axios.delete<comment_data>(
        `${CURRENT_IP}/api/comments/${commentId}/${dingId}`
      );
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const likeComment = (commentId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put<comment_data>(
        `${CURRENT_IP}/api/comments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch<Like_Comment>({
        type: ActionTypes.LIKE_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const unlikeComment = (commentId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.delete<comment_data>(
        `${CURRENT_IP}/api/comments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch<Unlike_Comment>({
        type: ActionTypes.UNLIKE_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const editComment = (text: string, commentId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({ text });

      const response = await axios.put<comment_data>(
        `${CURRENT_IP}/api/comments/${commentId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch<Edit_Comment>({
        type: ActionTypes.EDIT_COMMENT,
        comment: comment,
      });
    } catch (err) {
      throw new Error('Cannot connect with server. Please try again.');
    }
  };
};

export const reportComment = (commentId: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axios.put<comment_data>(
        `${CURRENT_IP}/api/comments/reports/${commentId}`
      );
      const comment = response.data.data;

      dispatch<Report_Comment>({
        type: ActionTypes.REPORT_COMMENT,
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
