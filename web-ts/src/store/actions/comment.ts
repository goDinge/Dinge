import axios from 'axios';
import { Dispatch } from 'redux';
import { ActionTypes } from '../types';
import { Post_Comment, comment_data } from '../interfaces';
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

export default postComment;
