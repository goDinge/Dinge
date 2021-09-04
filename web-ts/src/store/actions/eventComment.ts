import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import {
  Post_Event_Comment,
  Like_Event_Comment,
  Unlike_Event_Comment,
  Edit_Event_Comment,
  comment_data,
  Report_Event_Comment,
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
        `${CURRENT_IP}/api/eventcomments/${dingId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch<Post_Event_Comment>({
        type: ActionTypes.POST_EVENT_COMMENT,
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
        `${CURRENT_IP}/api/eventcomments/${commentId}/${dingId}`
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
        `${CURRENT_IP}/api/eventcomments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch<Like_Event_Comment>({
        type: ActionTypes.LIKE_EVENT_COMMENT,
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
        `${CURRENT_IP}/api/eventcomments/likes/${commentId}`
      );
      const comment = response.data.data;

      dispatch<Unlike_Event_Comment>({
        type: ActionTypes.UNLIKE_EVENT_COMMENT,
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
        `${CURRENT_IP}/api/eventcomments/${commentId}`,
        body,
        config
      );
      const comment = response.data.data;

      dispatch<Edit_Event_Comment>({
        type: ActionTypes.EDIT_EVENT_COMMENT,
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
        `${CURRENT_IP}/api/eventcomments/reports/${commentId}`
      );
      const comment = response.data.data;

      dispatch<Report_Event_Comment>({
        type: ActionTypes.REPORT_EVENT_COMMENT,
        comment: comment,
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
